<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    // return Inertia::render('dashboard');
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Debug endpoint for logo issues (admin only)
Route::get('debug-logos', function () {
    return response()->json([
        'app_url' => config('app.url'),
        'app_debug' => config('app.debug'),
        'filesystem_disk' => config('filesystems.default'),
        'public_disk_config' => config('filesystems.disks.public'),
        'storage_link_exists' => file_exists(public_path('storage')),
        'storage_link_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : 'NOT_A_LINK',
        'logos_dir_exists' => is_dir(storage_path('app/public/logos')),
        'logos' => is_dir(storage_path('app/public/logos')) 
            ? array_values(array_filter(scandir(storage_path('app/public/logos')), fn($f) => $f !== '.' && $f !== '..'))
            : [],
        'teams' => \App\Models\Team::all()->map(function($team) {
            return [
                'id' => $team->id,
                'nom' => $team->nom,
                'logo_path' => $team->logo_path,
                'logo_url' => $team->logo_url,
                'logo_url_reachable' => $team->logo_path ? file_exists(public_path('storage/' . $team->logo_path)) : null,
            ];
        }),
    ]);
})->middleware(['auth', 'admin']);

// Load team routes BEFORE admin routes to avoid conflicts
require __DIR__.'/team.php';

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
