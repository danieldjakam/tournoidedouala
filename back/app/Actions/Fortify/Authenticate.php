<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Contracts\AttemptsLoginResponse;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\LoginViewResponse;
use Laravel\Fortify\Contracts\LogoutResponse;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class Authenticate
{
    /**
     * Attempt to authenticate a new user.
     */
    public function authenticate($request, array $data)
    {
        $request->validate([
            Fortify::username() => 'required|string',
            'password' => 'required|string',
        ]);

        // Determine if login is via email or telephone
        $field = filter_var($data[Fortify::username()], FILTER_VALIDATE_EMAIL) 
            ? 'email' 
            : 'telephone';

        $user = User::where($field, $data[Fortify::username()])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return null;
        }

        // Only allow admin and team roles to login via web
        if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_TEAM])) {
            return null;
        }

        Auth::login($user, $data['remember'] ?? false);

        return $user;
    }

    /**
     * Get the redirect response for the authenticated user.
     */
    public function getRedirectResponse(User $user)
    {
        event(new Login($user));

        // Redirect based on role
        if ($user->role === User::ROLE_ADMIN) {
            return redirect()->intended('/admin/dashboard');
        }

        if ($user->role === User::ROLE_TEAM) {
            // Team users must have a team associated
            if (!$user->team) {
                Auth::logout();
                return redirect()
                    ->route('login')
                    ->withErrors([
                        Fortify::username() => 'Ce compte n\'est associé à aucune équipe. Contactez l\'administrateur.',
                    ]);
            }

            return redirect()->intended('/team');
        }

        // Default redirect for other roles (if any)
        return redirect()->intended(config('fortify.home', '/dashboard'));
    }
}
