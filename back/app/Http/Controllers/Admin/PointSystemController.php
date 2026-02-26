<?php

namespace App\Http\Controllers\Admin;

use App\Models\PointSystem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PointSystemController
{
    /**
     * Display the point system configuration.
     */
    public function index(): Response
    {
        $pointSystem = PointSystem::firstOrCreate(
            [],
            [
                'points_vote_equipe' => 10,
                'points_homme_match' => 5,
                'points_vainqueur_tournoi' => 50,
            ]
        );

        return Inertia::render('Admin/PointSystem/Index', [
            'pointSystem' => $pointSystem,
        ]);
    }

    /**
     * Update the point system configuration.
     */
    public function update(Request $request, PointSystem $pointSystem)
    {
        $validated = $request->validate([
            'points_vote_equipe' => 'required|integer|min:0',
            'points_homme_match' => 'required|integer|min:0',
            'points_vainqueur_tournoi' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $pointSystem->update($validated);

        return redirect()->route('admin.point-system.index')
            ->with('success', 'Point system updated successfully');
    }
}
