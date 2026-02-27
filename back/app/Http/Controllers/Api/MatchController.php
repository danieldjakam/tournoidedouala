<?php

namespace App\Http\Controllers\Api;

use App\Models\SportMatch;
use App\Models\VoteMatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchController
{
    /**
     * Get all matches with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = SportMatch::query()
            ->with(['team1', 'team2'])
            ->orderBy('date_match', 'asc');

        // Filter by status (support both frontend and backend status names)
        if ($request->has('statut')) {
            $status = $request->statut;
            // Map frontend status to backend status
            $statusMap = [
                'planifie' => 'planifie',
                'upcoming' => 'planifie',
                'en_cours' => 'en_cours',
                'live' => 'en_cours',
                'termine' => 'termine',
                'finished' => 'termine',
            ];
            $query->where('statut', $statusMap[$status] ?? $status);
        }

        // Filter by date range
        if ($request->has('from')) {
            $query->whereDate('date_match', '>=', $request->from);
        }

        if ($request->has('to')) {
            $query->whereDate('date_match', '<=', $request->to);
        }

        $matches = $query->paginate(15);

        return response()->json($matches);
    }

    /**
     * Get a single match with composition (if 1h before or public)
     */
    public function show(SportMatch $match): JsonResponse
    {
        $data = [
            'match' => $match->load(['team1', 'team2', 'votes' => function ($query) {
                $query->where('user_id', auth('api')->id())->first();
            }]),
        ];

        // Include composition if visible
        if ($match->isCompositionVisible()) {
            $data['composition'] = [
                'team1' => $match->team1->players()
                    ->wherePivot('match_id', $match->id)
                    ->get()
                    ->map(fn ($p) => [
                        'id' => $p->id,
                        'prenom' => $p->prenom,
                        'nom' => $p->nom,
                        'numero' => $p->numero,
                        'poste' => $p->pivot->poste,
                        'titulaire' => $p->pivot->titulaire,
                    ]),
                'team2' => $match->team2->players()
                    ->wherePivot('match_id', $match->id)
                    ->get()
                    ->map(fn ($p) => [
                        'id' => $p->id,
                        'prenom' => $p->prenom,
                        'nom' => $p->nom,
                        'numero' => $p->numero,
                        'poste' => $p->pivot->poste,
                        'titulaire' => $p->pivot->titulaire,
                    ]),
            ];
        } else {
            $data['composition'] = null;
            $data['minutes_until_composition'] = now()->diffInMinutes($match->date_match);
        }

        return response()->json($data);
    }

    /**
     * Get match history
     */
    public function history(): JsonResponse
    {
        $history = SportMatch::where('statut', 'termine')
            ->with(['team1', 'team2'])
            ->orderBy('date_match', 'desc')
            ->paginate(20);

        return response()->json($history);
    }

    /**
     * Get user's vote for a specific match
     */
    public function getUserVote(SportMatch $match): JsonResponse
    {
        $userId = auth('api')->id();

        $vote = VoteMatch::where('user_id', $userId)
            ->where('match_id', $match->id)
            ->with(['teamVote', 'playerVote'])
            ->first();

        return response()->json([
            'vote' => $vote,
            'has_voted' => $vote !== null,
        ]);
    }
}
