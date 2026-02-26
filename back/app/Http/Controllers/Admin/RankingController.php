<?php

namespace App\Http\Controllers\Admin;

use App\Models\Team;
use App\Models\User;
use App\Models\SportMatch;
use App\Models\VoteMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RankingController
{
    /**
     * Display the rankings page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Rankings/Index');
    }

    /**
     * Get team rankings with statistics.
     */
    public function teams(): array
    {
        $teams = Team::all()->map(function ($team) {
            // Get all matches for this team
            $matchesAsTeam1 = SportMatch::where('team_1_id', $team->id)->get();
            $matchesAsTeam2 = SportMatch::where('team_2_id', $team->id)->get();
            
            $allMatches = $matchesAsTeam1->merge($matchesAsTeam2);
            $finishedMatches = $allMatches->where('statut', 'termine');

            $played = $finishedMatches->count();
            $wins = 0;
            $draws = 0;
            $losses = 0;
            $goalsFor = 0;
            $goalsAgainst = 0;

            foreach ($finishedMatches as $match) {
                $isTeam1 = $match->team_1_id === $team->id;
                $teamScore = $isTeam1 ? $match->score_team_1 : $match->score_team_2;
                $opponentScore = $isTeam1 ? $match->score_team_2 : $match->score_team_1;

                $goalsFor += $teamScore;
                $goalsAgainst += $opponentScore;

                if ($teamScore > $opponentScore) {
                    $wins++;
                } elseif ($teamScore === $opponentScore) {
                    $draws++;
                } else {
                    $losses++;
                }
            }

            $points = ($wins * 3) + ($draws * 1);
            $goalDifference = $goalsFor - $goalsAgainst;

            // Get votes won
            $votesWon = VoteMatch::where('team_vote_id', $team->id)
                ->where('validated', true)
                ->count();

            return [
                'id' => $team->id,
                'nom' => $team->nom,
                'code' => $team->code,
                'logo' => $team->logo,
                'priorite' => $team->priorite,
                'played' => $played,
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'goals_for' => $goalsFor,
                'goals_against' => $goalsAgainst,
                'goal_difference' => $goalDifference,
                'points' => $points,
                'votes_won' => $votesWon,
                'form' => $this->getTeamForm($finishedMatches, $team->id),
            ];
        });

        // Sort by points, then goal difference, then goals for
        return $teams->sortByDesc(function ($team) {
            return [$team['points'], $team['goal_difference'], $team['goals_for']];
        })->values()->toArray();
    }

    /**
     * Get user (pronostiqueurs) rankings.
     */
    public function users(): array
    {
        $users = User::where('role', 'user')
            ->withCount(['votesMatch', 'votesTournament'])
            ->get()
            ->map(function ($user) {
                // Calculate total points from validated votes
                $totalPoints = VoteMatch::where('user_id', $user->id)
                    ->where('validated', true)
                    ->sum('points');

                // Add tournament vote points
                $tournamentPoints = \App\Models\VoteTournament::where('user_id', $user->id)
                    ->where('validated', true)
                    ->sum('points');

                $totalPoints += $tournamentPoints;

                // Calculate accuracy
                $totalVotes = $user->votes_match_count + $user->votes_tournament_count;
                $correctVotes = VoteMatch::where('user_id', $user->id)
                    ->where('validated', true)
                    ->where('points', '>', 0)
                    ->count();

                $correctVotes += \App\Models\VoteTournament::where('user_id', $user->id)
                    ->where('validated', true)
                    ->where('points', '>', 0)
                    ->count();

                $accuracy = $totalVotes > 0 ? round(($correctVotes / $totalVotes) * 100, 1) : 0;

                return [
                    'id' => $user->id,
                    'prenom' => $user->prenom,
                    'nom' => $user->nom,
                    'telephone' => $user->telephone,
                    'points' => $totalPoints,
                    'total_votes' => $totalVotes,
                    'correct_votes' => $correctVotes,
                    'accuracy' => $accuracy,
                    'match_votes' => $user->votes_match_count,
                    'tournament_votes' => $user->votes_tournament_count,
                ];
            });

        // Sort by points
        return $users->sortByDesc('points')->values()->toArray();
    }

    /**
     * Get recent form for a team (last 5 matches).
     */
    private function getTeamForm($matches, int $teamId): array
    {
        $recentMatches = $matches->sortByDesc('date_match')->take(5);
        $form = [];

        foreach ($recentMatches as $match) {
            $isTeam1 = $match->team_1_id === $teamId;
            $teamScore = $isTeam1 ? $match->score_team_1 : $match->score_team_2;
            $opponentScore = $isTeam1 ? $match->score_team_2 : $match->score_team_1;

            if ($teamScore > $opponentScore) {
                $form[] = 'W'; // Win
            } elseif ($teamScore === $opponentScore) {
                $form[] = 'D'; // Draw
            } else {
                $form[] = 'L'; // Loss
            }
        }

        return $form;
    }
}
