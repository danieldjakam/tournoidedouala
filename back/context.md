
# Contexte du projet : Application de pronostics sportifs

## 1. Objectif

L'application permet :

- Aux utilisateurs mobiles :

  - De se connecter via **téléphone + mot de passe** (4 chiffres, haché) avec **authentification JWT**
  - De voter pour :
    - L'équipe gagnante d'un match
    - L'homme du match
    - L'équipe gagnante du tournoi unique
  - De consulter les classements des pronostiqueurs et des équipes
  - De visualiser les compositions d'équipes pour les matchs (1h avant le match)
  - De consulter l’historique des matchs, scores et compositions
  - Toutes ces fonctionnalités passent par les **routes API** exposées pour l’application mobile distante
- Aux administrateurs :

  - D’utiliser le **front web dédié admin** (connexion via **email + mot de passe**)
  - De créer et gérer les matchs, équipes et joueurs
  - De définir la composition des équipes pour chaque match (titulaire/remplaçant et poste)
  - De gérer le système de points (définir combien de points pour chaque type de vote correct)
  - De suivre et valider les votes pour appliquer les points

**Note :**

- Le front web est uniquement pour l’admin.
- L’application mobile distante utilise JWT pour l’authentification sécurisée des utilisateurs.

---

## 2. Utilisateurs

- **Champs :**
  - `prenom`, `nom`
  - `telephone` (unique, utilisé pour connexion mobile)
  - `email` (optionnel pour utilisateurs, obligatoire pour admin)
  - `date_naissance`, `sexe`
  - `password` (haché, 4 chiffres)
  - `indicatif_pays` (pour les connexions internationales)
  - `role` (user/admin)
  - `points` (total calculé selon votes)
- **Connexion :**
  - Utilisateur mobile : `telephone + password` → JWT
  - Admin : `email + password` (session web)
- Les points sont **mis à jour automatiquement après validation par l’admin** selon le barème défini.

---

## 3. Équipes

- Une équipe a plusieurs joueurs.
- Priorité pour affichage côté front mobile.
- Admin définit la composition par match.

---

## 4. Joueurs

- Postes et statut (titulaire/remplaçant) définis par match.
- Historique conservé pour tous les matchs.
- Table pivot `player_match` pour gérer poste et titularité.

---

## 5. Matchs

- Chaque match a deux équipes.
- Contient score, composition (`compo_publique` = visible 1h avant match)
- Historique des compositions et scores conservé.
- Les utilisateurs votent avant le début du match via **API mobile sécurisée par JWT**.

---

## 6. Votes

### VoteMatch

- `user_id`, `match_id`, `team_vote_id`, `player_vote_id` (homme du match)
- `points` calculés **après validation par l’admin**

### VoteTournament

- `user_id`, `team_vote_id` pour le vainqueur du tournoi unique
- `points` calculés **après validation par l’admin**

---

## 7. Gestion des points

- L’admin définit le barème :
  - Points pour vote correct équipe d’un match
  - Points pour vote correct homme du match
  - Points pour vote correct vainqueur du tournoi
- Les points sont ensuite appliqués aux utilisateurs pour calculer le classement.

---

## 8. Classements

- Classement utilisateurs : total points
- Classement équipes : points gagnés via votes
- Accessible à tous via API mobile

---

## 9. Gestion des compositions

- Admin glisse-dépose les joueurs pour définir :
  - Titulaires / remplaçants
  - Poste exact pour chaque joueur
- Historique conservé pour tous les matchs
- Composition visible pour tous **1h avant le match**
