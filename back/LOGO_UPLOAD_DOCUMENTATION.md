# Upload de Logos d'Équipes - Documentation

## Résumé des modifications

L'application permet maintenant de télécharger des logos d'équipes **depuis l'appareil local** lors de l'ajout ou de la modification d'une équipe, au lieu de devoir fournir une URL.

---

## Modifications apportées

### 1. Base de données

**Nouvelle migration :** `2026_03_05_053557_add_logo_path_to_teams_table.php`

Ajoute une colonne `logo_path` pour stocker le chemin du fichier uploadé :
```php
$table->string('logo_path')->nullable()->after('logo');
```

**Note :** L'ancienne colonne `logo` est conservée pour la rétrocompatibilité (URLs externes).

---

### 2. Backend (Laravel)

#### `app/Models/Team.php`
- Ajout de `logo_path` dans `$fillable`
- Mise à jour de `getLogoUrlAttribute()` :
  - Priorité au fichier uploadé (`logo_path`)
  - Fallback sur l'URL (`logo`) si pas de fichier

#### `app/Http/Controllers/Admin/TeamController.php`
- Ajout de la validation pour fichier image : `'logo' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048'`
- Gestion de l'upload dans `store()` et `update()`
- Suppression de l'ancien fichier lors de la mise à jour
- Nettoyage du fichier lors de la suppression d'une équipe

---

### 3. Frontend Admin (Inertia + React)

#### `resources/js/pages/Admin/Teams/TeamForm.tsx`
- Remplacement de l'input URL par un input file
- Ajout d'un aperçu du fichier sélectionné
- Bouton pour supprimer le fichier sélectionné
- Validation côté client (taille max 2 Mo, type image)
- Envoi via `FormData` pour supporter l'upload de fichier

---

### 4. Frontend Mobile (React)

#### `front/src/components/TeamManagement.jsx`
- Ajout d'un input file avec aperçu
- Validation du fichier (taille, type)
- Bouton pour supprimer le fichier
- Gestion de l'upload local au lieu de l'URL

---

## Configuration requise

### 1. Link symbolique
```bash
cd back/
php artisan storage:link
```

### 2. Permissions
Le dossier `storage/app/public/logos` doit être accessible en écriture :
```bash
chmod -R 775 storage/
```

---

## Utilisation

### Pour l'administrateur (Back-office Inertia)

1. Aller dans `/admin/teams`
2. Cliquer sur "Ajouter une équipe" ou "Modifier"
3. Dans le champ "Logo" :
   - Cliquer pour parcourir les fichiers
   - Sélectionner une image (JPEG, PNG, GIF, SVG)
   - Taille maximale : 2 Mo
4. Visualiser l'aperçu
5. Supprimer le fichier si besoin avec le bouton X
6. Soumettre le formulaire

### Pour le front mobile (TeamManagement)

1. Ouvrir la section de gestion des équipes
2. Remplir le nom de l'équipe
3. Dans "Logo" :
   - Cliquer pour sélectionner un fichier
   - Aperçu en temps réel
   - Validation automatique (2 Mo max)
4. Soumettre

---

## Structure des fichiers

```
storage/
└── app/
    └── public/
        └── logos/
            ├── abc123.png
            ├── def456.jpg
            └── ...
```

Les fichiers sont stockés dans `storage/app/public/logos/` et accessibles via :
```
http://localhost:8000/storage/logos/{filename}
```

---

## Rétrocompatibilité

- Les équipes existantes avec une URL dans `logo` continuent de fonctionner
- Le système priorise `logo_path` s'il existe
- Fallback automatique sur `logo` (URL) si `logo_path` est null

---

## Sécurité

### Validations implémentées

| Type | Backend | Frontend |
|------|---------|----------|
| Type de fichier | ✅ (image/*) | ✅ (vérification MIME) |
| Taille max | ✅ (2 Mo) | ✅ (2 Mo) |
| Extensions | ✅ (jpeg, png, jpg, gif, svg) | ❌ (géré par backend) |

### Bonnes pratiques

- ✅ Les fichiers sont stockés hors du dossier `public/`
- ✅ Accès via lien symbolique contrôlé
- ✅ Validation côté serveur obligatoire
- ✅ Suppression des anciens fichiers pour éviter l'accumulation

---

## Points d'attention

### Pour le déploiement

1. **Production** : S'assurer que le lien symbolique est créé
2. **Backups** : Inclure `storage/app/public` dans les sauvegardes
3. **CDN** : Pour optimiser les performances, configurer un CDN pour servir les images

### Limitations

- Taille maximale : 2 Mo par fichier
- Pas de redimensionnement automatique (à implémenter si besoin)
- Pas de compression d'image (à implémenter si besoin)

---

## Évolutions possibles

- [ ] Redimensionnement automatique des images
- [ ] Compression pour optimiser le poids
- [ ] Crop d'image avec interface de recadrage
- [ ] Support de WebP pour meilleure compression
- [ ] Stockage S3 pour la production

---

## Dépannage

### Les images ne s'affichent pas
```bash
# Vérifier le lien symbolique
ls -la public/storage

# Recréer le lien si besoin
php artisan storage:link
```

### Erreur de permission
```bash
# Ajuster les permissions
chmod -R 775 storage/
chown -R www-data:www-data storage/
```

### Upload échoue
- Vérifier `upload_max_filesize` et `post_max_size` dans `php.ini`
- Vérifier les logs Laravel : `storage/logs/laravel.log`
