# FoodApp

A full-stack food ordering application with user authentication, meal browsing, shopping cart, and order management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Redux Toolkit 2, React Router 7, Tailwind CSS 4, Vite 7 |
| Backend | Express 4, PostgreSQL (pg), Zod 4, JWT, bcrypt |
| Language | TypeScript 5 (both frontend and backend) |
| Database | PostgreSQL 16 |
| DevOps | Docker, Docker Compose, Nginx |

## Project Structure

```
FoodApp/
├── backend/
│   ├── app.ts                         # Express server entry point
│   ├── schemas.ts                     # Zod validation schemas
│   ├── controllers/
│   │   ├── auth.middleware.ts          # JWT auth + admin middleware
│   │   └── validate.middleware.ts      # Zod validation middleware
│   ├── data/
│   │   └── test-db.ts                 # PostgreSQL connection pool
│   ├── db/
│   │   ├── runner.ts                  # Migration/seed orchestrator
│   │   ├── migrations/                # SQL migration files
│   │   └── seeds/                     # SQL + TS seed files
│   ├── routes/
│   │   ├── auth.ts                    # Register, login, logout, user
│   │   ├── cart.ts                    # Get, add, remove cart items
│   │   ├── meals.ts                   # Get all, update meal (admin)
│   │   └── orders.ts                  # Get all, create order
│   ├── types/
│   │   └── index.ts                   # DB row types, JWT types
│   ├── public/images/                 # Meal images
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/                # React components (TSX + Tailwind)
│   │   ├── hooks/                     # Custom hooks (useToken, useFetchUser, useFetchCart)
│   │   ├── redux-store/               # Redux slices (user, meals, cart)
│   │   ├── types/                     # Frontend TypeScript types
│   │   ├── config.ts                  # API URL configuration
│   │   ├── http.ts                    # API fetch functions
│   │   └── main.tsx                   # App entry point
│   ├── nginx.conf                     # Production nginx config
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── package.json                       # Root scripts (dev, install, build)
```

## Quick Start with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run

```bash
git clone <repo-url> && cd FoodApp
docker compose up --build
```

That's it. The database is created, migrated, and seeded automatically.

### Access

| Service | URL | Description |
|---------|-----|-------------|
| App | http://localhost | Frontend (React + Nginx) |
| API | http://localhost:3000 | Backend (Express) |
| pgAdmin | http://localhost:8080 | Database admin UI |

### pgAdmin Setup (first time only)

1. Go to http://localhost:8080
2. Login: `admin@admin.com` / `admin`
3. Right-click **Servers** > **Register** > **Server**
4. **General tab** — Name: `FoodApp`
5. **Connection tab**:
   - Host: `postgres`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

### Docker Commands

```bash
# Start all services
docker compose up --build

# Stop all services
docker compose down

# Stop and wipe database + pgAdmin data (full reset)
docker compose down -v
```

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [PostgreSQL](https://www.postgresql.org/download/) 16+

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE \"test-yourself\";"
```

### 2. Configure environment variables

Create `backend/.env`:

```env
JWT_SECRET=dev_secret
DB_PASSWORD=your_postgres_password
```

### 3. Install dependencies

```bash
npm install
npm run install:all
```

### 4. Run migrations and seeds

```bash
cd backend
npm run db:setup
```

### 5. Start development servers

```bash
# From root — starts both backend and frontend
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| User | `test@user.com` | `password123` |
| Admin | `test@admin.com` | `password123` |

Admin users can update meal details (name, price, description) via the "Update Meal" button on each meal card.

## Available Scripts

### Root

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start backend + frontend concurrently |
| `dev:backend` | `npm run dev:backend` | Start backend only |
| `dev:frontend` | `npm run dev:frontend` | Start frontend only |
| `install:all` | `npm run install:all` | Install deps for backend + frontend |
| `build` | `npm run build` | Build frontend for production |

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start with nodemon (hot reload) |
| `build` | `npm run build` | Compile TypeScript to dist/ |
| `start` | `npm run start` | Run compiled JS from dist/ |
| `typecheck` | `npm run typecheck` | Type-check without emitting |
| `db:setup` | `npm run db:setup` | Create tables + seed data |
| `db:reset` | `npm run db:reset` | Drop all tables, recreate + reseed |
| `migrate` | `npm run migrate` | Run migrations only |
| `seed` | `npm run seed` | Run seeds only |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite dev server |
| `build` | `npm run build` | Production build |
| `preview` | `npm run preview` | Preview production build locally |
| `typecheck` | `npm run typecheck` | Type-check without emitting |
| `lint` | `npm run lint` | Run ESLint |

