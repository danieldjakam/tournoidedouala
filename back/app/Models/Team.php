<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
        'logo',
        'description',
        'priorite',
    ];

    /**
     * Get all players on this team.
     */
    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    /**
     * Get all votes for this team as winner.
     */
    public function votesAsWinner(): HasMany
    {
        return $this->hasMany(VoteMatch::class, 'team_vote_id');
    }

    /**
     * Get all tournament votes for this team.
     */
    public function tournamentVotes(): HasMany
    {
        return $this->hasMany(VoteTournament::class, 'team_vote_id');
    }

    /**
     * Get matches where this team is team_1.
     */
    public function matchesAsTeam1(): HasMany
    {
        return $this->hasMany(\App\Models\SportMatch::class, 'team_1_id');
    }

    /**
     * Get matches where this team is team_2.
     */
    public function matchesAsTeam2(): HasMany
    {
        return $this->hasMany(\App\Models\SportMatch::class, 'team_2_id');
    }
}
