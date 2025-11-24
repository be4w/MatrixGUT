# ADHD Task Manager

## Overview

This is a GUT (Gravity-Urgency-Tendency) prioritization task management application specifically designed for individuals with ADHD. The app helps users organize and focus on their tasks by automatically calculating and sorting tasks based on three criteria: Gravity (seriousness), Urgency (time sensitivity), and Tendency (likelihood of worsening). Tasks are ranked by their total priority score (G × U × T), with features like focus mode, label filtering, and task completion tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool.

**Routing**: Wouter for lightweight client-side routing.

**State Management**: TanStack Query (React Query) for server state management with aggressive caching (staleTime: Infinity) to reduce unnecessary refetches.

**UI Components**: Radix UI primitives with custom styled components following the shadcn/ui pattern. Uses Tailwind CSS for styling with a custom theme system that supports light/dark modes and configurable color schemes.

**Progressive Web App (PWA)**: Configured with service worker support using Workbox for offline functionality, asset precaching, and API response caching with stale-while-revalidate strategy.

**Key Design Patterns**:
- Component composition with Radix UI primitives for accessibility
- Custom hooks for reusable logic (useToast, useIsMobile)
- Error boundaries for graceful error handling
- Form validation using React Hook Form with Zod schema validation

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with endpoints for CRUD operations on tasks:
- GET `/api/tasks` - Retrieve all tasks
- POST `/api/tasks` - Create new task
- PATCH `/api/tasks/:id` - Update existing task
- DELETE `/api/tasks/:id` - Delete task

**Middleware**: JSON body parsing, URL encoding, request logging with duration tracking for API calls.

**Error Handling**: Centralized error handling middleware that normalizes errors and returns consistent JSON responses.

**Development vs Production**: Vite middleware integrated in development mode for hot module replacement; static file serving in production with pre-built assets.

### Data Storage

**Database**: PostgreSQL accessed via Neon's serverless driver with WebSocket connections.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design**: Single `tasks` table with columns:
- id (serial primary key)
- name (text, required)
- gravity, urgency, tendency (integers 1-5, required)
- completed (boolean, defaults to false)
- sensitive (boolean, defaults to false - for privacy feature)
- labels (text array, optional)
- notes (text, optional)

**Migrations**: Drizzle Kit manages schema migrations with output directory `./migrations`.

**Fallback Storage**: In-memory storage implementation (`MemStorage`) available for development/testing without database dependency.

### Authentication and Authorization

Not currently implemented. The application appears designed for single-user or trusted environment use. All API endpoints are publicly accessible.

### Task Prioritization Logic

**GUT Matrix Implementation**: Priority score calculated as Gravity × Urgency × Tendency (range: 1-125).

**Criteria Definitions**:
- Gravity: Seriousness/impact (1="No apparent gravity" to 5="Extremely grave")
- Urgency: Time sensitivity (1="No hurry" to 5="Requires immediate action")
- Tendency: Likelihood of worsening (1="Will not worsen" to 5="Will worsen rapidly")

**Sorting Strategy**: Client-side sorting in descending order by priority score before rendering.

### Special Features

**Focus Mode**: Displays only the highest priority active task to reduce cognitive overload for ADHD users.

**Sensitive Tasks**: Tasks ending with "hhhh" (case-insensitive) are automatically marked as sensitive. These tasks can be hidden/shown via toggle for privacy.

**Label Filtering**: Optional tags for categorization with client-side filtering capability.

**Offline Support**: Service worker caches API responses and static assets for offline functionality.

## External Dependencies

### Core Technologies
- **Node.js Runtime**: ES modules with TypeScript compilation
- **PostgreSQL Database**: Via Neon serverless platform (@neondatabase/serverless)
- **Drizzle ORM**: Database toolkit with Zod integration for type-safe queries

### Frontend Libraries
- **React 18**: UI rendering with concurrent features
- **Vite**: Build tool and development server
- **TanStack Query v5**: Server state management
- **Wouter**: Lightweight routing
- **React Hook Form**: Form handling with Zod validation
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives (30+ components)
- **Workbox**: Service worker and PWA utilities

### Backend Libraries
- **Express.js**: Web server framework
- **ws**: WebSocket support for Neon database connections

### Development Tools
- **TypeScript**: Type safety across full stack
- **ESBuild**: Production bundling for server code
- **TSX**: TypeScript execution for development
- **PostCSS**: CSS processing with Autoprefixer

### Replit-Specific Integration
- **@replit/vite-plugin-shadcn-theme-json**: Theme configuration from JSON
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling (conditional)

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting requiring DATABASE_URL environment variable