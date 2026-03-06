<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    // return Inertia::render('dashboard');
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Load team routes BEFORE admin routes to avoid conflicts
require __DIR__.'/team.php';

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
