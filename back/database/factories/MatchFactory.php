<?php

namespace Database\Factories;

use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Match>
 */
class MatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_1_id' => Team::factory(),
            'team_2_id' => Team::factory(),
            'date_match' => fake()->dateTimeBetween('now', '+30 days'),
            'lieu' => fake()->city(),
            'statut' => fake()->randomElement(['planifie', 'en_cours', 'termine']),
            'score_team_1' => null,
            'score_team_2' => null,
            'homme_du_match_id' => null,
            'compo_publique' => false,
            'notes' => fake()->paragraph(),
        ];
    }

    /**
     * Indicate that the match is finished.
     */
    public function finished(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'termine',
            'score_team_1' => fake()->numberBetween(0, 5),
            'score_team_2' => fake()->numberBetween(0, 5),
        ]);
    }

    /**
     * Indicate that the composition is public.
     */
    public function withPublicComposition(): static
    {
        return $this->state(fn (array $attributes) => [
            'compo_publique' => true,
        ]);
    }
}
