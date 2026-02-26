<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Team;
use Illuminate\Http\JsonResponse;

class RankingController
{
    /**
     * Get user rankings by points
     */
    public function users(): JsonResponse
    {
        $rankings = User::where('role', 'user')
            ->orderBy('points', 'desc')
            ->select('id', 'prenom', 'nom', 'telephone', 'points')
            ->withCount('votesMatch as match_votes')
            ->withCount('votesTournament as tournament_votes')
            ->paginate(50);

        return response()->json($rankings);
    }

    /**
     * Get team rankings by total points earned
     */
    public function teams(): JsonResponse
    {
        $rankings = Team::withSum('votesAsWinner', 'points')
            ->withSum('tournamentVotes', 'points')
            ->select('id', 'nom', 'code', 'logo', 'priorite')
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->id,
                    'nom' => $team->nom,
                    'code' => $team->code,
                    'logo' => $team->logo,
                    'priorite' => $team->priorite,
                    'total_points' => ($team->votes_as_winner_sum_points ?? 0) + ($team->tournament_votes_sum_points ?? 0),
                ];
            })
            ->sortByDesc('total_points')
            ->values();

        return response()->json($rankings);
    }

    /**
     * Get user's current rank
     */
    public function myRank(): JsonResponse
    {
        $user = auth('api')->user();

        $rank = User::where('role', 'user')
            ->where('points', '>', $user->points)
            ->count() + 1;

        return response()->json([
            'rank' => $rank,
            'user' => $user,
            'points' => $user->points,
        ]);
    }
}
