<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController
{
    /**
     * Register a new user via mobile API
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'telephone' => 'required|string|unique:users',
                'password' => 'required|string|min:4|max:4|regex:/^\d+$/',
                'indicatif_pays' => 'nullable|string',
                'sexe' => 'nullable|in:M,F,Autre',
                'date_naissance' => 'nullable|date',
                'email' => 'nullable|email|unique:users',
            ]);

            // Set default for indicatif_pays if not provided
            $validated['indicatif_pays'] = $validated['indicatif_pays'] ?? '+237';

            $user = User::create([
                ...$validated,
                'password' => Hash::make($validated['password']),
                'role' => 'user',
            ]);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Login user via mobile API with telephone and 4-digit password
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'telephone' => 'required|string',
                'password' => 'required|string|min:4|max:4|regex:/^\d+$/',
            ]);

            $user = User::where('telephone', $validated['telephone'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 401);
            }

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Logout user by invalidating token
     */
    public function logout(): JsonResponse
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    /**
     * Refresh JWT token
     */
    public function refresh(): JsonResponse
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());

            return response()->json([
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Could not refresh token',
            ], 401);
        }
    }

    /**
     * Get authenticated user
     */
    public function me(): JsonResponse
    {
        return response()->json(auth('api')->user());
    }
}
