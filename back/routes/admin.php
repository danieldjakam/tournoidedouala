<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MatchController;
use App\Http\Controllers\Admin\PlayerController;
use App\Http\Controllers\Admin\PointSystemController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RankingController;
use App\Http\Controllers\Admin\TeamController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile management
    Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('profile/update', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::post('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Teams management
    Route::resource('teams', TeamController::class);

    // Players management
    Route::resource('players', PlayerController::class);

    // Matches management
    Route::resource('matches', MatchController::class);
    Route::get('matches/{match}/detail', [MatchController::class, 'detail'])->name('matches.detail');
    Route::post('matches/{match}/composition', [MatchController::class, 'saveComposition'])->name('matches.save-composition');
    Route::get('matches/{match}/composition', [MatchController::class, 'editComposition'])->name('matches.composition');

    // Point system configuration
    Route::resource('point-system', PointSystemController::class)->only('index', 'update');

    // Rankings
    Route::get('rankings', [RankingController::class, 'index'])->name('rankings.index');
    Route::get('rankings/teams', [RankingController::class, 'teams'])->name('rankings.teams');
    Route::get('rankings/users', [RankingController::class, 'users'])->name('rankings.users');
});
