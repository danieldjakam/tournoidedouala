<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $fillable = [
        'team_id',
        'prenom',
        'nom',
        'numero',
        'date_naissance',
        'nationalite',
        'bio',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    /**
     * Get the team this player belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get all matches this player participated in.
     */
    public function matches(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\SportMatch::class, 'player_match')
            ->withPivot(['poste', 'titulaire', 'minutes'])
            ->withTimestamps();
    }

    /**
     * Get votes for this player as man of the match.
     */
    public function votesAsManOfMatch(): HasMany
    {
        return $this->hasMany(VoteMatch::class, 'player_vote_id');
    }
}
