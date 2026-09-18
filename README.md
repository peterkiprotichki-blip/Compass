# Compass — Guidance Platform for African Entrepreneurs

> **Guidance today. Brighter tomorrows.**  
> *Ideas to Impact.*

Compass is an end-to-end guidance platform for African entrepreneurs. It turns a person's strengths, capital, location, time, and goals into a clear business direction and a practical set of next steps.

---

## 🧭 The Products

1. **Business Pathfinder (v1)**
   - Answers: *"What business should I start?"*, *"I have some money — what should I do with it?"*, *"What business actually fits me?"*, *"How should I spend my startup capital?"*
   - A canonical **22-question assessment** (plus 1 optional passion closer) evaluated by 5 engines:
     - **Strength Engine**: 15 strengths normalized to 0–100 against theoretical maximums.
     - **Entrepreneur Archetype Engine**: 6 archetypes (*The Seller, The Builder, The Creator, The Teacher, The Operator, The Problem Solver*) calculated via weighted formulas + online visibility modifier.
     - **Risk Profile**: Conservative, Moderate, Aggressive.
     - **Business Readiness Score**: 5 pillars (*Capital, Time, Goal clarity, Opportunity awareness, Strength alignment*) scoring out of 100 with clear verdicts.
     - **Matching Engine**: Intelligently scores user profile against a database of **30+ African business models** across 10 categories.
   - Provides Top 3 recommendations with startup budgets in KES, advantage, risk, concrete first step, and a **30-Day Launch Roadmap**.

2. **Business Compass (Grow My Business v1)**
   - An intake diagnostic for existing business owners capturing business type, operating age, monthly sales range, and primary bottleneck, returning actionable margin and cash-flow playbooks.

---

## 🏗️ Monorepo Architecture

```
Compass/
├── backend/                       # NestJS API & Calculation Engine
│   ├── src/
│   │   ├── database/schemas/      # Mongoose schemas (User, Business, Assessment, Result, Journey, GrowIntake)
│   │   ├── modules/
│   │   │   ├── engine/            # ScoringService & canonical 22 questions data
│   │   │   ├── seed/              # Database seeder (30+ African businesses across 10 categories)
│   │   │   ├── businesses/        # Business catalog API
│   │   │   ├── assessment/        # Assessment submission & scoring endpoints
│   │   │   ├── journeys/          # Active 30-day journeys & checkable milestones
│   │   │   ├── growth/            # Business Compass intake & diagnostics
│   │   │   └── auth/              # JWT auth, profile, and saved business paths
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── data/db/                   # Local MongoDB data directory
│   ├── package.json
│   └── tsconfig.json
├── frontend/                      # Angular (v19+) with Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # LanguageService (EN/SW), ApiService, AuthService
│   │   │   ├── models/            # TypeScript interfaces
│   │   │   ├── shared/components/ # Navbar, Footer, ScoreRing, MatchCard, OptionRow, ProgressBar, WeekBlock
│   │   │   └── pages/
│   │   │       ├── landing/       # Marketing site (Hero, proof stats, value strip, journey cards, preview)
│   │   │       ├── pathfinder/    # Splash -> Language -> Journey Choice -> 22 Questions -> Loading -> Results
│   │   │       ├── business-detail/ # Full business dossier, budget in KES, risks, 30-day roadmap
│   │   │       ├── journey-tracker/ # Checkable weekly tasks with progress percentage
│   │   │       ├── grow-business/ # Business Compass diagnostic intake
│   │   │       ├── learn/         # African entrepreneur playbooks & guides
│   │   │       ├── pricing/       # KES 499 launch price & feature tiers
│   │   │       └── profile/       # Saved paths and active user journeys
│   │   ├── assets/brand/          # Compass marks and logo lockups
│   │   ├── styles.css             # Tailwind CSS tokens & Google Fonts
│   │   └── index.html
│   ├── tailwind.config.js
│   ├── angular.json
│   └── package.json
├── package.json                   # Root workspace orchestration scripts
└── README.md
```

---

## 🎨 Brand System & Design Tokens

- **Core Palette**:
  - `Deep Forest`: `#0B2E24` (Primary brand surface, hero, cards on light, footer)
  - `Charcoal`: `#111827` (Body text on light surfaces, headings, form text)
  - `Gold`: `#D4A017` (Primary action CTAs, needle, active states, score gauge)
  - `Ivory`: `#F9F7EF` (Light background, reading surface)
  - Extended: `forest-deep` (`#071C16`), `forest-line` (`#1D4438`), `ivory-sunk` (`#F1EEE3`), `gold-soft` (`#E8B94A`), `success` (`#3E9E6E`), `risk` (`#C2603A`).
- **Typography**:
  - `Playfair Display`: Display headlines, archetype names, quotes, data/scores.
  - `Inter`: Clean body text, UI labels, buttons, question rows.
- **Bilingual Experience**:
  - English and Kiswahili (`EN` / `SW`) selectable across the entire experience.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v25)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string.

### 2. Run Locally

#### Step A: Start Local MongoDB
If running locally with the bundled MongoDB server:
```powershell
npm run start:db
```
*(Or specify your live connection string in `backend/.env`: `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/compass`)*

#### Step B: Start Backend (NestJS)
```powershell
cd backend
npm run start:dev
```
The backend starts at `http://localhost:3000/api` and automatically seeds the 30+ African businesses into MongoDB.

#### Step C: Start Frontend (Angular)
In another terminal:
```powershell
cd frontend
npm run start
```
Open `http://localhost:4200` in your browser.

---

## 🌐 Live Cloud / MongoDB Atlas Deployment
To transition from local to live:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Set the environment variable in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/compass?retryWrites=true&w=majority
   JWT_SECRET=your_production_secret_key
   PORT=3000
   ```
3. Build the applications for production:
   ```powershell
   npm run build
   ```
