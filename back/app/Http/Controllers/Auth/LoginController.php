<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Fortify\Authenticate;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Fortify;

class LoginController extends Controller
{
    /**
     * Handle login attempts.
     */
    public function login(Request $request, Authenticate $authenticate)
    {
        $user = $authenticate->authenticate($request, $request->only([
            Fortify::username(),
            'password',
            'remember',
        ]));

        if (!$user) {
            return back()
                ->withErrors([
                    Fortify::username() => 'Identifiants incorrects ou compte non autorisé.',
                ])
                ->onlyInput(Fortify::username());
        }

        return $authenticate->getRedirectResponse($user);
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
