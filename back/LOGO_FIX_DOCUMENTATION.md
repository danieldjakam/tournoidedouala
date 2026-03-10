# Configuration pour l'affichage des logos d'équipes

## Problème
Les logos des équipes ne s'affichent pas sur la HomePage du front après enregistrement depuis l'interface admin Laravel.

## Solution

### 1. Créer le lien symbolique pour le storage

Exécutez cette commande dans le dossier `back/` :

```bash
cd back/
php artisan storage:link
```

Cette commande crée un lien symbolique entre `storage/app/public` et `public/storage`, permettant d'accéder aux fichiers uploadés via une URL publique.

### 2. Configurer APP_URL dans .env

Créez un fichier `.env` dans `back/` (ou modifiez-le) avec :

```env
APP_NAME="Tournoi de Douala"
APP_URL=http://localhost:8000
# Ou pour la production :
# APP_URL=https://admin.tournoidedouala.com
```

**Important** : `APP_URL` doit correspondre à l'URL de votre backend Laravel, car c'est cette URL qui est utilisée pour générer les URLs complètes des logos via `asset('storage/' . $logo_path)`.

### 3. Vérifier la configuration du frontend

Dans `front/.env`, assurez-vous que `VITE_API_URL` pointe vers le bon backend :

```env
# Pour le développement local :
VITE_API_URL=http://localhost:8000/api

# Pour la production :
VITE_API_URL=https://admin.tournoidedouala.com/api
```

### 4. Structure de stockage des logos

- **Emplacement physique** : `back/storage/app/public/logos/`
- **URL d'accès** : `http://localhost:8000/storage/logos/{nom_du_fichier}`
- **Champ dans la BDD** : `logo_path` (ex: `logos/team_logo.png`)

### 5. Comment fonctionne l'URL du logo

Le modèle `Team` utilise un accesseur `logo_url` :

```php
public function getLogoUrlAttribute(): string
{
    if ($this->logo_path) {
        return asset('storage/' . $this->logo_path);
    }
    // ...
}
```

Cela génère une URL complète basée sur `APP_URL`.

### 6. Vérifications

Après avoir créé le lien symbolique, vérifiez :

```bash
# Le lien symbolique doit exister
ls -la back/public/storage

# Doit pointer vers storage/app/public
```

### 7. Tester l'API

Faites une requête GET vers `/api/teams` :

```bash
curl http://localhost:8000/api/teams
```

Vous devriez voir :

```json
{
  "data": [
    {
      "id": 1,
      "nom": "Canon Sportif de Douala",
      "code": "CAN",
      "logo_url": "http://localhost:8000/storage/logos/team_logo.png"
    }
  ]
}
```

### 8. Problèmes courants

#### Erreur 404 sur les logos
- Vérifiez que `php artisan storage:link` a été exécuté
- Vérifiez que le fichier existe dans `storage/app/public/logos/`

#### URLs incorrectes
- Vérifiez que `APP_URL` est correct dans `.env`
- Redémarrez le serveur Laravel après modification de `.env`

#### CORS en développement
Si le frontend et le backend sont sur des domaines différents, configurez CORS dans `back/config/cors.php`.

### 9. Commandes de vérification

```bash
# 1. Vérifier le lien symbolique
cd back/
ls -la public/storage

# 2. Vérifier les logos uploadés
ls -la storage/app/public/logos/

# 3. Tester l'API
php artisan serve
# Dans un autre terminal :
curl http://localhost:8000/api/teams
```
