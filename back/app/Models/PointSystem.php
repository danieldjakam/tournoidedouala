<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointSystem extends Model
{
    protected $table = 'point_systems';

    protected $fillable = [
        'points_vote_equipe',
        'points_homme_match',
        'points_vainqueur_tournoi',
        'description',
    ];

    /**
     * Get the active point system (usually only one exists).
     */
    public static function current(): self
    {
        return self::first() ?? self::create([
            'points_vote_equipe' => 10,
            'points_homme_match' => 5,
            'points_vainqueur_tournoi' => 50,
        ]);
    }
}
