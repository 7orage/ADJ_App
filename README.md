# Accueil du Jour

Application mobile pour la gestion d'un **Accueil de Jour** — une structure qui accueille des personnes âgées à la journée. Elle centralise la communication entre la responsable, l'équipe soignante et les résidents (et leurs familles).

Construite avec **React Native / Expo**. Actuellement testable via Expo Go ou navigateur web. Le build natif iOS/Android est en cours.

---

## Ce que fait l'application

### Trois espaces distincts selon le rôle

**Responsable ADJ (admin)**
- Publie des photos et comptes-rendus des activités du jour
- Envoie des annonces à toute la structure
- Échange en messagerie privée avec chaque résident et chaque équipier
- Gère les fiches résidents (informations, PIA, contact d'urgence, transport)
- Gère l'équipe (ajout, modification des profils)
- Importe et partage le planning

**Équipier**
- Consulte le fil des publications
- Échange en messagerie privée avec la responsable
- Accède aux fiches des résidents
- Participe au canal groupe de l'équipe

**Résident / Famille**
- Suit les activités de la journée via les publications
- Échange directement avec la responsable
- Consulte son planning et ses informations

---

## Fonctionnalités clés

- **Messagerie** avec indicateurs lu / non lu (✓ / ✓✓), pièces jointes (photos, vidéos, PDF, audio) et photos de profil dans les bulles
- **Notifications push** ciblées : les résidents sont notifiés uniquement les jours où ils sont inscrits ; les annonces touchent toute l'équipe
- **Photos de profil** modifiables pour chaque rôle, visibles partout dans l'app
- **Badges** de messages non lus sur toutes les icônes de messagerie
- Interface orange et épurée, pensée pour être accessible

---

## Tester l'application

### Prérequis
- [Node.js](https://nodejs.org) installé

### Lancement (version web)
```bash
npm install
npx expo start --web
```
L'application s'ouvre dans le navigateur. Toutes les fonctionnalités sont disponibles sauf les notifications push (nécessitent un build natif).

> Une version mobile native (iOS / Android) est prévue via EAS Build.

### Comptes de démonstration

| Identifiant | Mot de passe | Rôle |
|---|---|---|
| ADMIN | admin123 | Responsable ADJ |
| MOREAU | equip123 | Équipier |
| DUPONT | resident123 | Résident |

---

## Stack technique

| | |
|---|---|
| Framework | React Native 0.85 + Expo SDK 56 |
| Navigation | État React (`currentPage`) — sans librairie externe |
| Notifications | Expo Notifications + backend Express.js |
| Pièces jointes | Expo Image Picker, Expo Document Picker |
| Backend | Node.js / Express, stockage JSON |

---

## Structure du projet

```
├── App.js                  # État global, navigation, logique métier
├── screens/
│   ├── admin/              # 12 écrans — espace responsable
│   ├── equipier/           # 7 écrans — espace équipier
│   └── resident/           # 3 écrans — espace résident/famille
├── utils/
│   ├── notifications.js    # Push natif (Expo)
│   └── notifications.web.js
└── backend/                # API Express pour les notifications push
```

---

## Développement

Projet développé avec l'assistance de [Claude](https://claude.ai) (Anthropic) comme outil de développement accéléré. Conception, architecture et décisions produit par [Laura Heteau](https://github.com/7orage).
