<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\VoteMatch;
use App\Models\VoteTournament;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController
{
    /**
     * Get authenticated user's profile
     */
    public function profile(): JsonResponse
    {
        $user = auth('api')->user();

        return response()->json([
            'user' => [
                ...$user->toArray(),
                'avatar_url' => $user->avatar_url,
            ],
        ], 200);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = auth('api')->user();

            $validated = $request->validate([
                'prenom' => 'sometimes|string|max:255',
                'nom' => 'sometimes|string|max:255',
                'email' => ['sometimes', 'nullable', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'telephone' => ['sometimes', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
                'sexe' => 'sometimes|nullable|in:M,F,Autre',
                'date_naissance' => 'sometimes|nullable|date|before:today',
                'indicatif_pays' => 'sometimes|nullable|string|max:10',
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Profil mis à jour avec succès',
                'user' => [
                    ...$user->fresh()->toArray(),
                    'avatar_url' => $user->fresh()->avatar_url,
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Upload user avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        try {
            $user = auth('api')->user();

            $validated = $request->validate([
                'avatar' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Delete old avatar if exists
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar_path' => $avatarPath]);

            return response()->json([
                'message' => 'Avatar mis à jour avec succès',
                'avatar_url' => $user->fresh()->avatar_url,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Delete user avatar
     */
    public function deleteAvatar(): JsonResponse
    {
        $user = auth('api')->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return response()->json([
            'message' => 'Avatar supprimé avec succès',
            'avatar_url' => $user->fresh()->avatar_url,
        ], 200);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $user = auth('api')->user();

            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:4|max:4|regex:/^\d+$/',
                'confirm_password' => 'required|string|same:new_password',
            ]);

            // Verify current password
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Mot de passe actuel incorrect',
                ], 422);
            }

            // Update password
            $user->update([
                'password' => Hash::make($validated['new_password']),
            ]);

            return response()->json([
                'message' => 'Mot de passe modifié avec succès',
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get user activity (votes history)
     */
    public function activity(): JsonResponse
    {
        $user = auth('api')->user();

        // Get match votes with match details
        $matchVotes = VoteMatch::where('user_id', $user->id)
            ->with([
                'match.team1',
                'match.team2',
                'teamVote',
                'playerVote',
            ])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($vote) {
                return [
                    'id' => $vote->id,
                    'type' => 'match',
                    'match' => [
                        'id' => $vote->match->id,
                        'team1' => $vote->match->team1->nom,
                        'team2' => $vote->match->team2->nom,
                        'date_match' => $vote->match->date_match->toISOString(),
                        'score_team_1' => $vote->match->score_team_1,
                        'score_team_2' => $vote->match->score_team_2,
                        'statut' => $vote->match->statut,
                    ],
                    'team_vote' => $vote->teamVote?->nom,
                    'player_vote' => $vote->playerVote?->prenom . ' ' . $vote->playerVote?->nom,
                    'points' => $vote->points,
                    'validated' => $vote->validated,
                    'created_at' => $vote->created_at->toISOString(),
                ];
            });

        // Get tournament votes
        $tournamentVotes = VoteTournament::where('user_id', $user->id)
            ->with('teamVote')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($vote) {
                return [
                    'id' => $vote->id,
                    'type' => 'tournament',
                    'team_vote' => $vote->teamVote?->nom,
                    'points' => $vote->points,
                    'validated' => $vote->validated,
                    'created_at' => $vote->created_at->toISOString(),
                ];
            });

        // Calculate stats
        $totalVotes = $matchVotes->count() + $tournamentVotes->count();
        $correctVotes = $matchVotes->where('validated', true)->count() + $tournamentVotes->where('validated', true)->count();
        $totalPoints = $user->points;

        return response()->json([
            'activity' => [
                'match_votes' => $matchVotes,
                'tournament_votes' => $tournamentVotes,
            ],
            'stats' => [
                'total_votes' => $totalVotes,
                'correct_votes' => $correctVotes,
                'accuracy' => $totalVotes > 0 ? round(($correctVotes / $totalVotes) * 100, 1) : 0,
                'total_points' => $totalPoints,
            ],
        ], 200);
    }

    /**
     * Get user statistics
     */
    public function stats(): JsonResponse
    {
        $user = auth('api')->user();

        // Calculate rank
        $rank = User::where('role', 'user')
            ->where('points', '>', $user->points)
            ->count() + 1;

        // Get vote counts
        $matchVotesCount = VoteMatch::where('user_id', $user->id)->count();
        $tournamentVotesCount = VoteTournament::where('user_id', $user->id)->count();
        $correctVotesCount = VoteMatch::where('user_id', $user->id)->where('validated', true)->count();

        // Calculate accuracy
        $totalVotes = $matchVotesCount + $tournamentVotesCount;
        $accuracy = $totalVotes > 0 ? round(($correctVotesCount / $totalVotes) * 100, 1) : 0;

        return response()->json([
            'stats' => [
                'total_points' => $user->points,
                'rank' => $rank,
                'predictions_count' => $totalVotes,
                'match_votes' => $matchVotesCount,
                'tournament_votes' => $tournamentVotesCount,
                'correct_votes' => $correctVotesCount,
                'accuracy' => $accuracy,
            ],
        ], 200);
    }
}
