<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoteMatch extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected $table = 'votes_match';

    protected $fillable = [
        'user_id',
        'match_id',
        'team_vote_id',
        'player_vote_id',
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
     * Get the match this vote is for.
     */
    public function match(): BelongsTo
    {
        return $this->belongsTo(\App\Models\SportMatch::class);
    }

    /**
     * Get the team voted as winner.
     */
    public function teamVote(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_vote_id');
    }

    /**
     * Get the player voted as man of the match.
     */
    public function playerVote(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_vote_id');
    }
}
