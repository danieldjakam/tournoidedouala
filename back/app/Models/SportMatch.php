<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SportMatch extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'team_1_id',
        'team_2_id',
        'date_match',
        'lieu',
        'statut',
        'score_team_1',
        'score_team_2',
        'homme_du_match_id',
        'compo_publique',
        'notes',
    ];

    protected $casts = [
        'date_match' => 'datetime',
        'compo_publique' => 'boolean',
    ];

    /**
     * Get the first team.
     */
    public function team1(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_1_id');
    }

    /**
     * Get the second team.
     */
    public function team2(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_2_id');
    }

    /**
     * Get all players in this match.
     */
    public function players(): BelongsToMany
    {
        return $this->belongsToMany(Player::class, 'player_match')
            ->withPivot(['poste', 'titulaire', 'minutes'])
            ->withTimestamps();
    }

    /**
     * Get all player match records.
     */
    public function playerMatches(): HasMany
    {
        return $this->hasMany(PlayerMatch::class, 'match_id');
    }

    /**
     * Get all votes for this match.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(VoteMatch::class, 'match_id');
    }

    /**
     * Check if composition is publicly visible (1 hour before match).
     */
    public function isCompositionVisible(): bool
    {
        return $this->compo_publique || now()->diffInHours($this->date_match) <= 1;
    }
}
