<?php

namespace App\Http\Controllers\Api;

use App\Models\Match;
use App\Models\VoteMatch;
use App\Models\VoteTournament;
use App\Models\PointSystem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VoteController
{
    /**
     * Vote for match winner and man of the match
     */
    public function voteMatch(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'match_id' => 'required|exists:matches,id',
                'team_vote_id' => 'required|exists:teams,id',
                'player_vote_id' => 'nullable|exists:players,id',
            ]);

            $match = \App\Models\SportMatch::findOrFail($validated['match_id']);

            // Check match hasn't started
            if ($match->date_match <= now()) {
                return response()->json([
                    'message' => 'Cannot vote on a match that has started',
                ], 422);
            }

            // Upsert vote (replace if already voted)
            $vote = VoteMatch::updateOrCreate(
                ['user_id' => auth('api')->id(), 'match_id' => $validated['match_id']],
                [
                    'team_vote_id' => $validated['team_vote_id'],
                    'player_vote_id' => $validated['player_vote_id'],
                ]
            );

            return response()->json([
                'message' => 'Vote registered successfully',
                'vote' => $vote->load([
                    'match' => function ($query) {
                        $query->with(['team1', 'team2']);
                    },
                    'teamVote',
                    'playerVote'
                ]),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Vote for tournament winner
     */
    public function voteTournament(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'team_vote_id' => 'required|exists:teams,id',
            ]);

            $vote = VoteTournament::updateOrCreate(
                ['user_id' => auth('api')->id(), 'tournament_id' => 1],
                ['team_vote_id' => $validated['team_vote_id']]
            );

            return response()->json([
                'message' => 'Tournament vote registered',
                'vote' => $vote->load('teamVote'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get user's votes
     */
    public function myVotes(): JsonResponse
    {
        $userId = auth('api')->id();

        $matchVotes = \App\Models\VoteMatch::where('user_id', $userId)
            ->with(['match' => function ($query) {
                $query->with(['team1', 'team2']);
            }, 'teamVote', 'playerVote'])
            ->get();

        return response()->json([
            'votes' => $matchVotes,
            'tournament_vote' => \App\Models\VoteTournament::where('user_id', $userId)
                ->with('teamVote')
                ->first(),
        ]);
    }
}
