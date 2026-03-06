<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;

class AuthenticateUser
{
    /**
     * Authenticate the user.
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->only([Fortify::username(), 'password', 'remember']);
        
        $field = filter_var($credentials[Fortify::username()], FILTER_VALIDATE_EMAIL) 
            ? 'email' 
            : 'telephone';

        $user = User::where($field, $credentials[Fortify::username()])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        // Only allow admin and team roles
        if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_TEAM])) {
            return null;
        }

        // Team users must have a team
        if ($user->role === User::ROLE_TEAM && !$user->team) {
            return null;
        }

        Auth::login($user, $credentials['remember'] ?? false);

        // Store intended redirect in session
        session(['intended_role_redirect' => $this->getRedirectForRole($user)]);

        return $user;
    }

    /**
     * Get redirect path for user role.
     */
    private function getRedirectForRole(User $user): string
    {
        if ($user->role === User::ROLE_ADMIN) {
            return '/admin/dashboard';
        }

        if ($user->role === User::ROLE_TEAM) {
            return '/team';
        }

        return '/dashboard';
    }
}
