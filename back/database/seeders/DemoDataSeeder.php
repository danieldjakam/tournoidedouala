<?php

namespace Database\Seeders;

use App\Models\SportMatch as MatchModel;
use App\Models\Player;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users for login (only if not exists)
        if (!User::where('telephone', '+237600000001')->exists()) {
            User::create([
                'prenom' => 'Test',
                'nom' => 'User',
                'telephone' => '+237600000001',
                'email' => 'test@test.com',
                'password' => Hash::make('1234'),
                'role' => 'user',
                'indicatif_pays' => '+237',
            ]);
        }

        if (!User::where('telephone', '+237600000002')->exists()) {
            User::create([
                'prenom' => 'Demo',
                'nom' => 'Player',
                'telephone' => '+237600000002',
                'email' => 'demo@demo.com',
                'password' => Hash::make('1234'),
                'role' => 'user',
                'indicatif_pays' => '+237',
            ]);
        }

        // Get existing teams from database
        $teamModels = Team::orderBy('priorite', 'desc')->orderBy('nom')->get();

        // If no teams exist, create demo teams
        if ($teamModels->isEmpty()) {
            $teams = [
                ['nom' => 'Canon Sportif de Douala', 'code' => 'CAN', 'priorite' => 5],
                ['nom' => 'Union Douala', 'code' => 'USD', 'priorite' => 4],
                ['nom' => 'Fovu Club', 'code' => 'FOV', 'priorite' => 4],
                ['nom' => 'Coton Sport Garoua', 'code' => 'CSG', 'priorite' => 3],
                ['nom' => 'Panthère du Ndé', 'code' => 'PAN', 'priorite' => 3],
                ['nom' => 'Les Astres FC', 'code' => 'AST', 'priorite' => 2],
                ['nom' => 'Young Sport Bamenda', 'code' => 'YSB', 'priorite' => 2],
                ['nom' => 'Stade Renard', 'code' => 'SRE', 'priorite' => 1],
            ];

            foreach ($teams as $team) {
                $teamModels->push(Team::create($team));
            }
        }

        // Create players for each team (only if team has no players yet)
        foreach ($teamModels as $team) {
            if ($team->players()->count() === 0) {
                for ($i = 1; $i <= 15; $i++) {
                    Player::create([
                        'team_id' => $team->id,
                        'prenom' => fake()->firstName(),
                        'nom' => fake()->lastName(),
                        'numero' => $i,
                        'date_naissance' => fake()->dateTimeBetween('-40 years', '-17 years'),
                        'nationalite' => fake()->randomElement(['Cameroun', 'Sénégal', 'Nigeria', 'Ghana', 'Côte d\'Ivoire']),
                        'bio' => fake()->paragraph(),
                    ]);
                }
            }
        }

        // Create fictitious matches - Tournament Schedule
        $matches = [
            // Round 1 - Matchs de poule
            [
                'team1' => 0, 'team2' => 1,
                'date' => now()->addDays(2),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 2, 'team2' => 3,
                'date' => now()->addDays(2),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            [
                'team1' => 4, 'team2' => 5,
                'date' => now()->addDays(3),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 6, 'team2' => 7,
                'date' => now()->addDays(3),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            // Round 2
            [
                'team1' => 0, 'team2' => 2,
                'date' => now()->addDays(5),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 1, 'team2' => 3,
                'date' => now()->addDays(5),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            [
                'team1' => 4, 'team2' => 6,
                'date' => now()->addDays(6),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 5, 'team2' => 7,
                'date' => now()->addDays(6),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            // Round 3
            [
                'team1' => 0, 'team2' => 3,
                'date' => now()->addDays(8),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 1, 'team2' => 2,
                'date' => now()->addDays(8),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            [
                'team1' => 4, 'team2' => 7,
                'date' => now()->addDays(9),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 5, 'team2' => 6,
                'date' => now()->addDays(9),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            // Demi-finales
            [
                'team1' => 0, 'team2' => 4,
                'date' => now()->addDays(12),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
            ],
            [
                'team1' => 2, 'team2' => 1,
                'date' => now()->addDays(12),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'planifie',
            ],
            // Finale
            [
                'team1' => 0, 'team2' => 2,
                'date' => now()->addDays(15),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'planifie',
                'compo_publique' => true,
            ],
            // Matchs terminés (pour l'exemple)
            [
                'team1' => 0, 'team2' => 7,
                'date' => now()->subDays(5),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'termine',
                'score1' => 3,
                'score2' => 0,
                'compo' => true,
            ],
            [
                'team1' => 2, 'team2' => 6,
                'date' => now()->subDays(4),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'termine',
                'score1' => 2,
                'score2' => 1,
                'compo' => true,
            ],
            [
                'team1' => 1, 'team2' => 5,
                'date' => now()->subDays(3),
                'lieu' => 'Stade de la Réunification, Douala',
                'statut' => 'termine',
                'score1' => 1,
                'score2' => 1,
                'compo' => true,
            ],
            [
                'team1' => 3, 'team2' => 4,
                'date' => now()->subDays(2),
                'lieu' => 'Stade Ahmadou Ahidjo, Yaoundé',
                'statut' => 'termine',
                'score1' => 0,
                'score2' => 2,
                'compo' => true,
            ],
        ];

        foreach ($matches as $match) {
            // Only create match if similar match doesn't exist
            $exists = MatchModel::where('team_1_id', $teamModels[$match['team1']]->id)
                ->where('team_2_id', $teamModels[$match['team2']]->id)
                ->whereDate('date_match', $match['date'])
                ->exists();

            if (!$exists) {
                MatchModel::create([
                    'team_1_id' => $teamModels[$match['team1']]->id,
                    'team_2_id' => $teamModels[$match['team2']]->id,
                    'date_match' => $match['date'],
                    'lieu' => $match['lieu'],
                    'statut' => $match['statut'],
                    'score_team_1' => $match['score1'] ?? null,
                    'score_team_2' => $match['score2'] ?? null,
                    'compo_publique' => $match['compo'] ?? false,
                    'notes' => isset($match['score1']) ? 'Match de préparation' : null,
                ]);
            }
        }
    }
}
