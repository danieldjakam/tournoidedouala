<?php

namespace Database\Seeders;

use App\Models\SportMatch as MatchModel;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create teams
        $teams = [
            ['nom' => 'Paris Saint-Germain', 'code' => 'PSG', 'priorite' => 5],
            ['nom' => 'Olympique Lyonnais', 'code' => 'OL', 'priorite' => 4],
            ['nom' => 'Olympique de Marseille', 'code' => 'OM', 'priorite' => 4],
            ['nom' => 'AS Monaco', 'code' => 'ASM', 'priorite' => 3],
            ['nom' => 'LOSC Lille', 'code' => 'LOSC', 'priorite' => 3],
            ['nom' => 'Stade Rennais', 'code' => 'SR', 'priorite' => 2],
        ];

        $teamModels = [];
        foreach ($teams as $team) {
            $teamModels[] = Team::create($team);
        }

        // Create players for each team
        foreach ($teamModels as $team) {
            for ($i = 1; $i <= 15; $i++) {
                Player::create([
                    'team_id' => $team->id,
                    'prenom' => fake()->firstName(),
                    'nom' => fake()->lastName(),
                    'numero' => $i,
                    'date_naissance' => fake()->dateTimeBetween('-40 years', '-17 years'),
                    'nationalite' => fake()->country(),
                    'bio' => fake()->paragraph(),
                ]);
            }
        }

        // Create matches between teams
        for ($i = 0; $i < 10; $i++) {
            $team1 = $teamModels[rand(0, count($teamModels) - 1)];
            $team2 = $teamModels[rand(0, count($teamModels) - 1)];

            // Ensure different teams
            while ($team2->id === $team1->id) {
                $team2 = $teamModels[rand(0, count($teamModels) - 1)];
            }

            MatchModel::create([
                'team_1_id' => $team1->id,
                'team_2_id' => $team2->id,
                'date_match' => now()->addDays(rand(1, 30)),
                'lieu' => fake()->city(),
                'statut' => 'planifie',
            ]);
        }

        // Create past matches with scores
        for ($i = 0; $i < 5; $i++) {
            $team1 = $teamModels[rand(0, count($teamModels) - 1)];
            $team2 = $teamModels[rand(0, count($teamModels) - 1)];

            while ($team2->id === $team1->id) {
                $team2 = $teamModels[rand(0, count($teamModels) - 1)];
            }

            MatchModel::create([
                'team_1_id' => $team1->id,
                'team_2_id' => $team2->id,
                'date_match' => now()->subDays(rand(1, 30)),
                'lieu' => fake()->city(),
                'statut' => 'termine',
                'score_team_1' => rand(0, 5),
                'score_team_2' => rand(0, 5),
                'compo_publique' => true,
            ]);
        }    }
}
