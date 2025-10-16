# CONTEXTE - MoodFlow+ Frontend

## 📋 Projet : Hackathon M1 Ynov Montpellier

**Sujet** : MoodFlow+ - Journal d'humeur intelligent, sécurisé et connecté

**Date de création** : 16 octobre 2025

**Objectif** : Créer une application web permettant aux utilisateurs de suivre leur humeur au quotidien, analyser les tendances, et gérer leurs données de manière sécurisée.

---

## 🛠️ Stack Technique

### Frontend
- **Vue.js 3** (Composition API avec `<script setup>`)
- **TypeScript** (avec types stricts désactivés temporairement pour le hackathon)
- **Vite** (build tool)
- **Tailwind CSS v3** (framework CSS)
- **Vue Router 4** (gestion des routes)
- **Axios** (requêtes HTTP)
- **Chart.js + vue-chartjs** (visualisations de données)

### Backend (à développer par l'équipe)
- **Symfony** (API REST)
- **MySQL** (base de données sur Docker : `2ta-db:3306`)
- **JWT** (authentification)
- **CORS** configuré avec `nelmio/cors-bundle`

### Configuration
- **Frontend** : `http://localhost:5175` (Vite)
- **Backend API** : `http://localhost:8080/api` (Symfony)
- **Base de données** : `mysql://root:root@2ta-db:3306/app`

---

## 📁 Architecture de l'Application

```
src/
├── components/
│   ├── MoodSelector.vue       # Sélecteur d'humeur (5 options avec emojis)
│   ├── WeekView.vue           # Vue hebdomadaire des humeurs
│   ├── MoodChart.vue          # Graphiques statistiques (camembert + barres)
│   └── ThemeToggle.vue        # Toggle thème sombre/clair
│
├── views/
│   ├── LoginView.vue          # Page de connexion
│   ├── RegisterView.vue       # Page d'inscription
│   └── DashboardView.vue      # Dashboard principal (protégé)
│
├── composables/
│   ├── useAuth.ts             # Gestion authentification (login, register, logout)
│   ├── useMoodData.ts         # Gestion des données d'humeur (CRUD)
│   └── useTheme.ts            # Gestion du thème clair/sombre
│
├── services/
│   └── api.ts                 # Service API avec intercepteurs JWT
│
├── types/
│   ├── auth.ts                # Types User, LoginCredentials, RegisterData
│   └── mood.ts                # Types MoodEntry, MoodStats, MoodType
│
├── router/
│   └── index.ts               # Configuration routes + guards
│
├── App.vue                    # Composant racine avec router-view
├── main.ts                    # Point d'entrée
└── style.css                  # Styles Tailwind + animations
```

---

## ✅ Fonctionnalités Implémentées

### 🔐 Authentification (5 écrans)
- **Page de connexion** (`/login`)
  - Formulaire email + mot de passe
  - Validation côté client
  - Redirection vers dashboard après login
  - Affichage des erreurs

- **Page d'inscription** (`/register`)
  - Formulaire username, email, mot de passe + confirmation
  - Validation (min 6 caractères, correspondance des mots de passe)
  - Création automatique du compte

- **Protection des routes**
  - Routes publiques : `/login`, `/register`
  - Routes protégées : `/dashboard` (nécessite authentification)
  - Redirection automatique si non connecté
  - Navigation guard dans `router/index.ts`

- **Gestion des tokens JWT**
  - Token stocké dans localStorage
  - Injection automatique dans toutes les requêtes (header `Authorization: Bearer {token}`)
  - Déconnexion automatique si token invalide (401)
  - Intercepteurs Axios configurés

### 📊 Dashboard & Humeurs (obligatoire - 5 points)

1. **Interface principale** (1 pt)
   - Vue hebdomadaire avec 7 jours
   - Design responsive et moderne
   - Gradients purple/pink
   - Dark mode automatique

2. **Ajout/édition d'humeur** (1 pt)
   - 5 options : 😄 (Très content), 🙂 (Bien), 😐 (Neutre), 😢 (Triste), 😠 (En colère)
   - Possibilité d'ajouter une note (optionnel)
   - Modification des entrées existantes
   - Feedback visuel (messages de succès/erreur)

3. **Persistance des données** (1 pt)
   - **IMPORTANT** : Plus de localStorage, uniquement API Symfony
   - Les données sont sauvegardées via requêtes HTTP
   - Rechargement automatique après modification

4. **Visualisations** (1 pt)
   - Graphique en camembert (distribution des humeurs)
   - Graphique en barres (fréquence par humeur)
   - Statistiques : nombre d'entrées, tendance, humeur dominante
   - Calcul de la tendance hebdomadaire (hausse/baisse/stable)

5. **UX soignée** (1 pt)
   - Animations fluides (fade-in, slide-up, expand)
   - Transitions entre les pages
   - Hover effects sur les boutons
   - Messages de feedback clairs
   - Couleurs cohérentes par humeur

### 🎁 Fonctionnalités Bonus
- ✅ **Thème sombre/clair automatique** - Toggle avec détection préférences système
- ✅ **Animations fluides** - Transitions CSS personnalisées
- ✅ **Design moderne** - Gradients, shadows, rounded corners
- ✅ **Responsive** - Mobile, tablette, desktop
- ✅ **Avatar utilisateur** - Initiale du username dans un cercle
- ✅ **Barre utilisateur** - Info user + bouton déconnexion

---

## 🔌 API Backend Attendue (Symfony)

### Endpoints d'authentification
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "token": "jwt-token", "user": { "id": 1, "email": "...", "username": "..." } }

POST /api/auth/register
Body: { "username": "john_doe", "email": "john@example.com", "password": "password123" }
Response: { "token": "jwt-token", "user": { "id": 1, "email": "...", "username": "..." } }
```

### Endpoints des humeurs (nécessitent authentification)
```
GET /api/moods
Query params: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: [{ "id": 1, "date": "2025-10-16", "mood": "happy", "note": "...", ... }]

GET /api/moods/{date}
Response: { "id": 1, "date": "2025-10-16", "mood": "happy", "note": "...", ... }

POST /api/moods
Body: { "date": "2025-10-16", "mood": "happy", "note": "Journée géniale!" }
Response: { "id": 1, "date": "2025-10-16", "mood": "happy", ... }

PUT /api/moods/{id}
Body: { "mood": "good", "note": "Finalement c'était bien" }
Response: { "id": 1, "date": "2025-10-16", "mood": "good", ... }

DELETE /api/moods/{id}
Response: 204 No Content

GET /api/moods/stats
Query params: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: {
  "averageMood": 3.5,
  "mostFrequentMood": "happy",
  "totalEntries": 15,
  "weekTrend": "up",
  "moodDistribution": { "happy": 5, "good": 3, "neutral": 2, "sad": 3, "angry": 2 }
}
```

### Types de données

#### MoodType
```typescript
type MoodType = 'happy' | 'good' | 'neutral' | 'sad' | 'angry'
```

#### MoodEntry
```typescript
interface MoodEntry {
  id?: number
  date: string          // Format: YYYY-MM-DD
  mood: MoodType
  note?: string
  intensity?: number    // 1-5 (optionnel, non utilisé actuellement)
  createdAt?: string
  updatedAt?: string
}
```

#### User
```typescript
interface User {
  id: number
  email: string
  username: string
  createdAt?: string
}
```

---

## ⚙️ Configuration CORS (Symfony)

Le backend doit autoriser les requêtes depuis le frontend :

**`config/packages/nelmio_cors.yaml`** :
```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173']
        allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
        allow_headers: ['Content-Type', 'Authorization']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/api':
            allow_origin: ['*']
            allow_headers: ['*']
            allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
            max_age: 3600
```

---

## 🔑 Variables d'Environnement

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8080/api
VITE_WEATHER_API_KEY=  # Optionnel pour bonus météo
```

**IMPORTANT** : Le fichier `.env` est dans `.gitignore` et ne doit pas être commité.
Un fichier `.env.example` est fourni comme template.

### Backend Symfony (`.env`)
```env
APP_ENV=dev
APP_SECRET=ba7202e00a1ddaf44b377a68f79de124
DATABASE_URL="mysql://root:root@2ta-db:3306/app"
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
```

---

## 🎨 Palette de Couleurs

### Couleurs des humeurs
- **Happy (Très content)** : `#FFD93D` (jaune)
- **Good (Bien)** : `#6BCB77` (vert)
- **Neutral (Neutre)** : `#4D96FF` (bleu)
- **Sad (Triste)** : `#9B9B9B` (gris)
- **Angry (En colère)** : `#FF6B6B` (rouge)

### Gradients
- Primary : `from-purple-600 to-pink-600`
- Background : `from-purple-50 to-pink-50` (light) / `from-gray-900 to-gray-800` (dark)

---

## 🚀 Commandes Utiles

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
# L'app sera sur http://localhost:5175
```

### Build Production
```bash
npm run build
# Les fichiers seront dans dist/
```

### Preview Production
```bash
npm run preview
```

---

## 📝 Points Importants

### ✅ Ce qui est fait
1. Architecture complète du frontend
2. Système d'authentification avec JWT
3. Dashboard avec gestion des humeurs
4. Visualisations statistiques (graphiques)
5. Dark mode fonctionnel
6. Design responsive
7. Toutes les fonctionnalités obligatoires (5 points)
8. Plusieurs fonctionnalités bonus
9. Configuration API prête pour Symfony
10. Plus de localStorage, uniquement API

### ⚠️ Ce qui reste à faire (équipe backend)
1. Créer les entités User et Mood dans Symfony
2. Implémenter les endpoints API
3. Configurer JWT pour l'authentification
4. Configurer CORS correctement
5. Tester l'intégration frontend-backend

### 🔍 Notes Techniques
- **TypeScript strict désactivé** temporairement pour accélérer le développement du hackathon
- **Tailwind v3** utilisé (v4 posait des problèmes de compilation)
- **Router guards** : protection automatique des routes
- **Axios interceptors** : gestion automatique du JWT et des erreurs 401
- **Animations CSS** : `fadeIn`, `slideUp`, `expand` pour une UX fluide

---

## 🎯 Prochaines Étapes

### Pour le frontend
1. Implémenter les bonus restants :
   - Corrélation météo/humeur (API OpenWeather)
   - Vue calendaire mensuelle
   - Export des données (CSV/PDF)
   - Citations motivantes selon l'humeur
   - Notifications quotidiennes

2. Améliorer l'UX :
   - Loading skeletons
   - Messages d'erreur plus détaillés
   - Animations supplémentaires

3. Tests :
   - Tester avec le backend une fois prêt
   - Corriger les éventuels bugs

### Pour l'équipe globale
1. **Backend** : Développer l'API Symfony
2. **Data** : Implémenter les analyses avancées (prédictions, corrélations)
3. **Infra** : Déployer l'application (Docker, Azure, AWS)
4. **Cyber** : Audit de sécurité, chiffrement des données sensibles

---

## 📞 Contact & Documentation

**Documentation Tailwind CSS** : https://tailwindcss.com/docs
**Documentation Vue Router** : https://router.vuejs.org/
**Documentation Chart.js** : https://www.chartjs.org/docs/

**Repository Git** : [À compléter avec le lien]

---

## 🏆 Critères d'Évaluation

### Fonctionnalités obligatoires (5 pts)
- ✅ Interface principale claire (1 pt)
- ✅ Ajout/édition d'humeur (1 pt)
- ✅ Persistance des données (1 pt)
- ✅ Visualisation analytique (1 pt)
- ✅ UX agréable (1 pt)

### Bonus (points illimités)
- ✅ Thème sombre/clair
- ✅ Animations fluides
- ✅ Design moderne
- ⏳ Météo/humeur
- ⏳ Vue mensuelle
- ⏳ Notifications

### Présentation (20 pts)
- Expression orale (4 pts)
- Structure du discours (4 pts)
- Contenu technique (6 pts)
- Support visuel (3 pts)
- Réponses aux questions (3 pts)

### Robustesse technique
- ⚠️ -1 pt par erreur visible
- ⚠️ -5 pts si crash total
- ⚠️ -2 pts si données non protégées

---

**Date de dernière mise à jour** : 16 octobre 2025
**Version** : 1.0
**Status** : Frontend complet, en attente du backend
