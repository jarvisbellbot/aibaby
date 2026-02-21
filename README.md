# Ember 🔥👶

> Every love story deserves a chapter.

Upload a photo → AI generates your baby → raise it together.

## What It Does

- **AI Baby Generation** — Upload photos, get a realistic AI baby via Replicate
- **Solo or Partner Mode** — Raise alone or sync with someone via invite code
- **Baby Care Mechanics** — Feed, change diapers, play (with cooldowns)
- **Real-time Sync** — Both partners see updates live via Supabase
- **Leaderboard** — Who's the better parent this week?
- **Social Sharing** — Share your baby to Instagram, TikTok, SMS

## Tech Stack

| Layer | Tech |
|-------|------|
| App | Expo (React Native) |
| Backend | Supabase (PostgreSQL + Real-time) |
| AI | Replicate API (Stable Diffusion) |
| Auth | Supabase OAuth (Google + Apple + Email) |
| Payments | Stripe ($3/month) |

## Project Structure

```
ember/
├── App.tsx                    # Root component
├── src/
│   ├── components/
│   │   ├── baby/              # BabyAvatar, HappinessMeter, ActionButton
│   │   ├── shared/            # LoadingOverlay
│   │   └── ui/                # Button, Card, Input, Badge
│   ├── context/
│   │   └── AuthContext.tsx    # Global auth state
│   ├── lib/
│   │   ├── auth.ts            # Google/Apple/Email auth
│   │   ├── baby-engine.ts     # Core game logic
│   │   ├── replicate.ts       # AI baby generation
│   │   ├── stripe.ts          # Payments
│   │   └── supabase.ts        # DB client + real-time
│   ├── navigation/
│   │   └── index.tsx          # Stack + Tab navigators
│   ├── screens/
│   │   ├── auth/              # AuthScreen
│   │   ├── onboarding/        # Welcome → Mode → Photo → Generate → Reveal → Name → Tutorial
│   │   └── tabs/              # Home, Leaderboard, Profile
│   ├── theme/                 # Colors, typography, spacing
│   ├── types/                 # TypeScript definitions
│   └── constants/             # Game constants + copy
└── supabase/
    └── migrations/            # Database schema
```

## Quick Start

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in keys
4. Run DB migrations in Supabase dashboard
5. `npx expo start`

## Environment Variables

```
SUPABASE_URL=your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
REPLICATE_API_TOKEN=your-replicate-token
STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

## GitHub

[github.com/jarvisbellbot/aibaby](https://github.com/jarvisbellbot/aibaby)

---

Built by Polár 🐻‍❄️ for Joshua Bell
