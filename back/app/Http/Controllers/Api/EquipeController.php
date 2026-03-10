<?php

namespace App\Http\Controllers\Api;

use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class EquipeController
{
    /**
     * Get the authenticated team's information
     */
    public function myTeam(): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        $team = $user->team->load(['players' => function ($query) {
            $query->orderBy('poste')
                  ->orderBy('numero');
        }]);

        return response()->json([
            'team' => $team,
        ], 200);
    }

    /**
     * Get players for the authenticated team (bordereau)
     */
    public function myPlayers(): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        $players = $user->team->players()
            ->orderBy('poste')
            ->orderBy('numero')
            ->get();

        return response()->json([
            'players' => $players,
        ], 200);
    }

    /**
     * Add a player to the team's roster
     */
    public function addPlayer(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'numero' => 'required|string|max:10',
                'poste' => 'required|in:gardien,defenseur,milieu,attaquant',
                'age' => 'nullable|integer|min:16|max:50',
                'buts' => 'nullable|integer|min:0',
                'est_capitaine' => 'nullable|boolean',
                'date_naissance' => 'nullable|date',
                'nationalite' => 'nullable|string|max:100',
                'bio' => 'nullable|string',
            ]);

            // If this player is set as captain, unset all other captains
            if (!empty($validated['est_capitaine'])) {
                $user->team->players()->update(['est_capitaine' => false]);
            }

            $player = $user->team->players()->create($validated);

            return response()->json([
                'message' => 'Player added successfully',
                'player' => $player,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Update a player in the team's roster
     */
    public function updatePlayer(Request $request, Player $player): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        // Check if player belongs to user's team
        if ($player->team_id !== $user->team->id) {
            return response()->json([
                'message' => 'Player not found in your team',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'prenom' => 'sometimes|required|string|max:255',
                'nom' => 'sometimes|required|string|max:255',
                'numero' => 'sometimes|required|string|max:10',
                'poste' => 'sometimes|required|in:gardien,defenseur,milieu,attaquant',
                'age' => 'nullable|integer|min:16|max:50',
                'buts' => 'nullable|integer|min:0',
                'est_capitaine' => 'nullable|boolean',
                'date_naissance' => 'nullable|date',
                'nationalite' => 'nullable|string|max:100',
                'bio' => 'nullable|string',
            ]);

            // If this player is set as captain, unset all other captains
            if (!empty($validated['est_capitaine'])) {
                $user->team->players()
                    ->where('id', '!=', $player->id)
                    ->update(['est_capitaine' => false]);
            }

            $player->update($validated);

            return response()->json([
                'message' => 'Player updated successfully',
                'player' => $player->fresh(),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Delete a player from the team's roster
     */
    public function deletePlayer(Player $player): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        // Check if player belongs to user's team
        if ($player->team_id !== $user->team->id) {
            return response()->json([
                'message' => 'Player not found in your team',
            ], 404);
        }

        $player->delete();

        return response()->json([
            'message' => 'Player deleted successfully',
        ], 200);
    }

    /**
     * Update team information (for equipe role users)
     */
    public function updateTeam(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'description' => 'nullable|string',
                'logo' => 'nullable|string',
            ]);

            $user->team->update($validated);

            return response()->json([
                'message' => 'Team updated successfully',
                'team' => $user->team->fresh(),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Upload team logo
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user || !$user->isEquipe() || !$user->team) {
            return response()->json([
                'message' => 'User is not associated with a team',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'logo' => 'required|image|max:2048', // max 2MB
            ]);

            // Delete old logo if exists
            if ($user->team->logo_path) {
                Storage::disk('public')->delete($user->team->logo_path);
            }

            // Store new logo
            $path = $request->file('logo')->store('team-logos', 'public');

            $user->team->update([
                'logo_path' => $path,
            ]);

            return response()->json([
                'message' => 'Logo uploaded successfully',
                'logo_url' => $user->team->logo_url,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }
}
