cat > "PRD - MatrixGUT App (by Grok).md" << 'EOF'

# Product Requirements Document (PRD) for Matrix GUT App

## 1. Overview

### Product Name

Matrix GUT App

### Product Description

The Matrix GUT App is a web-based tool for prioritizing tasks, problems, or actions using the GUT matrix methodology (Gravidade - Gravity, Urgência - Urgency, Tendência - Tendency). Users can add items, assign scores from 1 to 5 for each criterion, calculate a priority score (G × U × T), and view a ranked list. It's designed for personal or team use in project management, quality control, or risk assessment. The app is a full-stack progressive web app (PWA) that works offline, installs on mobile/desktop, and persists data in a cloud database.

### Target Audience

- Individuals (e.g., freelancers, students) for personal task prioritization.
- Teams in small businesses or projects (e.g., IT, quality assurance, risk management).
- Beginners in programming who want a simple, functional app as a portfolio piece.

### Key Objectives

- Provide an intuitive interface for GUT prioritization without manual calculations.
- Ensure cross-platform accessibility (web, mobile via PWA, desktop shortcuts).
- Support data persistence and offline use for reliability.
- Keep the app lightweight, free to host, and easy to maintain/rebuild with AI tools.

### Business Goals

- Serve as a personal tool for the creator (unemployed developer learning programming).
- Potential for monetization (e.g., freemium model with premium features like teams/export).
- Easy to reconstruct with other AIs for experimentation or improvements.

### Assumptions and Constraints

- Built with free/open-source tools; no paid dependencies.
- Initial focus on core features; expansions (e.g., user auth) are optional.
- Deployment on free tiers (e.g., Railway, Vercel, Cloudflare Pages + D1) to avoid costs.
- User is beginner-level, so keep tech stack simple and documented.

## 2. Features

### Core Features

- **Add Task/Form**: Form to input task description, scores for G/U/T (1-5 dropdowns), auto-calculate score.
- **Task List/Ranking**: Table showing tasks with scores, sorted by priority (descending score). Edit/delete options.
- **Import Modal**: Modal for importing tasks (e.g., CSV/JSON).
- **Focus Mode**: Simplified view for focusing on top priorities.
- **Error Boundary**: Handle errors gracefully (e.g., network failures).
- **PWA Support**: Installable on Android/Linux, offline caching via service worker.

### Technical Features

- Data persistence with Drizzle ORM (SQLite local or Postgres cloud).
- Responsiveness via Tailwind CSS and mobile hooks.
- API endpoints for CRUD operations on tasks.

### Non-Functional Requirements

- Performance: Load in <2s, handle 100+ tasks without lag.
- Security: Basic (no auth yet; add if monetized).
- Accessibility: ARIA labels in Shadcn UI components.
- Scalability: Free tier limits (e.g., 1GB DB, low traffic).

## 3. User Stories

As a user, I want to:

- Add a task with description and G/U/T scores, so the score is calculated automatically.
- View a sorted list of tasks by priority, so I can focus on high-impact items.
- Edit or delete tasks, so I can update priorities.
- Import multiple tasks from file, so I can bulk-load data.
- Install as PWA on mobile, so I can use offline.
- Have error handling, so the app doesn't crash on failures.

## 4. Tech Stack

| Component  | Technology                                                                             | Reason                                                    |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Frontend   | React + TypeScript + Vite                                                              | Modern, fast build, type-safe.                            |
| Styling/UI | Tailwind CSS + Shadcn/UI                                                               | Responsive, pre-built components (forms, tables, modals). |
| Backend    | Node.js + Express                                                                      | Simple API for CRUD.                                      |
| Database   | Drizzle ORM + SQLite (local) or Postgres (cloud, e.g., Neon)                           | Lightweight ORM, easy migrations.                         |
| Hooks/Libs | React Query (for data fetching), use-mobile.tsx (responsiveness), gut.ts (score calc). | -                                                         |

### Deployment

- Railway (current), Vercel (static), or Cloudflare Pages + D1 (free forever).
- PWA: manifest.json + sw.ts (service worker for offline).

### File Structure (Key Files)

- **client/**: Frontend code.
  - src/App.tsx: Root component.
  - src/components/: add-task-form.tsx, task-list.tsx, import-modal.tsx, focus-mode.tsx.
  - src/lib/: gut.ts (calculation), queryClient.ts (data fetching config).
  - src/pages/: home.tsx (main page).
  - public/: manifest.json, icons.
- **server/**: Backend.
  - index.ts: Server entry (Express setup).
  - routes.ts: API routes (/api/tasks GET/POST/PUT/DELETE).
  - db.ts: DB connection (Drizzle).
- **shared/**: schema.ts (DB tables, e.g., tasks with id, description, g, u, t, score).
- **migrations/**: Drizzle migration files.
- Configs: vite.config.ts, tailwind.config.ts, drizzle.config.ts.

## 5. UI/UX Design

- **Layout**: Simple dashboard with form on top, table below. Responsive (mobile: stacked, desktop: side-by-side).
- **Colors**: Dark theme (#0f172a background, white text) via theme.json.
- **Components**: Shadcn for buttons, inputs, tables, modals — ensures accessibility.
- **Flow**: Load → Fetch tasks → Add/edit → Recalculate rank → Offline support.

## 6. Deployment and Hosting

- **Current**: Railway (fullstack Node, $5/mês após trial; migrate away).
- **Alternatives (Grátis Forever)**:
  - **Vercel**: Static frontend + serverless functions (rewrite backend to /api/\* files). Grátis para hobby (1GB banda/mês).
  - **Cloudflare Pages + D1**: Pages for frontend, Workers for backend, D1 for DB (SQLite cloud, grátis com limites: 100k reads/dia, banda ilimitada).
- Steps to Rebuild: Clone repo, npm install, run migrations, deploy per platform docs.

## 7. Testing

- Manual: Add tasks, check scores (e.g., G=5,U=5,T=5 → 125), rank descending, offline add.
- Tools: Lighthouse for PWA score, DevTools for API calls.

## 8. Risks and Mitigations

- Cost: Use free alternatives (Cyclic/Render for fullstack).
- Complexity: Keep core simple; add features iteratively.
- DB Migration: Run drizzle-kit migrate on deploy.

## 9. Timeline for Rebuild (with AI)

- Day 1: Setup repo/stack (prompt AI with this PRD).
- Day 2: Frontend features.
- Day 3: Backend/DB.
- Day 4: PWA/Deployment.
- Total: 4 days for full reconstruction.

Esse PRD é completo e auto-contido — use para promptar outras AIs (e.g., "Reconstrua esse app baseado nesse PRD"). Para monetização: Freemium (grátis com limite de 20 tasks, $2/mês para ilimitado/export/teams via Stripe). Comece com ads/Pix no app. Para Vercel/Cloudflare: Vercel se priorizar velocidade (mas reescreva backend), Cloudflare se quiser DB grátis (migre Drizzle para D1, simples). Qual você quer tentar primeiro?
EOF
