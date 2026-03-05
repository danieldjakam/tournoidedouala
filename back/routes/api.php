<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Public routes (no auth required)
Route::prefix('matches')->group(function () {
    Route::get('/', [MatchController::class, 'index']);
    Route::get('/{match}', [MatchController::class, 'show']);
    Route::get('/history', [MatchController::class, 'history']);
});

Route::prefix('teams')->group(function () {
    Route::get('/', [TeamController::class, 'index']);
    Route::get('/{team}', [TeamController::class, 'show']);
    Route::get('/{team}/players', [TeamController::class, 'getPlayers']);
});

// Protected routes (requires auth:api)
Route::middleware('auth:api')->group(function () {
    // User profile routes
    Route::prefix('user')->group(function () {
        Route::get('profile', [UserController::class, 'profile']);
        Route::put('profile', [UserController::class, 'updateProfile']);
        Route::post('avatar', [UserController::class, 'uploadAvatar']);
        Route::delete('avatar', [UserController::class, 'deleteAvatar']);
        Route::post('change-password', [UserController::class, 'changePassword']);
        Route::get('activity', [UserController::class, 'activity']);
        Route::get('stats', [UserController::class, 'stats']);
    });

    Route::prefix('matches/{match}')->group(function () {
        Route::get('/my-vote', [MatchController::class, 'getUserVote']);
    });

    Route::prefix('votes')->group(function () {
        Route::post('match', [VoteController::class, 'voteMatch']);
        Route::post('tournament', [VoteController::class, 'voteTournament']);
        Route::get('my-votes', [VoteController::class, 'myVotes']);
    });

    Route::prefix('rankings')->group(function () {
        Route::get('my-rank', [RankingController::class, 'myRank']);
    });
});

// Public rankings (must be after protected rankings to avoid conflicts)
Route::prefix('rankings')->group(function () {
    Route::get('users', [RankingController::class, 'users']);
    Route::get('teams', [RankingController::class, 'teams']);
});

