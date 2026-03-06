<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TeamMiddleware
{
    /**
     * Handle an incoming request for team accounts.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'team') {
            abort(403, 'Accès réservé aux comptes équipe');
        }

        if (!auth()->user()->team) {
            abort(403, 'Ce compte n\'est associé à aucune équipe');
        }

        return $next($request);
    }
}
