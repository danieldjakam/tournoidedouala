<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamPlayerController extends Controller
{
    /**
     * Display players for the authenticated team.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        $players = $team->players()->orderBy('nom')->orderBy('prenom')->get();

        return Inertia::render('Team/Players/Index', [
            'team' => $team,
            'players' => $players,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Show form for creating a new player.
     */
    public function create(): Response
    {
        return Inertia::render('Team/Players/PlayerForm', [
            'team' => auth()->user()->team,
        ]);
    }

    /**
     * Store a newly created player for the team.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'numero' => 'nullable|integer|min:1|max:99',
            'date_naissance' => 'nullable|date',
            'nationalite' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $validated['team_id'] = $team->id;

        Player::create($validated);

        return redirect()->route('team.players.index')
            ->with('success', 'Joueur créé avec succès');
    }

    /**
     * Show form for editing a player.
     */
    public function edit(Player $player): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team || $player->team_id !== $team->id) {
            abort(403, 'Accès non autorisé à ce joueur');
        }

        return Inertia::render('Team/Players/PlayerForm', [
            'player' => $player->load('team'),
            'team' => $team,
        ]);
    }

    /**
     * Update the specified player.
     */
    public function update(Request $request, Player $player)
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team || $player->team_id !== $team->id) {
            abort(403, 'Accès non autorisé à ce joueur');
        }

        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'numero' => 'nullable|integer|min:1|max:99',
            'date_naissance' => 'nullable|date',
            'nationalite' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $player->update($validated);

        return redirect()->route('team.players.index')
            ->with('success', 'Joueur mis à jour avec succès');
    }

    /**
     * Delete the specified player.
     */
    public function destroy(Player $player)
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team || $player->team_id !== $team->id) {
            abort(403, 'Accès non autorisé à ce joueur');
        }

        try {
            $player->delete();

            return redirect()->route('team.players.index')
                ->with('success', 'Joueur supprimé avec succès');
        } catch (\Exception $e) {
            return redirect()->route('team.players.index')
                ->with('error', 'Impossible de supprimer ce joueur. Il est peut-être associé à des matchs.');
        }
    }
}
