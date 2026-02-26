<?php

namespace App\Http\Controllers\Admin;

use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController
{
    /**
     * Display players list, optionally filtered by team.
     */
    public function index(Request $request): Response
    {
        $query = Player::query()->with('team');

        if ($request->has('team_id')) {
            $query->where('team_id', $request->team_id);
        }

        $players = $query->orderBy('nom')->orderBy('prenom')->get();
        $teams = Team::orderBy('nom')->get();

        return Inertia::render('Admin/Players/Index', [
            'players' => $players,
            'teams' => $teams,
            'selectedTeam' => $request->integer('team_id'),
            'success' => session('success'),
        ]);
    }

    /**
     * Show form for creating a new player.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Players/PlayerForm', [
            'teams' => Team::orderBy('nom')->get(),
        ]);
    }

    /**
     * Store a newly created player.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'numero' => 'nullable|integer|min:1|max:99',
            'date_naissance' => 'nullable|date',
            'nationalite' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        Player::create($validated);

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueur créé avec succès');
    }

    /**
     * Show form for editing a player.
     */
    public function edit(Player $player): Response
    {
        return Inertia::render('Admin/Players/PlayerForm', [
            'player' => $player->load('team'),
            'teams' => Team::orderBy('nom')->get(),
        ]);
    }

    /**
     * Update the specified player.
     */
    public function update(Request $request, Player $player)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'numero' => 'nullable|integer|min:1|max:99',
            'date_naissance' => 'nullable|date',
            'nationalite' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $player->update($validated);

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueur mis à jour avec succès');
    }

    /**
     * Delete the specified player.
     */
    public function destroy(Player $player)
    {
        try {
            $player->delete();

            return redirect()->route('admin.players.index')
                ->with('success', 'Joueur supprimé avec succès');
        } catch (\Exception $e) {
            return redirect()->route('admin.players.index')
                ->with('error', 'Impossible de supprimer ce joueur. Il est peut-être associé à des matchs.');
        }
    }
}
