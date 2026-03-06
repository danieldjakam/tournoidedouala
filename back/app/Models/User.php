<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * User role constants
     */
    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';
    const ROLE_TEAM = 'team';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'prenom',
        'nom',
        'email',
        'telephone',
        'password',
        'role',
        'sexe',
        'date_naissance',
        'indicatif_pays',
        'points',
        'avatar_path',
        'team_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'date_naissance' => 'date',
        ];
    }

    /**
     * Get the avatar URL attribute.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar_path) {
            // Use asset() helper which respects APP_URL
            return asset('storage/' . $this->avatar_path);
        }

        // Return default avatar with initials
        $initials = strtoupper(substr($this->prenom ?? 'U', 0, 1) . substr($this->nom ?? '', 0, 1));
        return "https://ui-avatars.com/api/?name=" . urlencode($initials) . "&background=023e78&color=fff&size=200";
    }

    /**
     * Get all votes for matches by this user.
     */
    public function votesMatch(): HasMany
    {
        return $this->hasMany(VoteMatch::class);
    }

    /**
     * Get all tournament votes by this user.
     */
    public function votesTournament(): HasMany
    {
        return $this->hasMany(VoteTournament::class);
    }

    /**
     * Get the team associated with this user (for team accounts).
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Check if user is a team account.
     */
    public function isTeam(): bool
    {
        return $this->role === self::ROLE_TEAM;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}

