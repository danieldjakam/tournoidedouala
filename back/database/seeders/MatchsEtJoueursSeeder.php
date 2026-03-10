<?php

namespace Database\Seeders;

use App\Models\SportMatch as MatchModel;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Database\Seeder;

class MatchsEtJoueursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing teams from database (sorted by priority)
        $teamModels = Team::orderBy('priorite', 'desc')->orderBy('nom')->get();

        // Check if we have enough teams
        if ($teamModels->isEmpty()) {
            $this->command->error('Aucune équipe trouvée dans la base de données !');
            $this->command->warn('Veuillez d\'abord créer des équipes depuis l\'interface admin.');
            return;
        }

        $teamCount = $teamModels->count();
        $this->command->info("{$teamCount} équipe(s) trouvée(s) dans la base de données.");

        // Create players for each team (only if team has no players yet)
        foreach ($teamModels as $team) {
            $existingPlayers = $team->players()->count();
            
            if ($existingPlayers === 0) {
                $this->command->info("  → Création de 15 joueurs pour : {$team->nom}");
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
            } else {
                $this->command->info("  → {$team->nom} a déjà {$existingPlayers} joueur(s) (ignoré)");
            }
        }

        // Create fictitious matches - Tournament Schedule
        // Using modulo to handle any number of teams
        $matches = [];
        
        // Generate matches based on available teams
        for ($round = 0; $round < 3; $round++) {
            for ($i = 0; $i < $teamCount; $i += 2) {
                if ($i + 1 < $teamCount) {
                    $matches[] = [
                        'team1' => $i,
                        'team2' => $i + 1,
                        'date' => now()->addDays(2 + $round * 3),
                        'lieu' => $round % 2 === 0 ? 'Stade de la Réunification, Douala' : 'Stade Ahmadou Ahidjo, Yaoundé',
                        'statut' => 'planifie',
                    ];
                }
            }
        }

        // Add some finished matches
        for ($i = 0; $i < min(4, $teamCount); $i += 2) {
            if ($i + 1 < $teamCount) {
                $matches[] = [
                    'team1' => $i,
                    'team2' => $i + 1,
                    'date' => now()->subDays(5 - $i),
                    'lieu' => 'Stade de la Réunification, Douala',
                    'statut' => 'termine',
                    'score1' => rand(0, 3),
                    'score2' => rand(0, 3),
                    'compo' => true,
                ];
            }
        }

        // Create matches
        $createdCount = 0;
        $skippedCount = 0;

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
                $createdCount++;
            } else {
                $skippedCount++;
            }
        }

        $this->command->info("{$createdCount} match(s) créé(s).");
        
        if ($skippedCount > 0) {
            $this->command->info("{$skippedCount} match(s) ignoré(s) (déjà existants).");
        }
    }
}
