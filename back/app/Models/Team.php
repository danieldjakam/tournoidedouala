<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Team extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
        'logo',
        'logo_path',
        'description',
        'priorite',
    ];

    protected $appends = ['logo_url'];

    /**
     * Get the logo URL attribute.
     */
    public function getLogoUrlAttribute(): string
    {
        // Prioritize uploaded file (logo_path)
        if ($this->logo_path) {
            // Use asset() helper which respects APP_URL
            return asset('storage/' . $this->logo_path);
        }

        // Fallback to URL stored in logo column
        if ($this->logo) {
            // Check if it's already a full URL
            if (str_starts_with($this->logo, 'http')) {
                return $this->logo;
            }
            return asset('storage/' . $this->logo);
        }

        return 'https://via.placeholder.com/48';
    }

    /**
     * Get all players on this team.
     */
    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    /**
     * Get the user account associated with this team.
     */
    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    /**
     * Check if team has a user account.
     */
    public function hasUserAccount(): bool
    {
        return $this->user()->exists();
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
