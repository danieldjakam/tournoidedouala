<?php

namespace App\Http\Controllers\Admin;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController
{
    /**
     * Display a listing of teams.
     */
    public function index(): Response
    {
        $teams = Team::query()
            ->withCount(['players', 'matchesAsTeam1', 'matchesAsTeam2'])
            ->orderBy('priorite', 'desc')
            ->orderBy('nom')
            ->get()
            ->map(function ($team) {
                return [
                    ...$team->toArray(),
                    'matches_count' => $team->matches_as_team1_count + $team->matches_as_team2_count,
                ];
            });

        return Inertia::render('Admin/Teams/Index', [
            'teams' => $teams,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new team.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Teams/Create');
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:teams',
            'code' => 'required|string|max:10|unique:teams',
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'priorite' => 'integer|min:0|max:10',
        ]);

        Team::create($validated);

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe créée avec succès');
    }

    /**
     * Show the form for editing the team.
     */
    public function edit(Team $team): Response
    {
        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team,
        ]);
    }

    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:teams,nom,' . $team->id,
            'code' => 'required|string|max:10|unique:teams,code,' . $team->id,
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'priorite' => 'integer|min:0|max:10',
        ]);

        $team->update($validated);

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe mise à jour avec succès');
    }

    /**
     * Remove the specified team from storage.
     */
    public function destroy(Team $team)
    {
        try {
            $team->delete();

            return redirect()->route('admin.teams.index')
                ->with('success', 'Équipe supprimée avec succès');
        } catch (\Exception $e) {
            return redirect()->route('admin.teams.index')
                ->with('error', 'Impossible de supprimer cette équipe. Elle est peut-être associée à des matchs ou des joueurs.');
        }
    }
}
