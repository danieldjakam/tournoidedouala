<?php

namespace App\Http\Controllers\Api;

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
     * Once voted, user cannot modify or delete their vote
     */
    public function voteMatch(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'match_id' => 'required|exists:matches,id',
                'team_vote_id' => 'required|exists:teams,id',
                'player_vote_id' => 'nullable|exists:players,id',
            ]);

            $userId = auth('api')->id();
            $match = \App\Models\SportMatch::findOrFail($validated['match_id']);

            // Check if user has already voted for this match
            $existingVote = VoteMatch::where('user_id', $userId)
                ->where('match_id', $match->id)
                ->first();

            if ($existingVote) {
                return response()->json([
                    'message' => 'Vous avez déjà voté pour ce match. Votre pronostic ne peut plus être modifié.',
                    'vote' => $existingVote->load(['teamVote', 'playerVote']),
                ], 409); // Conflict
            }

            // Check match hasn't started
            if ($match->date_match <= now()) {
                return response()->json([
                    'message' => 'Cannot vote on a match that has started',
                ], 422);
            }

            // Create new vote
            $vote = VoteMatch::create([
                'user_id' => $userId,
                'match_id' => $validated['match_id'],
                'team_vote_id' => $validated['team_vote_id'],
                'player_vote_id' => $validated['player_vote_id'],
            ]);

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
     * Vote is unique and cannot be modified
     */
    public function voteTournament(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'team_vote_id' => 'required|exists:teams,id',
            ]);

            $userId = auth('api')->id();

            // Check if user has already voted
            $existingVote = VoteTournament::where('user_id', $userId)
                ->where('tournament_id', 1)
                ->first();

            if ($existingVote) {
                return response()->json([
                    'message' => 'Vous avez déjà voté pour le vainqueur du tournoi. Votre pronostic ne peut plus être modifié.',
                    'vote' => $existingVote->load('teamVote'),
                ], 409); // Conflict
            }

            // Check if tournament voting is locked (first match has started)
            $firstMatch = \App\Models\SportMatch::orderBy('date_match', 'asc')->first();
            if ($firstMatch && $firstMatch->date_match <= now()) {
                return response()->json([
                    'message' => 'Les pronostics pour le vainqueur du tournoi sont fermés.',
                ], 422);
            }

            // Create new vote
            $vote = VoteTournament::create([
                'user_id' => $userId,
                'tournament_id' => 1,
                'team_vote_id' => $validated['team_vote_id'],
            ]);

            return response()->json([
                'message' => 'Pronostic enregistré avec succès',
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
            ->with(['match.team1', 'match.team2', 'teamVote', 'playerVote'])
            ->get();

        return response()->json([
            'votes' => $matchVotes,
            'tournament_vote' => \App\Models\VoteTournament::where('user_id', $userId)
                ->with('teamVote')
                ->first(),
        ]);
    }
}
