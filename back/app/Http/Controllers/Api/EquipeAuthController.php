<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EquipeAuthController
{
    /**
     * Register a new team account via API
     * Team accounts have restricted permissions (can only manage their team's players)
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                // Team information
                'team_nom' => 'required|string|max:255|unique:teams,nom',
                'team_code' => 'required|string|max:10|unique:teams,code',
                'team_description' => 'nullable|string',
                'logo' => 'nullable|string',
                
                // User account information (team representative)
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'telephone' => 'required|string|unique:users',
                'email' => 'nullable|email|unique:users',
                'password' => 'required|string|min:4|max:4|regex:/^\d+$/',
                'indicatif_pays' => 'nullable|string',
            ]);

            // Set default for indicatif_pays if not provided
            $validated['indicatif_pays'] = $validated['indicatif_pays'] ?? '+237';

            // Create the team first
            $team = Team::create([
                'nom' => $validated['team_nom'],
                'code' => $validated['team_code'],
                'description' => $validated['team_description'] ?? null,
                'logo' => $validated['logo'] ?? null,
                'priorite' => 0,
            ]);

            // Remove email if empty or null
            if (empty($validated['email'])) {
                unset($validated['email']);
            }

            // Create the user account linked to the team
            $user = User::create([
                'prenom' => $validated['prenom'],
                'nom' => $validated['nom'],
                'telephone' => $validated['telephone'],
                'email' => $validated['email'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => 'equipe',
                'team_id' => $team->id,
                'indicatif_pays' => $validated['indicatif_pays'],
            ]);

            return response()->json([
                'message' => 'Team account registered successfully',
                'user' => [
                    'id' => $user->id,
                    'prenom' => $user->prenom,
                    'nom' => $user->nom,
                    'telephone' => $user->telephone,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'team' => [
                    'id' => $team->id,
                    'nom' => $team->nom,
                    'code' => $team->code,
                    'logo_url' => $team->logo_url,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Login for team accounts
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'telephone' => 'required|string',
                'password' => 'required|string|min:4|max:4|regex:/^\d+$/',
            ]);

            $user = User::where('telephone', $validated['telephone'])
                ->where('role', 'equipe')
                ->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 401);
            }

            $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    ...$user->toArray(),
                    'team' => $user->team,
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }
}
