<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'prenom' => 'Test',
            'nom' => 'User',
            'email' => 'test@example.com',
            'telephone' => '0612345678',
            'role' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        User::factory(10)->create();

        $this->call(DemoDataSeeder::class);
    }
}
