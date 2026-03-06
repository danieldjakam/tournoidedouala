# Espace Équipe - Documentation

## Vue d'ensemble

L'espace équipe permet aux managers d'équipes de se connecter pour gérer leur équipe, leurs joueurs et les compositions pour chaque match.

---

## Accès à l'espace équipe

### URL de connexion
```
http://localhost:8000/team/login
```

### Identifiants de test

Après exécution du script de setup, un compte team de test est créé :

- **Téléphone :** `+237600000000`
- **Mot de passe :** `123456`
- **Équipe :** Équipe Test

---

## Fonctionnalités disponibles

### 1. Tableau de bord
- Vue d'ensemble de l'équipe
- Nombre de joueurs
- Matchs à venir
- Code équipe

### 2. Gestion des matchs
- Consulter le calendrier des matchs
- Voir les détails de chaque match
- **Définir la composition d'équipe** pour chaque match
  - Sélectionner les 11 titulaires
  - Définir le poste pour chaque joueur (GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST)
  - Ajouter/supprimer des joueurs de la composition
  - Enregistrer la composition

### 3. Gestion des joueurs
- Liste de tous les joueurs de l'équipe
- Ajouter un nouveau joueur
  - Prénom, nom
  - Numéro (optionnel)
  - Date de naissance
  - Nationalité
  - Bio
- Modifier les informations d'un joueur
- Supprimer un joueur

### 4. Profil de l'équipe
- Modifier les informations de l'équipe
  - Nom
  - Code
  - Description
  - Logo
- Gérer les identifiants de connexion
  - Email
  - Téléphone
  - Mot de passe

---

## Modification d'un compte équipe

### Via l'interface Admin

1. Se connecter en tant qu'admin : `http://localhost:8000/admin/login`
2. Aller dans "Équipes"
3. Cliquer sur le bouton "Modifier" (✏️) pour l'équipe souhaitée
4. Aller dans l'onglet "Compte équipe" (icône 🔑)
5. Modifier les informations :
   - **Téléphone** : identifiant de connexion (obligatoire)
   - **Email** : optionnel
   - **Mot de passe** : laisser vide pour conserver l'actuel
6. Cliquer sur "Mettre à jour le compte"

### Supprimer un compte équipe

Depuis la page de modification d'équipe (onglet "Compte équipe") :
1. Cliquer sur le bouton rouge "Supprimer le compte"
2. Confirmer la suppression

**Note :** La suppression du compte n'affecte pas l'équipe elle-même. L'équipe existera toujours, mais ne pourra plus se connecter à l'espace team. Vous pourrez toujours recréer un compte plus tard.

---

## Création d'un compte équipe

### Via l'interface Admin (Recommandé)

#### Pour une nouvelle équipe :
1. Se connecter en tant qu'admin : `http://localhost:8000/admin/login`
2. Aller dans "Équipes"
3. Cliquer sur "Ajouter une équipe"
4. Remplir les informations de l'équipe
5. **Optionnel** : Cocher "Créer un compte équipe" et remplir :
   - Email de connexion (optionnel)
   - Téléphone (obligatoire, servira d'identifiant)
   - Mot de passe (obligatoire, min 6 caractères)

#### Pour une équipe existante (sans compte) :
1. Se connecter en tant qu'admin : `http://localhost:8000/admin/login`
2. Aller dans "Équipes"
3. Dans le tableau, repérer les équipes avec "À créer" dans la colonne "Compte"
4. Cliquer sur le bouton 🔑 (clé) dans la colonne "Actions"
5. Remplir le formulaire :
   - **Téléphone** (obligatoire) : servira d'identifiant de connexion
   - **Email** (optionnel)
   - **Mot de passe** (obligatoire, min 6 caractères)
6. Cliquer sur "Générer le compte"

**Note :** Une équipe ne peut avoir qu'un seul compte. Si un compte existe déjà, le bouton n'est pas affiché.

### Via Tinker (CLI)

```bash
php artisan tinker
```

```php
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$team = Team::find(1); // Remplacer par l'ID de l'équipe

User::create([
    'prenom' => $team->nom,
    'nom' => 'Équipe',
    'telephone' => '+237600000001',
    'password' => Hash::make('123456'),
    'role' => 'team',
    'team_id' => $team->id,
]);
```

---

## Routes disponibles

| Route | Méthode | Description |
|-------|---------|-------------|
| `/team/login` | GET/POST | Connexion équipe |
| `/team/logout` | POST | Déconnexion |
| `/team` | GET | Tableau de bord |
| `/team/matches` | GET | Liste des matchs |
| `/team/matches/{id}` | GET | Détail du match + composition |
| `/team/matches/{id}/composition` | POST | Sauvegarder composition |
| `/team/players` | GET | Liste des joueurs |
| `/team/players/create` | GET | Formulaire d'ajout |
| `/team/players` | POST | Créer un joueur |
| `/team/players/{id}/edit` | GET | Formulaire de modification |
| `/team/players/{id}` | PUT | Modifier un joueur |
| `/team/players/{id}` | DELETE | Supprimer un joueur |
| `/team/profile` | GET | Profil équipe |
| `/team/profile/update` | POST | Mettre à jour l'équipe |
| `/team/profile/credentials` | POST | Mettre à jour identifiants |

---

## Postes disponibles pour les compositions

| Code | Poste | Description |
|------|-------|-------------|
| GK | Gardien | Goalkeeper |
| CB | Défenseur Central | Center Back |
| LB | Arrière Gauche | Left Back |
| RB | Arrière Droit | Right Back |
| CDM | Milieu Défensif | Defensive Midfielder |
| CM | Milieu Central | Central Midfielder |
| CAM | Milieu Offensif | Attacking Midfielder |
| LW | Ailier Gauche | Left Winger |
| RW | Ailier Droit | Right Winger |
| ST | Buteur | Striker |

---

## Règles de composition

- **11 titulaires obligatoires** pour valider la composition
- Chaque joueur doit avoir un poste défini
- La composition peut être modifiée jusqu'au début du match
- Visible par les utilisateurs 1h avant le match

---

## Exemple : Créer un compte pour une équipe existante

```bash
cd back
php artisan tinker
```

```php
// Trouver l'équipe
$team = App\Models\Team::where('code', 'PSG')->first();

// Créer le compte team
App\Models\User::create([
    'prenom' => $team->nom,
    'nom' => 'Équipe',
    'telephone' => '+237670000000',  // Téléphone unique
    'password' => Hash::make('123456'),
    'role' => 'team',
    'team_id' => $team->id,
]);

echo "Compte créé pour l'équipe {$team->nom}\n";
echo "Téléphone: +237670000000\n";
echo "Mot de passe: 123456\n";
```

---

## Sécurité

- Les comptes team sont protégés par le middleware `team`
- Un compte team ne peut accéder qu'aux données de son équipe
- Le téléphone doit être unique pour chaque compte team
- Les mots de passe sont hachés avec bcrypt

---

## Support

Pour toute question ou problème, contacter l'administrateur du tournoi.
