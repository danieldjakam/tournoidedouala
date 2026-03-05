# Page Profil Utilisateur - Fonctionnalités Implémentées

## 📋 Vue d'ensemble

La page de profil utilisateur est maintenant **entièrement fonctionnelle** avec toutes les fonctionnalités suivantes connectées au backend Laravel.

---

## ✅ Fonctionnalités Implémentées

### 1. **Modification des Informations Personnelles**

**Champs modifiables :**
- ✅ Prénom (`prenom`)
- ✅ Nom (`nom`)
- ✅ Email (`email`)
- ✅ Téléphone (`telephone`)
- ✅ Sexe (`sexe` : M/F)
- ✅ Date de naissance (`date_naissance`)

**API Endpoint :**
```
PUT /api/user/profile
Authorization: Bearer {token}
```

**Body :**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean@example.com",
  "telephone": "0612345678",
  "sexe": "M",
  "date_naissance": "1990-01-01"
}
```

---

### 2. **Upload d'Avatar / Photo de Profil**

**Fonctionnalités :**
- ✅ Upload depuis l'appareil local
- ✅ Validation (image, max 2 Mo)
- ✅ Aperçu avant validation
- ✅ Suppression de l'avatar
- ✅ Avatar par défaut avec initiales

**API Endpoints :**
```
POST /api/user/avatar (FormData)
DELETE /api/user/avatar
```

**Storage :**
- Fichiers stockés dans `storage/app/public/avatars/`
- Accessibles via `http://localhost/storage/avatars/{filename}`

**Modèle User :**
```php
// Accessor ajouté
$user->avatar_url // Retourne URL complète ou avatar par défaut
```

---

### 3. **Changement de Mot de Passe**

**Règles :**
- ✅ Mot de passe actuel requis
- ✅ Nouveau mot de passe : 4 chiffres
- ✅ Confirmation requise
- ✅ Validation du mot de passe actuel

**API Endpoint :**
```
POST /api/user/change-password
Authorization: Bearer {token}
```

**Body :**
```json
{
  "current_password": "1234",
  "new_password": "5678",
  "confirm_password": "5678"
}
```

---

### 4. **Historique des Activités (Pronostics)**

**Données affichées :**
- ✅ 20 derniers votes de matchs
- ✅ Tous les votes tournoi
- ✅ Statistiques globales

**API Endpoint :**
```
GET /api/user/activity
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "activity": {
    "match_votes": [
      {
        "id": 1,
        "type": "match",
        "match": {
          "team1": "PSG",
          "team2": "OM",
          "score_team_1": 2,
          "score_team_2": 1,
          "statut": "termine"
        },
        "team_vote": "PSG",
        "player_vote": "Mbappé Kylian",
        "points": 10,
        "validated": true,
        "created_at": "2026-03-05T10:00:00.000Z"
      }
    ],
    "tournament_votes": [...]
  },
  "stats": {
    "total_votes": 25,
    "correct_votes": 18,
    "accuracy": 72.0,
    "total_points": 350
  }
}
```

---

### 5. **Statistiques Utilisateur**

**Données :**
- ✅ Points totaux
- ✅ Classement actuel (rank)
- ✅ Nombre total de pronostics
- ✅ Taux de précision (%)

**API Endpoint :**
```
GET /api/user/stats
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "stats": {
    "total_points": 350,
    "rank": 5,
    "predictions_count": 25,
    "match_votes": 20,
    "tournament_votes": 5,
    "correct_votes": 18,
    "accuracy": 72.0
  }
}
```

---

## 📁 Fichiers Modifiés/Créés

### Backend (Laravel)

| Fichier | Description |
|---------|-------------|
| `app/Models/User.php` | Ajout `avatar_path`, accessor `avatar_url` |
| `app/Http/Controllers/Api/UserController.php` | Nouveau controller complet |
| `routes/api.php` | Routes user profile |
| `database/migrations/*_add_avatar_path_to_users_table.php` | Migration avatar |

### Frontend (React)

| Fichier | Description |
|---------|-------------|
| `front/src/pages/UserProfilePage.jsx` | Page profil entièrement réécrite |
| `front/src/api/userService.js` | Fonctions API complètes |

---

## 🎨 UI/UX Features

### Sections de la Page Profil

1. **En-tête de Profil**
   - Bannière avec dégradé
   - Avatar circulaire avec bouton upload
   - Nom complet

2. **Cartes Statistiques**
   - Points totaux
   - Classement
   - Nombre de pronostics
   - Précision

3. **Navigation Latérale**
   - Infos Perso
   - Compte
   - Activité

4. **Section Infos Perso**
   - Formulaire modifiable
   - Validation en temps réel
   - Boutons Enregistrer/Annuler

5. **Section Compte**
   - Changement mot de passe
   - Gestion avatar

6. **Section Activité**
   - Statistiques récapitulatives
   - Historique votes matchs
   - Historique votes tournoi
   - Indicateurs visuels (✓/✗/⏳)

---

## 🔒 Sécurité

### Validations Backend

```php
// Update Profile
'email' => 'nullable|email|unique:users'
'telephone' => 'unique:users'
'sexe' => 'in:M,F,Autre'
'date_naissance' => 'before:today'

// Upload Avatar
'avatar' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048'

// Change Password
'current_password' => 'required'
'new_password' => 'required|min:4|max:4|regex:/^\d+$/'
'confirm_password' => 'required|same:new_password'
```

### Authentification

- ✅ Toutes les routes protégées par `auth:api` (JWT)
- ✅ Token requis pour chaque requête
- ✅ 401 retourné si token invalide/expiré

---

## 🧪 Tests Rapides

### 1. Modifier le profil
```bash
curl -X PUT http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"prenom": "Test", "nom": "User"}'
```

### 2. Upload avatar
```bash
curl -X POST http://localhost:8000/api/user/avatar \
  -H "Authorization: Bearer {token}" \
  -F "avatar=@/path/to/image.jpg"
```

### 3. Voir activité
```bash
curl http://localhost:8000/api/user/activity \
  -H "Authorization: Bearer {token}"
```

### 4. Voir stats
```bash
curl http://localhost:8000/api/user/stats \
  -H "Authorization: Bearer {token}"
```

---

## 🐛 Points d'Attention

### Pour le Développeur

1. **Avatar par défaut** : Utilise `ui-avatars.com` si pas d'avatar uploadé
2. **Format mot de passe** : Toujours 4 chiffres (spécifique à l'app)
3. **Timezone** : Dates retournées en ISO 8601 (UTC)
4. **Pagination** : Activité limitée à 20 matchs + 5 tournois

### Pour l'Utilisateur

1. **Taille avatar** : Max 2 Mo
2. **Formats acceptés** : JPEG, PNG, GIF
3. **Mot de passe** : Exactement 4 chiffres
4. **Email unique** : Ne peut pas être utilisé par un autre compte

---

## 🚀 Améliorations Possibles

- [ ] Upload multiple de photos (galerie)
- [ ] Crop d'image pour avatar
- [ ] Historique complet avec pagination
- [ ] Export des données (CSV/PDF)
- [ ] Notifications par email pour changement important
- [ ] 2FA (double authentification)
- [ ] Suppression de compte

---

## 📊 Base de Données

### Table `users` (champs ajoutés)

```sql
ALTER TABLE users ADD COLUMN avatar_path VARCHAR(255) NULL AFTER email;
```

### Exemple de données

```sql
UPDATE users SET 
  avatar_path = 'avatars/user123.png',
  prenom = 'Jean',
  nom = 'Dupont',
  email = 'jean@example.com'
WHERE id = 1;
```

---

## ✅ Checklist Finale

- [x] Migration avatar créée et exécutée
- [x] Modèle User mis à jour
- [x] UserController créé avec toutes les méthodes
- [x] Routes API configurées
- [x] Frontend connecté au backend
- [x] Upload d'avatar fonctionnel
- [x] Modification profil fonctionnelle
- [x] Changement mot de passe fonctionnel
- [x] Historique activités affiché
- [x] Statistiques affichées
- [x] Responsive design (mobile/desktop)
- [x] Validations frontend + backend
- [x] Messages de succès/erreur
- [x] Cache Laravel vidé

---

**La page profil est maintenant 100% fonctionnelle !** 🎉
