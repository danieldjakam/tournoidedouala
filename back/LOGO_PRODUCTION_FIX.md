# 🔧 Correction des Logos en Production

## 🚨 Problème : Les logos ne s'affichent pas en production

Quand vous uploadez un logo depuis l'interface admin en ligne, il ne s'affiche pas sur le frontend.

---

## ✅ Solution Étape par Étape

### Étape 1 : Vérifier et créer le lien symbolique

**SSH sur votre serveur :**
```bash
ssh user@votre-serveur.com
cd /chemin/vers/votre/back
```

**Créer le lien symbolique :**
```bash
php artisan storage:link
```

**Vérifier :**
```bash
ls -la public/storage
```

**Résultat attendu :**
```
public/storage -> ../storage/app/public
```

---

### Étape 2 : Vérifier les permissions

```bash
# Donner les permissions correctes
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/

# Changer le propriétaire (selon votre serveur)
# Pour Apache/Nginx standard :
chown -R www-data:www-data storage/ bootstrap/cache/

# Ou pour d'autres configurations :
chown -R $USER:$USER storage/ bootstrap/cache/
```

---

### Étape 3 : Vérifier APP_URL dans .env

**Éditer le fichier .env :**
```bash
nano .env
# ou
vi .env
```

**Configurer correctement :**
```env
# ❌ INCORRECT (localhost)
APP_URL=http://localhost

# ✅ CORRECT (votre domaine réel)
APP_URL=https://admin.tournoidedouala.com
```

**Après modification :**
```bash
php artisan config:cache
php artisan cache:clear
```

---

### Étape 4 : Tester l'upload d'un logo

1. **Connectez-vous à l'admin :** `https://admin.tournoidedouala.com/admin`

2. **Allez dans :** Teams → Créer une équipe

3. **Uploadez un logo** (image < 2MB)

4. **Vérifiez que le fichier existe :**
```bash
ls -la storage/app/public/logos/
```

---

### Étape 5 : Utiliser l'endpoint de debug

**Accédez à :**
```
https://admin.tournoidedouala.com/debug-logos
```

**Ce que vous devez voir :**
```json
{
  "app_url": "https://admin.tournoidedouala.com",
  "storage_link_exists": true,
  "storage_link_target": "../storage/app/public",
  "logos_dir_exists": true,
  "logos": ["team_logo_123.png"],
  "teams": [
    {
      "id": 1,
      "nom": "Mon Équipe",
      "logo_path": "logos/team_logo_123.png",
      "logo_url": "https://admin.tournoidedouala.com/storage/logos/team_logo_123.png",
      "logo_url_reachable": true
    }
  ]
}
```

**Points à vérifier :**
- ✅ `storage_link_exists`: doit être `true`
- ✅ `storage_link_target`: doit pointer vers `../storage/app/public`
- ✅ `logos_dir_exists`: doit être `true`
- ✅ `logos`: doit contenir vos fichiers
- ✅ `logo_url`: doit utiliser votre domaine, pas localhost
- ✅ `logo_url_reachable`: doit être `true`

---

## 🔍 Problèmes Courants

### ❌ Problème 1 : `storage_link_exists: false`

**Solution :**
```bash
cd /chemin/vers/back
php artisan storage:link
```

---

### ❌ Problème 2 : `logo_url` utilise localhost

**Cause :** `APP_URL` mal configuré

**Solution :**
```bash
# Éditer .env
nano .env

# Changer APP_URL
APP_URL=https://votre-domaine.com

# Vider le cache
php artisan config:cache
php artisan cache:clear
```

---

### ❌ Problème 3 : `logo_url_reachable: false`

**Cause :** Le fichier n'est pas accessible

**Solutions :**

1. **Vérifier que le fichier existe :**
```bash
ls -la storage/app/public/logos/
```

2. **Vérifier les permissions :**
```bash
chmod 644 storage/app/public/logos/*
```

3. **Re-créer le lien symbolique :**
```bash
rm public/storage
php artisan storage:link
```

---

### ❌ Problème 4 : Erreur 404 sur `/storage/logos/xxx.png`

**Causes possibles :**

1. **Le lien symbolique n'existe pas**
   ```bash
   php artisan storage:link
   ```

2. **Le serveur web n'est pas configuré pour servir les fichiers statiques**

   **Pour Nginx**, ajoutez dans votre config :
   ```nginx
   location /storage {
       alias /chemin/vers/back/storage/app/public;
       try_files $uri $uri/ =404;
   }
   ```

   **Pour Apache**, assurez-vous que `.htaccess` est activé :
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

---

### ❌ Problème 5 : Logo uploadé mais pas visible

**Vérifier les logs :**
```bash
tail -f storage/logs/laravel.log
```

**Erreurs courantes :**
- `Permission denied` → Corriger les permissions (Étape 2)
- `No such file or directory` → Créer le dossier logos
  ```bash
  mkdir -p storage/app/public/logos
  chmod 775 storage/app/public/logos
  ```

---

## 🧪 Test Final

**1. Tester l'URL du logo directement :**
```bash
curl -I https://admin.tournoidedouala.com/storage/logos/votre_logo.png
```

**Doit retourner :**
```
HTTP/1.1 200 OK
Content-Type: image/png
```

**2. Tester l'API :**
```bash
curl https://admin.tournoidedouala.com/api/teams
```

**Vérifier que `logo_url` est correct.**

**3. Tester sur le frontend :**
- Ouvrez la HomePage
- Les logos doivent s'afficher

---

## 📋 Checklist Rapide

```bash
# 1. Lien symbolique
cd /chemin/vers/back
php artisan storage:link

# 2. Permissions
chmod -R 775 storage/
chown -R www-data:www-data storage/

# 3. APP_URL correct
nano .env
# APP_URL=https://votre-domaine.com

# 4. Vider cache
php artisan config:cache
php artisan cache:clear

# 5. Debug
curl https://votre-domaine.com/debug-logos
```

---

## 🆘 Besoin d'aide ?

**Fournissez ces informations :**

1. **Sortie de `/debug-logos`**
2. **Votre configuration `.env`** (sans les mots de passe)
3. **Les logs d'erreur** (`storage/logs/laravel.log`)
4. **Votre serveur** (Apache/Nginx, shared hosting, VPS, etc.)
