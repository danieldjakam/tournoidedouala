<?php

namespace Database\Factories;

use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Player>
 */
class PlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $numeroByTeam = [];

        $teamId = $this->faker->numberBetween(1, 10);

        if (!isset($numeroByTeam[$teamId])) {
            $numeroByTeam[$teamId] = rand(1, 99);
        } else {
            $numeroByTeam[$teamId]++;
            if ($numeroByTeam[$teamId] > 99) {
                $numeroByTeam[$teamId] = 1;
            }
        }

        return [
            'team_id' => Team::factory(),
            'prenom' => fake()->firstName(),
            'nom' => fake()->lastName(),
            'numero' => $numeroByTeam[$teamId],
            'date_naissance' => fake()->dateTimeBetween('-40 years', '-17 years'),
            'nationalite' => fake()->country(),
            'bio' => fake()->paragraph(),
        ];
    }
}
