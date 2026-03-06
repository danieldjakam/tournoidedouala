<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\SportMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamMatchController extends Controller
{
    /**
     * Display matches for the authenticated team.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        $matches = SportMatch::query()
            ->where('team_1_id', $team->id)
            ->orWhere('team_2_id', $team->id)
            ->with(['team1', 'team2'])
            ->orderBy('date_match', 'desc')
            ->get();

        return Inertia::render('Team/Matches/Index', [
            'team' => $team,
            'matches' => $matches,
        ]);
    }

    /**
     * Display match details with composition.
     */
    public function show(SportMatch $match): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team || ($match->team_1_id !== $team->id && $match->team_2_id !== $team->id)) {
            abort(403, 'Accès non autorisé à ce match');
        }

        $match->load(['team1', 'team2', 'players.player']);

        $isTeam1 = $match->team_1_id === $team->id;
        $teamPlayers = $team->players()->get();

        return Inertia::render('Team/Matches/Show', [
            'match' => $match,
            'team' => $team,
            'isTeam1' => $isTeam1,
            'players' => $teamPlayers,
        ]);
    }

    /**
     * Save composition for a match.
     */
    public function saveComposition(Request $request, SportMatch $match)
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team || ($match->team_1_id !== $team->id && $match->team_2_id !== $team->id)) {
            abort(403, 'Accès non autorisé à ce match');
        }

        $validated = $request->validate([
            'players' => 'required|array',
            'players.*.player_id' => 'required|exists:players,id',
            'players.*.poste' => 'required|string|in:GK,CB,LB,RB,CDM,CM,CAM,LW,RW,ST',
            'players.*.titulaire' => 'boolean',
            'players.*.minutes' => 'nullable|integer|min:0|max:120',
        ]);

        // Verify all players belong to the team
        $teamPlayerIds = $team->players()->pluck('id')->toArray();
        foreach ($validated['players'] as $playerData) {
            if (!in_array($playerData['player_id'], $teamPlayerIds)) {
                abort(403, 'Un joueur n\'appartient pas à votre équipe');
            }
        }

        // Sync players for this match
        $match->players()->detach();

        foreach ($validated['players'] as $playerData) {
            $match->players()->attach($playerData['player_id'], [
                'poste' => $playerData['poste'],
                'titulaire' => $playerData['titulaire'] ?? false,
                'minutes' => $playerData['minutes'] ?? 90,
            ]);
        }

        return redirect()->route('team.matches.show', $match)
            ->with('success', 'Composition enregistrée avec succès');
    }
}
