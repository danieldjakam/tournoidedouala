<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $noms = ['Paris SG', 'Lyon', 'Marseille', 'Rennes', 'Breton', 'Monaco', 'Nantes', 'Lens', 'Nice'];

        return [
            'nom' => fake()->randomElement($noms),
            'code' => strtoupper(fake()->unique()->regexify('[A-Z]{3}')),
            'logo' => null,
            'description' => fake()->paragraph(),
            'priorite' => fake()->numberBetween(1, 5),
        ];
    }
}
