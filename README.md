# Accueil du Jour — Application mobile

Application React Native / Expo pour la gestion d'un **Accueil de Jour** (structure d'accueil pour personnes âgées). Elle permet aux responsables, équipiers et résidents de communiquer, consulter les publications et gérer les informations du centre.

---

## Fonctionnement général

L'application propose **trois modes d'accès** selon le rôle connecté :

### Mode Admin (Responsable ADJ)
- Tableau de bord avec publications et annonces
- Messagerie privée avec chaque résident et chaque équipier
- Gestion des résidents (fiche complète, PIA, contact d'urgence, transport, tarif)
- Gestion de l'équipe (ajout, modification, suppression)
- Planning (import d'image)
- Création et édition de publications (photos, texte)
- Envoi d'annonces push à toute la structure
- Notifications push automatiques à la publication d'un post

### Mode Équipier
- Accueil avec fil de publications
- Messagerie privée avec l'admin
- Liste des résidents (lecture seule)
- Profil modifiable avec photo
- Canal groupe (lecture des membres de l'équipe)
- Notifications push à chaque nouvelle publication ou message

### Mode Résident
- Accueil avec fil des publications et annonces
- Messagerie privée avec l'admin
- Profil avec photo modifiable
- Planning visible
- Notifications push uniquement les jours où le résident est inscrit

---

## Notifications push

Les notifications fonctionnent via **Expo Push Notifications** + un backend Express hébergé.

| Événement | Destinataires |
|---|---|
| Nouvelle publication | Résidents inscrits ce jour-là + tous les équipiers |
| Annonce | Tous les résidents + tous les équipiers |
| Message privé admin → résident/équipier | Uniquement la personne ciblée |
| Message privé résident/équipier → admin | Tous les comptes admin |

---

## Messagerie

- État lu/non-lu partagé en temps réel (état React global dans App.js)
- Indicateurs ✓ / ✓✓ sur les messages envoyés (gris = envoyé, bleu = lu)
- Badge rouge avec compteur sur l'icône mail de chaque home
- Pièces jointes : photos, vidéos, audio, PDF
- Photos de profil affichées dans les bulles et les en-têtes de conversation

---

## Structure du projet

```
ADJ2/
├── App.js                        # Racine : état global, navigation, logique métier
├── app.json                      # Config Expo (nom, icône, notifications)
├── .env                          # Variables d'environnement (URL backend)
│
├── screens/
│   ├── LoginScreen.js            # Écran de connexion (3 rôles)
│   │
│   ├── admin/
│   │   ├── HomeScreen.js         # Tableau de bord admin
│   │   ├── ProfileScreen.js      # Profil + infos ADJ modifiables
│   │   ├── MessagerieListeScreen.js  # Liste de toutes les conversations
│   │   ├── MessagingScreen.js    # Chat admin ↔ résident/équipier
│   │   ├── ResidentsScreen.js    # Liste des résidents
│   │   ├── EditResidentScreen.js # Fiche résident (édition)
│   │   ├── NouveauResidentScreen.js  # Création résident
│   │   ├── GererEquipeScreen.js  # Liste de l'équipe
│   │   ├── EditEquipierScreen.js # Fiche équipier (édition)
│   │   ├── NouveauStaffScreen.js # Création équipier
│   │   ├── PlanningScreen.js     # Planning (image)
│   │   ├── PublicationsScreen.js # Gestion des publications
│   │   └── NouvellePublicationScreen.js  # Création/édition publication
│   │
│   ├── equipier/
│   │   ├── HomeScreen.js         # Accueil équipier
│   │   ├── ProfileScreen.js      # Profil équipier (photo modifiable)
│   │   ├── MessagingScreen.js    # Chat équipier ↔ admin
│   │   ├── ResidentsScreen.js    # Liste résidents (lecture)
│   │   ├── ProfilResidentScreen.js  # Fiche résident (lecture)
│   │   ├── ProfilAdminScreen.js  # Profil public de l'admin
│   │   └── CanalGroupeScreen.js  # Canal groupe équipe
│   │
│   └── resident/
│       ├── HomeScreen.js         # Accueil résident
│       ├── ProfileScreen.js      # Profil résident (photo modifiable)
│       └── MessagingScreen.js    # Chat résident ↔ admin
│
├── utils/
│   ├── notifications.js          # Expo push notifications (natif uniquement)
│   └── notifications.web.js     # Stub web (Metro sélectionne auto)
│
├── assets/                       # Icônes, splash screen
│
└── backend/                      # Serveur Express (notifications push)
    ├── index.js                  # API REST : /token, /notifier, /health
    ├── db.js                     # Stockage JSON (adj-db.json)
    ├── package.json
    └── Procfile                  # Démarrage Railway/Render
```

---

## Navigation

L'app n'utilise **pas React Navigation**. La navigation est gérée par un état `currentPage` (string) dans `App.js` avec des rendus conditionnels. Les fonctions `setCurrentPage` sont passées en prop `onNavigate`.

---

## État global (App.js)

| State | Description |
|---|---|
| `mode` | `null` \| `'admin'` \| `'equipier'` \| `'resident'` |
| `userId` | NOM en majuscules de l'utilisateur connecté (ex: `'DUPONT'`) |
| `residents` | Liste des résidents avec leurs infos et photos |
| `equipe` | Liste des équipiers avec leurs infos et photos |
| `publications` | Fil de publications |
| `convMessages` | Objet `{ [convId]: Message[] }` — source unique des messages |
| `profilADJ` | Infos et photo de l'admin |

### Identifiants de conversation (`convId`)
- Résident : `"resident-{id}"` (ex: `"resident-1"`)
- Équipier : `"equipier-e2"` (ex: `"equipier-e2"`)

---

## Comptes de démonstration

| Nom (login) | Mot de passe | Rôle |
|---|---|---|
| ADMIN | admin123 | Admin |
| MOREAU | equip123 | Équipier (Luc Moreau) |
| DUPONT | resident123 | Résident (Marie Dupont) |

---

## Lancer en local

### Application mobile (Expo)
```bash
npm install
npx expo start
```
Scanner le QR code avec l'app **Expo Go** (iOS / Android).

### Backend (notifications push)
```bash
cd backend
npm install
node index.js
# Démarre sur http://localhost:3000
```

S'assurer que `.env` contient :
```
EXPO_PUBLIC_BACKEND_URL=http://<IP-locale>:3000
```
(utiliser l'IP du PC sur le réseau local, pas `localhost`, pour que le téléphone puisse atteindre le backend)

---

## Passer en production (téléphone réel)

### 1. Déployer le backend

**Railway (recommandé) :**
1. Créer un compte sur [railway.app](https://railway.app)
2. Nouveau projet → "Deploy from GitHub repo" → pointer vers le dossier `backend/`
3. Récupérer l'URL fournie (ex: `https://adj-backend-xxxx.up.railway.app`)

### 2. Mettre à jour l'URL dans `.env`
```
EXPO_PUBLIC_BACKEND_URL=https://adj-backend-xxxx.up.railway.app
```

### 3. Créer un compte EAS et builder l'app
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android   # APK Android
eas build --platform ios       # IPA iOS (nécessite compte Apple Developer)
```

### 4. Distribuer
- **Android** : télécharger l'APK depuis le dashboard EAS et l'installer directement
- **iOS** : utiliser TestFlight (compte Apple Developer à 99€/an requis)

---

## Technologies

| Technologie | Usage |
|---|---|
| React Native 0.85 + Expo SDK 56 | App mobile cross-platform |
| Expo Notifications | Push notifications natives |
| Expo Image Picker | Sélection de photos |
| Expo Document Picker | Pièces jointes (PDF, audio) |
| Express.js | Backend API notifications |
| Expo Server SDK | Envoi push depuis le backend |
| JSON file (adj-db.json) | Stockage tokens push |
