<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController
{
    /**
     * Get all teams
     */
    public function index(): JsonResponse
    {
        $teams = Team::all();

        return response()->json([
            'data' => $teams,
        ], 200);
    }

    /**
     * Get a specific team with its players
     */
    public function show(Team $team): JsonResponse
    {
        $data = [
            'data' => $team->load('players'),
        ];

        return response()->json($data, 200);
    }

    /**
     * Get players for a team (optionally for a specific match)
     */
    public function getPlayers(Team $team, Request $request): JsonResponse
    {
        $query = $team->players();

        if ($request->has('match_id')) {
            $query->wherePivot('match_id', $request->match_id);
        }

        $players = $query->get()->map(fn ($player) => [
            'id' => $player->id,
            'prenom' => $player->prenom,
            'nom' => $player->nom,
            'numero' => $player->numero,
            'poste' => $player->pivot->poste ?? null,
            'titulaire' => $player->pivot->titulaire ?? null,
        ]);

        return response()->json([
            'data' => $players,
        ], 200);
    }
}
