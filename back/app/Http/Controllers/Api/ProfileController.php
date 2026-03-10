<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController
{
    /**
     * Get authenticated user's profile
     */
    public function show(): JsonResponse
    {
        $user = auth('api')->user();

        return response()->json([
            'user' => $user,
        ], 200);
    }

    /**
     * Update authenticated user's profile
     */
    public function update(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        try {
            $validated = $request->validate([
                'prenom' => 'sometimes|required|string|max:255',
                'nom' => 'sometimes|required|string|max:255',
                'sexe' => 'sometimes|nullable|in:M,F,Autre',
                'date_naissance' => 'sometimes|nullable|date',
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh(),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Update user's settings (password, phone, email)
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        try {
            $validated = $request->validate([
                'current_password' => 'required|string|min:4|max:4|regex:/^\d+$/',
                'new_password' => 'sometimes|required|string|min:4|max:4|regex:/^\d+$/',
                'telephone' => 'sometimes|required|string|unique:users,telephone,' . $user->id,
                'email' => 'sometimes|nullable|email|unique:users,email,' . $user->id,
            ]);

            // Verify current password
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect',
                ], 400);
            }

            // Update password if provided
            if (!empty($validated['new_password'])) {
                $user->password = Hash::make($validated['new_password']);
            }

            // Update telephone if provided
            if (!empty($validated['telephone'])) {
                $user->telephone = $validated['telephone'];
            }

            // Update email if provided (can be null to remove it)
            if ($request->has('email')) {
                $user->email = $validated['email'] ?? null;
            }

            $user->save();

            return response()->json([
                'message' => 'Settings updated successfully',
                'user' => $user->fresh(),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get user statistics
     */
    public function stats(): JsonResponse
    {
        $user = auth('api')->user();

        $stats = [
            'total_points' => $user->points,
            'total_votes' => $user->votesMatch()->count() + $user->votesTournament()->count(),
            'match_votes' => $user->votesMatch()->count(),
            'tournament_votes' => $user->votesTournament()->count(),
            'correct_predictions' => $user->votesMatch()->whereNotNull('points')->count(),
        ];

        return response()->json([
            'stats' => $stats,
        ], 200);
    }
}
