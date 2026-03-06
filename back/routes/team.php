<?php

use App\Http\Controllers\Team\TeamAccountController;
use App\Http\Controllers\Team\TeamMatchController;
use App\Http\Controllers\Team\TeamPlayerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Team Routes
|--------------------------------------------------------------------------
|
| These routes are dedicated to team accounts for managing their own
| teams, players, and match compositions.
|
| Note: Authentication is handled by the main login (/login)
|       Logout is handled by /logout
|
*/

// Team logout route
Route::middleware('web')->group(function () {
    Route::post('/team/logout', function () {
        auth()->logout();
        session()->invalidate();
        session()->regenerateToken();
        return redirect('/login');
    })->name('team.logout');
});

// Team routes (require team authentication)
Route::middleware(['auth', 'team'])->group(function () {
    // Dashboard
    Route::get('/team', [TeamAccountController::class, 'dashboard'])->name('team.dashboard');

    // Profile management
    Route::get('/team/profile', [TeamAccountController::class, 'profile'])->name('team.profile');
    Route::post('/team/profile/update', [TeamAccountController::class, 'updateProfile'])->name('team.profile.update');
    Route::post('/team/profile/credentials', [TeamAccountController::class, 'updateCredentials'])->name('team.profile.credentials');

    // Rankings
    Route::get('/team/rankings', [TeamAccountController::class, 'rankings'])->name('team.rankings');

    // Players management
    Route::get('/team/players', [TeamPlayerController::class, 'index'])->name('team.players.index');
    Route::get('/team/players/create', [TeamPlayerController::class, 'create'])->name('team.players.create');
    Route::post('/team/players', [TeamPlayerController::class, 'store'])->name('team.players.store');
    Route::get('/team/players/{player}/edit', [TeamPlayerController::class, 'edit'])->name('team.players.edit');
    Route::put('/team/players/{player}', [TeamPlayerController::class, 'update'])->name('team.players.update');
    Route::delete('/team/players/{player}', [TeamPlayerController::class, 'destroy'])->name('team.players.destroy');

    // Matches management
    Route::get('/team/matches', [TeamMatchController::class, 'index'])->name('team.matches.index');
    Route::get('/team/matches/{match}', [TeamMatchController::class, 'show'])->name('team.matches.show');
    Route::post('/team/matches/{match}/composition', [TeamMatchController::class, 'saveComposition'])->name('team.matches.save-composition');
});
