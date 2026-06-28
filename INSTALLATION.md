# 🏔️ Team Rando — Guide d'installation

Application de randonnée pour la team de Nantua.
**100 % web**, installable sur iPhone et Android, données partagées en temps réel.
Même principe que l'appli familiale « Céline & Yves » : un simple **lien** + un **code de groupe**.

---

## ✅ 1. Tester tout de suite (sans rien installer)

L'appli fonctionne déjà en **mode local** (sur un seul appareil, pour tester).

- Ouvre `index.html` via un petit serveur web.
- Code du groupe par défaut : **`rando`**
- Crée ton profil (le 1ᵉʳ profil devient **administrateur**).

> En mode local, les données restent sur CE téléphone. Pour que **tous les amis partagent
> les mêmes randos et sorties**, il faut activer Firebase (étape 2). C'est gratuit et rapide.

---

## 🔥 2. Activer le partage entre amis (Firebase — gratuit, ~5 min)

> ⚠️ On crée un projet Firebase **séparé** de l'appli familiale, pour que les données
> de la team de rando et celles de la famille **ne se mélangent pas**.

1. Va sur **https://console.firebase.google.com** (avec ton compte Google).
2. **Ajouter un projet** → nom : `team-rando` → tu peux désactiver Google Analytics → **Créer**.
3. Menu de gauche **Build → Realtime Database** → **Créer une base de données** :
   - Emplacement : **europe-west1** (Belgique).
   - Démarrer en **mode test** (on sécurise juste après).
4. Menu **Build → Authentication** → **Commencer** → onglet **Sign-in method** →
   active **Anonyme** → Enregistrer.
5. En haut, **⚙️ Paramètres du projet** → descends à **« Vos applications »** →
   clique l'icône **`</>`** (Web) → donne un surnom `team-rando` → **Enregistrer**.
6. Firebase affiche un bloc **`const firebaseConfig = { ... }`**. Copie ces valeurs.
7. Ouvre le fichier **`firebase-config.js`** et remplace les `"COLLER_ICI"` par tes valeurs.

### 🔒 Sécuriser la base (règles)
Dans **Realtime Database → Règles**, colle ceci puis **Publier** :
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
→ Seules les personnes passées par l'appli (connexion anonyme) peuvent lire/écrire.

---

## 🌍 3. Mettre l'appli en ligne (Vercel — gratuit)

C'est ce qui donne le **lien** à partager.

1. Mets le dossier `rando-club` sur **GitHub** (nouveau dépôt, ex. `team-rando`).
2. Va sur **https://vercel.com** → connecte-toi avec GitHub.
3. **Add New… → Project** → choisis le dépôt `team-rando` → **Deploy**.
4. Vercel te donne un lien du type **`https://team-rando.vercel.app`**.

> À chaque fois que tu modifies le code et que tu l'envoies sur GitHub,
> Vercel met le site à jour tout seul.

---

## 📲 4. Partager avec les amis

Envoie-leur **2 choses** :
- le **lien** (ex. `https://team-rando.vercel.app`)
- le **code du groupe** (par défaut `rando` — tu peux le changer dans **Réglages → Administration**)

### Installer l'appli sur le téléphone
- **iPhone** : ouvrir le lien dans **Safari** → bouton **Partager** ⬆️ → **« Sur l'écran d'accueil »**.
- **Android** : ouvrir le lien dans **Chrome** → menu **⋮** → **« Installer l'application »**.

Chaque ami entre le code, crée son profil (prénom, photo, anniversaire, téléphone) — et c'est parti ! 🥾

---

## 🛠️ Mémo administrateur (toi)

- **Réglages → Administration → Changer le code du groupe** : change le mot de passe commun.
- **Réglages → Gérer les membres** : retirer quelqu'un, nommer un autre admin (⭐).
- **Accueil / Réglages → Photo de la Team** : mettre la photo du groupe.
- **Randos** : le catalogue est pré-rempli (26 randos ≤ 2h30 de Nantua). Chacun peut en ajouter.

## 📁 Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | page principale |
| `app.js` | toute la logique de l'appli |
| `db.js` | stockage (Firebase ou local) |
| `firebase-config.js` | **à remplir** avec ta config Firebase |
| `style.css` | thème graphique |
| `manifest.json`, `sw.js`, `pwa.js` | installation sur téléphone (PWA) |
| `vercel.json` | réglages de mise en ligne |
