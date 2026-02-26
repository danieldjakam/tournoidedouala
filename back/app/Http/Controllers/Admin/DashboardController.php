<?php

namespace App\Http\Controllers\Admin;

use App\Models\Team;
use App\Models\Player;
use App\Models\SportMatch;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'teams_count' => Team::count(),
            'players_count' => Player::count(),
            'matches_count' => SportMatch::count(),
            'upcomingMatches' => SportMatch::where('date_match', '>=', Carbon::now())
                ->with('team1', 'team2')
                ->orderBy('date_match')
                ->take(5)
                ->get()
                ->toArray(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
