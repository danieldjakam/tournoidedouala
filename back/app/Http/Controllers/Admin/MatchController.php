<?php

namespace App\Http\Controllers\Admin;

use App\Models\SportMatch;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatchController
{
    /**
     * Display a listing of matches.
     */
    public function index(): Response
    {
        $matches = SportMatch::with(['team1', 'team2', 'playerMatches'])
            ->orderBy('date_match', 'desc')
            ->get()
            ->map(function ($match) {
                return [
                    ...$match->toArray(),
                    'team1' => $match->team1,
                    'team2' => $match->team2,
                    'player_matches_count' => $match->playerMatches->count(),
                ];
            });

        return Inertia::render('Admin/Matches/Index', [
            'matches' => $matches,
            'success' => session('success'),
        ]);
    }

    /**
     * Show detail page for a match with all management options.
     */
    public function detail(SportMatch $match): Response
    {
        $match->load(['team1.players', 'team2.players', 'playerMatches.player']);

        return Inertia::render('Admin/Matches/MatchDetail', [
            'match' => [
                ...$match->toArray(),
                'team1' => [
                    ...$match->team1->toArray(),
                    'players' => $match->team1->players->toArray(),
                ],
                'team2' => [
                    ...$match->team2->toArray(),
                    'players' => $match->team2->players->toArray(),
                ],
                'playerMatches' => $match->playerMatches->map(function ($pm) {
                    return [
                        ...$pm->toArray(),
                        'player' => $pm->player ? $pm->player->toArray() : null,
                    ];
                })->toArray(),
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Show form for creating a new match.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Matches/Create', [
            'teams' => Team::orderBy('nom')->get(),
        ]);
    }

    /**
     * Store a newly created match.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_1_id' => 'required|exists:teams,id',
            'team_2_id' => 'required|exists:teams,id|different:team_1_id',
            'date_match' => 'required|date',
            'lieu' => 'nullable|string|max:255',
            'statut' => 'required|in:planifie,en_cours,termine',
            'score_team_1' => 'nullable|integer|min:0',
            'score_team_2' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        SportMatch::create($validated);

        return redirect()->route('admin.matches.index')
            ->with('success', 'Match créé avec succès');
    }

    /**
     * Show form for editing a match.
     */
    public function edit(SportMatch $match): Response
    {
        return Inertia::render('Admin/Matches/Edit', [
            'match' => $match->load(['team1', 'team2']),
            'teams' => Team::orderBy('nom')->get(),
        ]);
    }

    /**
     * Update the specified match.
     */
    public function update(Request $request, SportMatch $match)
    {
        $validated = $request->validate([
            'team_1_id' => 'required|exists:teams,id',
            'team_2_id' => 'required|exists:teams,id|different:team_1_id',
            'date_match' => 'required|date',
            'lieu' => 'nullable|string|max:255',
            'statut' => 'in:planifie,en_cours,termine',
            'score_team_1' => 'nullable|integer|min:0',
            'score_team_2' => 'nullable|integer|min:0',
            'homme_du_match_id' => 'nullable|exists:players,id',
            'compo_publique' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $match->update($validated);

        return redirect()->route('admin.matches.detail', $match)
            ->with('success', 'Match mis à jour avec succès');
    }

    /**
     * Delete the specified match.
     */
    public function destroy(SportMatch $match)
    {
        try {
            $match->delete();

            return redirect()->route('admin.matches.index')
                ->with('success', 'Match supprimé avec succès');
        } catch (\Exception $e) {
            return redirect()->route('admin.matches.index')
                ->with('error', 'Impossible de supprimer ce match.');
        }
    }

    /**
     * Save composition for a match.
     */
    public function saveComposition(Request $request, SportMatch $match)
    {
        $validated = $request->validate([
            'compositions' => 'required|array',
            'compositions.*.player_id' => 'required|exists:players,id',
            'compositions.*.poste' => 'required|in:GK,LB,CB,RB,LWB,RWB,CDM,CM,CAM,LM,RM,LW,RW,ST,CF,LF,RF',
            'compositions.*.titulaire' => 'boolean',
            'compositions.*.minutes' => 'nullable|integer|min:0|max:120',
        ]);

        // Delete existing compositions for this match
        $match->playerMatches()->delete();

        // Create new compositions
        foreach ($validated['compositions'] as $composition) {
            $match->playerMatches()->create($composition);
        }

        return redirect()->route('admin.matches.detail', $match)
            ->with('success', 'Composition enregistrée avec succès');
    }
}
