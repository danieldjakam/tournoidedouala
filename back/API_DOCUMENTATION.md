# API Documentation - Application de Pronostics Sportifs

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Authentification](#authentification)
- [Matchs](#matchs)
- [Votes](#votes)
- [Classements](#classements)
- [Administration](#administration)

---

## Vue d'ensemble

### Base URL
```
API Mobile: /api
API Admin:  /admin (session web)
```

### Formats de réponse

**Succès (2xx):**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Erreur (4xx/5xx):**
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Validation error"]
  }
}
```

---

## Authentification

### 1. Inscription (Mobile)

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "0612345678",
  "password": "1234",
  "indicatif_pays": "+33",
  "sexe": "M",
  "date_naissance": "1990-01-01"
}
```

**Réponse (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "telephone": "0612345678",
    "role": "user",
    "points": 0
  }
}
```

---

### 2. Connexion (Mobile)

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "telephone": "0612345678",
  "password": "1234"
}
```

**Réponse (200):**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "telephone": "0612345678",
    "role": "user",
    "points": 150
  }
}
```

---

### 3. Déconnexion

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Rafraîchir le token

**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 5. Profil utilisateur

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "id": 1,
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "0612345678",
  "email": null,
  "role": "user",
  "points": 150,
  "sexe": "M",
  "date_naissance": "1990-01-01",
  "indicatif_pays": "+33"
}
```

---

## Matchs

### 1. Liste des matchs

**Endpoint:** `GET /api/matches`

**Réponse (200):**
```json
[
  {
    "id": 1,
    "team_1_id": 1,
    "team_2_id": 2,
    "date_match": "2026-03-01T15:00:00Z",
    "lieu": "Stade de France",
    "statut": "planifie",
    "score_team_1": null,
    "score_team_2": null,
    "compo_publique": false,
    "team1": {
      "id": 1,
      "nom": "Paris SG",
      "code": "PSG",
      "logo": "url..."
    },
    "team2": {
      "id": 2,
      "nom": "Marseille",
      "code": "OM",
      "logo": "url..."
    }
  }
]
```

---

### 2. Détail d'un match

**Endpoint:** `GET /api/matches/{id}`

**Réponse (200):**
```json
{
  "id": 1,
  "team_1_id": 1,
  "team_2_id": 2,
  "date_match": "2026-03-01T15:00:00Z",
  "lieu": "Stade de France",
  "statut": "planifie",
  "score_team_1": null,
  "score_team_2": null,
  "compo_publique": false,
  "team1": { ... },
  "team2": { ... },
  "players": [
    {
      "id": 1,
      "prenom": "Kylian",
      "nom": "Mbappé",
      "numero": "7",
      "poste": "attaquant",
      "titulaire": true,
      "minutes": null
    }
  ]
}
```

---

### 3. Historique des matchs

**Endpoint:** `GET /api/matches/history`

**Query Parameters:**
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Nombre de résultats par page

**Réponse (200):**
```json
{
  "data": [
    {
      "id": 1,
      "team_1_id": 1,
      "team_2_id": 2,
      "date_match": "2026-02-01T15:00:00Z",
      "statut": "termine",
      "score_team_1": 2,
      "score_team_2": 1,
      "homme_du_match_id": 5,
      "team1": { ... },
      "team2": { ... }
    }
  ],
  "links": { ... },
  "meta": { ... }
}
```

---

## Votes

### 1. Voter pour un match

**Endpoint:** `POST /api/votes/match`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "match_id": 1,
  "team_vote_id": 1,
  "player_vote_id": 5
}
```

**Champs:**
- `match_id`: ID du match (requis)
- `team_vote_id`: ID de l'équipe votée (requis)
- `player_vote_id`: ID du joueur pour l'homme du match (optionnel)

**Réponse (201):**
```json
{
  "message": "Vote registered successfully",
  "vote": {
    "id": 1,
    "user_id": 1,
    "match_id": 1,
    "team_vote_id": 1,
    "player_vote_id": 5,
    "points": 0,
    "validated": false,
    "match": { ... },
    "teamVote": { ... },
    "playerVote": { ... }
  }
}
```

---

### 2. Voter pour le vainqueur du tournoi

**Endpoint:** `POST /api/votes/tournament`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "team_vote_id": 1
}
```

**Réponse (201):**
```json
{
  "message": "Tournament vote registered",
  "vote": {
    "id": 1,
    "user_id": 1,
    "tournament_id": 1,
    "team_vote_id": 1,
    "points": 0,
    "validated": false,
    "teamVote": { ... }
  }
}
```

---

### 3. Mes votes

**Endpoint:** `GET /api/votes/my-votes`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "match_votes": [
    {
      "id": 1,
      "match_id": 1,
      "team_vote_id": 1,
      "player_vote_id": 5,
      "points": 0,
      "validated": false,
      "match": { ... },
      "teamVote": { ... },
      "playerVote": { ... }
    }
  ],
  "tournament_vote": {
    "id": 1,
    "team_vote_id": 1,
    "points": 0,
    "validated": false,
    "teamVote": { ... }
  }
}
```

---

## Classements

### 1. Classement des utilisateurs

**Endpoint:** `GET /api/rankings/users`

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Résultats par page (défaut: 50)

**Réponse (200):**
```json
{
  "data": [
    {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont",
      "telephone": "0612345678",
      "points": 150,
      "match_votes": 10,
      "tournament_votes": 1,
      "rank": 1
    }
  ],
  "links": { ... },
  "meta": {
    "current_page": 1,
    "total": 100
  }
}
```

---

### 2. Classement des équipes

**Endpoint:** `GET /api/rankings/teams`

**Réponse (200):**
```json
[
  {
    "id": 1,
    "nom": "Paris SG",
    "code": "PSG",
    "logo": "url...",
    "priorite": 5,
    "total_points": 250
  }
]
```

---

### 3. Mon classement

**Endpoint:** `GET /api/rankings/my-rank`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "rank": 5,
  "user": {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "points": 150
  },
  "points": 150
}
```

---

## Administration

### Authentification Admin

Les administrateurs se connectent via le front web avec email + mot de passe (session Laravel).

---

### Équipes

#### Liste des équipes
**GET** `/admin/teams`

#### Créer une équipe
**POST** `/admin/teams`
```json
{
  "nom": "Paris Saint-Germain",
  "code": "PSG",
  "logo": "https://...",
  "description": "Club parisien",
  "priorite": 5
}
```

#### Modifier une équipe
**PUT/PATCH** `/admin/teams/{id}`

#### Supprimer une équipe
**DELETE** `/admin/teams/{id}`

---

### Joueurs

#### Liste des joueurs
**GET** `/admin/players?team_id={id}`

#### Créer un joueur
**POST** `/admin/players`
```json
{
  "team_id": 1,
  "prenom": "Kylian",
  "nom": "Mbappé",
  "numero": 7,
  "date_naissance": "1998-12-20",
  "nationalite": "France",
  "bio": "Attaquant vedette"
}
```

#### Modifier un joueur
**PUT/PATCH** `/admin/players/{id}`

#### Supprimer un joueur
**DELETE** `/admin/players/{id}`

---

### Matchs

#### Liste des matchs
**GET** `/admin/matches`

#### Détail d'un match
**GET** `/admin/matches/{id}/detail`

#### Créer un match
**POST** `/admin/matches`
```json
{
  "team_1_id": 1,
  "team_2_id": 2,
  "date_match": "2026-03-01 15:00:00",
  "lieu": "Stade de France",
  "statut": "planifie"
}
```

#### Modifier un match
**PUT/PATCH** `/admin/matches/{id}`

#### Supprimer un match
**DELETE** `/admin/matches/{id}`

#### Sauvegarder composition
**POST** `/admin/matches/{id}/composition`
```json
{
  "compositions": [
    {
      "player_id": 1,
      "poste": "GK",
      "titulaire": true,
      "minutes": null
    },
    {
      "player_id": 2,
      "poste": "LB",
      "titulaire": true,
      "minutes": null
    }
  ]
}
```

**Postes disponibles:**
- `GK` - Gardien
- `LB/RB` - Arrière gauche/droit
- `CB` - Défenseur central
- `LWB/RWB` - Piston gauche/droit
- `CDM` - Milieu défensif
- `CM` - Milieu central
- `CAM` - Milieu offensif
- `LM/RM` - Milieu gauche/droit
- `LW/RW` - Ailier gauche/droit
- `ST` - Buteur
- `CF` - Attaquant central
- `LF/RF` - Attaquant gauche/droit

---

### Système de points

#### Voir configuration
**GET** `/admin/point-system`

#### Modifier configuration
**PUT/PATCH** `/admin/point-system/{id}`
```json
{
  "points_vote_equipe": 10,
  "points_homme_match": 5,
  "points_vainqueur_tournoi": 50,
  "description": "Barème standard"
}
```

---

### Classements (Admin)

#### Page des classements
**GET** `/admin/rankings`

#### API Classement équipes
**GET** `/admin/rankings/teams`

**Réponse:**
```json
[
  {
    "id": 1,
    "nom": "Paris SG",
    "code": "PSG",
    "played": 10,
    "wins": 7,
    "draws": 2,
    "losses": 1,
    "goals_for": 25,
    "goals_against": 10,
    "goal_difference": 15,
    "points": 23,
    "votes_won": 45,
    "form": ["W", "W", "D", "W", "L"]
  }
]
```

#### API Classement utilisateurs
**GET** `/admin/rankings/users`

**Réponse:**
```json
[
  {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "telephone": "0612345678",
    "points": 150,
    "total_votes": 20,
    "correct_votes": 15,
    "accuracy": 75.0,
    "match_votes": 18,
    "tournament_votes": 2
  }
]
```

---

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Non trouvé |
| 422 | Erreur de validation |
| 500 | Erreur serveur |

---

## Limites et contraintes

### Authentification
- Token JWT expire après 60 minutes
- Refresh token disponible
- Rate limiting: 5 tentatives de login par minute

### Votes
- Impossible de voter après le début du match
- Un seul vote par match et par utilisateur
- Les votes sont modifiables avant le début du match

### Compositions
- Visibles 1h avant le match
- Administrateurs seuls peuvent modifier

---

## Exemples d'utilisation

### Vote complet (Mobile)

```bash
# 1. Connexion
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"telephone": "0612345678", "password": "1234"}'

# 2. Récupérer les matchs
curl https://api.example.com/api/matches

# 3. Voter pour un match
curl -X POST https://api.example.com/api/votes/match \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"match_id": 1, "team_vote_id": 1, "player_vote_id": 5}'

# 4. Vérifier son classement
curl https://api.example.com/api/rankings/my-rank \
  -H "Authorization: Bearer {token}"
```

---

## Notes

- Toutes les dates sont au format ISO 8601
- Les mots de passe sont hachés avec bcrypt
- Les tokens JWT utilisent l'algorithme HS256
- L'API mobile nécessite une authentification JWT
- L'admin utilise l'authentification par session Laravel
