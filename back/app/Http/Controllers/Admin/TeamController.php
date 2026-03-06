<?php

namespace App\Http\Controllers\Admin;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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
            ->with('user')
            ->withCount(['players', 'matchesAsTeam1', 'matchesAsTeam2'])
            ->orderBy('priorite', 'desc')
            ->orderBy('nom')
            ->get()
            ->map(function ($team) {
                return [
                    ...$team->toArray(),
                    'matches_count' => $team->matches_as_team1_count + $team->matches_as_team2_count,
                    'logo_url' => $team->logo_url,
                    'has_account' => $team->user !== null,
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
            'logo' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'logo_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'priorite' => 'nullable|numeric|min:0|max:10',
            'create_account' => 'nullable|boolean',
            'account_email' => 'nullable|email|required_if:create_account,true|unique:users,email',
            'account_telephone' => 'nullable|string|max:20|required_if:create_account,true|unique:users,telephone',
            'account_password' => 'nullable|string|min:6|required_if:create_account,true',
        ]);

        $data = [
            'nom' => $validated['nom'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
            'priorite' => (int) ($validated['priorite'] ?? 0),
        ];

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        } elseif ($request->has('logo_url') && !empty($request->logo_url)) {
            // Keep backward compatibility with URL
            $data['logo'] = $request->logo_url;
        }

        $team = Team::create($data);

        // Create team account if requested
        if ($request->input('create_account')) {
            $user = User::create([
                'prenom' => $team->nom,
                'nom' => 'Équipe',
                'email' => $validated['account_email'],
                'telephone' => $validated['account_telephone'],
                'password' => Hash::make($validated['account_password']),
                'role' => User::ROLE_TEAM,
                'team_id' => $team->id,
            ]);
        }

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe créée avec succès' . (isset($user) ? ' et compte équipe généré' : ''));
    }

    /**
     * Show the form for editing the team.
     */
    public function edit(Team $team): Response
    {
        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team->load('user'),
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
            'logo' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'logo_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'priorite' => 'nullable|numeric|min:0|max:10',
        ]);

        $data = [
            'nom' => $validated['nom'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
            'priorite' => (int) ($validated['priorite'] ?? 0),
        ];

        // Handle logo upload (delete old file if exists)
        if ($request->hasFile('logo')) {
            // Delete old logo file if exists
            if ($team->logo_path) {
                Storage::disk('public')->delete($team->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        } elseif ($request->has('logo_url') && !empty($request->logo_url)) {
            // Keep backward compatibility with URL
            $data['logo'] = $request->logo_url;
        }

        $team->update($data);

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe mise à jour avec succès');
    }

    /**
     * Update team account credentials.
     */
    public function updateAccount(Request $request, Team $team)
    {
        if (!$team->user) {
            return back()->with('error', 'Cette équipe n\'a pas de compte');
        }

        $validated = $request->validate([
            'email' => 'nullable|email|max:255|unique:users,email,' . $team->user->id,
            'telephone' => 'required|string|max:20|unique:users,telephone,' . $team->user->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if (isset($validated['password'])) {
            $team->user->password = Hash::make($validated['password']);
        }

        $team->user->email = $validated['email'] ?? null;
        $team->user->telephone = $validated['telephone'];
        $team->user->save();

        return back()->with('success', 'Compte équipe mis à jour avec succès');
    }

    /**
     * Delete team account.
     */
    public function deleteAccount(Team $team)
    {
        if (!$team->user) {
            return back()->with('error', 'Cette équipe n\'a pas de compte');
        }

        $team->user->delete();

        return back()->with('success', 'Compte équipe supprimé avec succès');
    }

    /**
     * Remove the specified team from storage.
     */
    public function destroy(Team $team)
    {
        try {
            // Delete logo file if exists
            if ($team->logo_path) {
                Storage::disk('public')->delete($team->logo_path);
            }

            $team->delete();

            return redirect()->route('admin.teams.index')
                ->with('success', 'Équipe supprimée avec succès');
        } catch (\Exception $e) {
            return redirect()->route('admin.teams.index')
                ->with('error', 'Impossible de supprimer cette équipe. Elle est peut-être associée à des matchs ou des joueurs.');
        }
    }

    /**
     * Generate team account for existing team.
     */
    public function generateAccount(Request $request, Team $team)
    {
        if ($team->user) {
            return back()->with('error', 'Cette équipe a déjà un compte');
        }

        $validated = $request->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'telephone' => 'required|string|max:20|unique:users,telephone',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'prenom' => $team->nom,
            'nom' => 'Équipe',
            'email' => $validated['email'] ?? null,
            'telephone' => $validated['telephone'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_TEAM,
            'team_id' => $team->id,
        ]);

        return back()->with('success', 'Compte équipe généré avec succès');
    }
}
