<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $intendedRedirect = session('intended_role_redirect');
            
            if ($intendedRedirect) {
                session()->forget('intended_role_redirect');
                return redirect($intendedRedirect);
            }
        }

        return $next($request);
    }
}
