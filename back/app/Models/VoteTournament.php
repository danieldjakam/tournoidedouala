<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoteTournament extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $table = 'votes_tournament';

    protected $fillable = [
        'user_id',
        'tournament_id',
        'team_vote_id',
        'points',
        'validated',
    ];

    protected $casts = [
        'validated' => 'boolean',
    ];

    /**
     * Get the user who made this vote.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team voted as tournament winner.
     */
    public function teamVote(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_vote_id');
    }
}
