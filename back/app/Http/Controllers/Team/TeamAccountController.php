<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\SportMatch;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeamAccountController extends Controller
{
    /**
     * Display team dashboard.
     */
    public function dashboard(): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        $players = $team->players()->orderBy('nom')->orderBy('prenom')->get();
        
        // Get upcoming matches (future matches only)
        $matches = SportMatch::query()
            ->where(function ($query) use ($team) {
                $query->where('team_1_id', $team->id)
                      ->orWhere('team_2_id', $team->id);
            })
            ->where('date_match', '>=', now())
            ->with(['team1', 'team2'])
            ->orderBy('date_match', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('Team/Dashboard', [
            'team' => $team,
            'playersCount' => $players->count(),
            'matches' => $matches,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Display team profile.
     */
    public function profile(): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        return Inertia::render('Team/Profile', [
            'team' => $team,
            'user' => $user,
        ]);
    }

    /**
     * Display rankings.
     */
    public function rankings(): Response
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        // Get teams ranking with their total points from votes
        $teamsRanking = \App\Models\Team::query()
            ->withSum('votesAsWinner', 'points')
            ->orderByDesc('priorite')
            ->get()
            ->map(function ($teamItem) {
                $totalPoints = $teamItem->votes_as_winner_sum_points ?? 0;
                return [
                    'id' => $teamItem->id,
                    'nom' => $teamItem->nom,
                    'code' => $teamItem->code,
                    'logo_url' => $teamItem->logo_url,
                    'priorite' => $teamItem->priorite,
                    'total_points' => $totalPoints,
                    'rank' => 0, // Will be set after sorting
                ];
            })
            ->sortByDesc('total_points')
            ->values()
            ->map(function ($teamItem, $index) {
                $teamItem['rank'] = $index + 1;
                return $teamItem;
            });

        return Inertia::render('Team/Rankings', [
            'teamsRanking' => $teamsRanking,
            'currentTeam' => [
                'id' => $team->id,
                'nom' => $team->nom,
                'code' => $team->code,
                'logo_url' => $team->logo_url,
            ],
        ]);
    }

    /**
     * Update team profile.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        $team = $user->team;

        if (!$team) {
            abort(403, 'Account not associated with any team');
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:teams,nom,' . $team->id,
            'code' => 'required|string|max:10|unique:teams,code,' . $team->id,
            'logo' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'logo_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $data = [
            'nom' => $validated['nom'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
        ];

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo file if exists
            if ($team->logo_path) {
                Storage::disk('public')->delete($team->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        } elseif ($request->has('logo_url') && !empty($request->logo_url)) {
            $data['logo'] = $request->logo_url;
        }

        $team->update($data);

        return redirect()->route('team.profile')
            ->with('success', 'Profil de l\'équipe mis à jour avec succès');
    }

    /**
     * Update account credentials.
     */
    public function updateCredentials(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'telephone' => 'required|string|max:20|unique:users,telephone,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->email = $validated['email'] ?? null;
        $user->telephone = $validated['telephone'];
        $user->save();

        return redirect()->route('team.profile')
            ->with('success', 'Identifiants mis à jour avec succès');
    }
}
