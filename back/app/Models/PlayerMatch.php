<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerMatch extends Model
{
    use HasFactory;

    protected $table = 'player_match';

    protected $fillable = [
        'player_id',
        'match_id',
        'poste',
        'titulaire',
        'minutes',
    ];

    protected $casts = [
        'titulaire' => 'boolean',
    ];

    /**
     * Get the player.
     */
    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    /**
     * Get the match.
     */
    public function match(): BelongsTo
    {
        return $this->belongsTo(SportMatch::class);
    }
}
