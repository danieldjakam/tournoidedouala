# 🚀 Guide de Déploiement Production - Tournoi de Douala

## ✅ Checklist de Déploiement

### 1. Configuration du Serveur

#### A. Fichier .env (IMPORTANT)
```env
APP_NAME="Tournoi de Douala"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://admin.tournoidedouala.com

DB_CONNECTION=mysql
DB_HOST=votre_hote_db
DB_PORT=3306
DB_DATABASE=tournoi_douala
DB_USERNAME=votre_user
DB_PASSWORD=votre_mot_de_passe

# Storage
FILESYSTEM_DISK=public
```

⚠️ **REMPLACEZ `APP_URL` PAR VOTRE VRAI DOMAINE**

---

### 2. Commandes de Déploiement

```bash
# 1. Se connecter au serveur
ssh user@votre-serveur.com

# 2. Aller dans le dossier du projet
cd /chemin/vers/back

# 3. Installer les dépendances
composer install --optimize-autoloader --no-dev

# 4. Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos configurations

# 5. Générer la clé d'application
php artisan key:generate

# 6. Lancer les migrations
php artisan migrate --force

# 7. CRÉER LE LIEN SYMBOLIQUE (CRUCIAL POUR LES LOGOS)
php artisan storage:link

# 8. Optimiser pour la production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 9. Définir les permissions (IMPORTANT)
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chown -R www-data:www-data storage/ bootstrap/cache/

# 10. Redémarrer le serveur web
# Pour Apache:
sudo systemctl restart apache2
# Pour Nginx:
sudo systemctl restart nginx
# Pour PHP built-in server:
php artisan serve --host=0.0.0.0 --port=8000
```

---

### 3. Vérification des Logos

#### A. Vérifier le lien symbolique
```bash
cd /chemin/vers/back
ls -la public/storage
```

**Résultat attendu :**
```
public/storage -> ../storage/app/public
```

#### B. Vérifier le dossier des logos
```bash
ls -la storage/app/public/logos/
```

**Doit afficher vos fichiers logo uploadés**

#### C. Tester l'URL d'un logo
```bash
# Remplacez par votre domaine
curl -I https://admin.tournoidedouala.com/storage/logos/nom_du_logo.png
```

**Doit retourner : HTTP/1.1 200 OK**

---

### 4. Tester l'API

```bash
# Tester les équipes
curl https://admin.tournoidedouala.com/api/teams

# Vérifier que logo_url est correct
# Doit retourner quelque chose comme :
# "logo_url": "https://admin.tournoidedouala.com/storage/logos/team_logo.png"
```

---

### 5. Problèmes Courants et Solutions

#### ❌ Erreur 404 sur les logos

**Cause :** Le lien symbolique n'existe pas

**Solution :**
```bash
cd /chemin/vers/back
php artisan storage:link
```

#### ❌ Erreur 403 (Forbidden)

**Cause :** Permissions insuffisantes

**Solution :**
```bash
chmod -R 775 storage/
chown -R www-data:www-data storage/
```

#### ❌ URLs incorrectes dans logo_url

**Cause :** APP_URL mal configuré

**Solution :**
1. Vérifiez `.env` :
```env
APP_URL=https://votre-domaine.com
```

2. Videz le cache :
```bash
php artisan config:clear
php artisan cache:clear
```

#### ❌ Logo ne s'upload pas

**Cause :** Dossier non accessible en écriture

**Solution :**
```bash
chmod -R 775 storage/app/
chown -R www-data:www-data storage/app/
```

**Vérifiez les logs :**
```bash
tail -f storage/logs/laravel.log
```

---

### 6. Configuration Frontend

Dans le fichier `front/.env` :

```env
# URL de l'API backend
VITE_API_URL=https://admin.tournoidedouala.com/api
```

**Puis rebuild le frontend :**
```bash
cd front/
npm run build
# Ou pour le dev :
npm run dev
```

---

### 7. Script de Déploiement Automatique

Créez un fichier `deploy.sh` :

```bash
#!/bin/bash

echo "🚀 Déploiement du Tournoi de Douala..."

cd /chemin/vers/back

# Maintenance mode
php artisan down

# Pull latest code
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev

# Clear cache
php artisan cache:clear
php artisan config:clear

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chown -R www-data:www-data storage/ bootstrap/cache/

# Bring back up
php artisan up

echo "✅ Déploiement terminé !"
```

**Rendre exécutable :**
```bash
chmod +x deploy.sh
```

**Exécuter :**
```bash
./deploy.sh
```

---

### 8. Endpoint de Debug

Ajoutez cette route temporaire dans `routes/web.php` :

```php
Route::get('/debug-storage', function() {
    return [
        'app_url' => config('app.url'),
        'storage_link_exists' => file_exists(public_path('storage')),
        'logos_dir' => storage_path('app/public/logos'),
        'logos_dir_exists' => is_dir(storage_path('app/public/logos')),
        'logos' => file_exists(storage_path('app/public/logos')) 
            ? scandir(storage_path('app/public/logos')) 
            : [],
        'teams' => \App\Models\Team::all()->map(function($team) {
            return [
                'id' => $team->id,
                'nom' => $team->nom,
                'logo_path' => $team->logo_path,
                'logo_url' => $team->logo_url,
            ];
        }),
    ];
})->middleware('auth'); // Protéger avec auth !
```

**Accédez à :** `https://votre-domaine.com/debug-storage`

---

### 9. Vérification Finale

1. ✅ Upload d'un logo depuis l'admin
2. ✅ Vérifier que le fichier existe dans `storage/app/public/logos/`
3. ✅ Accéder au logo via `https://votre-domaine.com/storage/logos/fichier.png`
4. ✅ Vérifier que l'API retourne la bonne URL
5. ✅ Vérifier l'affichage sur le frontend

---

### 10. Logs et Debugging

**Voir les logs en temps réel :**
```bash
tail -f storage/logs/laravel.log
```

**Activer les logs (seulement en dev !) :**
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

**Désactiver les logs en production :**
```env
APP_DEBUG=false
LOG_LEVEL=error
```

---

## 📞 Support

Si le problème persiste, vérifiez :

1. Les logs Laravel : `storage/logs/laravel.log`
2. Les logs du serveur web : `/var/log/nginx/error.log` ou `/var/log/apache2/error.log`
3. Les permissions de fichiers
4. La configuration `APP_URL`
