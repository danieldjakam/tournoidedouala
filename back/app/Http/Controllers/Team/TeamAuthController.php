<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class TeamAuthController extends Controller
{
    /**
     * Show team login form.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Team/Auth/Login');
    }

    /**
     * Handle team login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'telephone' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('telephone', $credentials['telephone'])
            ->where('role', 'team')
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'telephone' => 'Identifiants incorrects',
            ])->onlyInput('telephone');
        }

        if (!$user->team) {
            return back()->withErrors([
                'telephone' => 'Ce compte n\'est associé à aucune équipe',
            ]);
        }

        auth()->login($user);

        return redirect()->intended(route('team.dashboard'));
    }

    /**
     * Handle team logout.
     */
    public function logout()
    {
        auth()->logout();
        return redirect()->route('team.login');
    }
}
