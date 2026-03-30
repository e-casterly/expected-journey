# Expected Journey

A web application for planning journeys, discovering places, and keeping travel memories.

Built with Next.js, MapLibre, PostgreSQL, and Drizzle ORM.

## Requirements

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for the database)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

### 3. Start the database

Starts a PostgreSQL container in the background:

```bash
pnpm db:start
```

### 4. Run migrations

Applies all pending database migrations:

```bash
pnpm db:migrate
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Commands

### Development

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server with hot reload |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server (requires `build` first) |
| `pnpm lint` | Run ESLint to check for code issues |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without making changes |

### Database

| Command | Description |
|---|---|
| `pnpm db:start` | Start the PostgreSQL container via Docker Compose |
| `pnpm db:generate` | Generate a new migration file based on schema changes |
| `pnpm db:migrate` | Apply pending migrations to the database |
| `pnpm db:studio` | Open Drizzle Studio — a visual database browser |

### Tools

| Command | Description |
|---|---|
| `pnpm storybook` | Start Storybook component explorer on port 6006 |
| `pnpm build-storybook` | Build a static Storybook for deployment |
| `pnpm icons:generate` | Generate React components from SVG files in `src/svgs/` |
| `pnpm maputnik` | Start Maputnik map style editor on port 8888 |

---

## Database

The project uses PostgreSQL 17 running in Docker. Connection settings are defined in `docker-compose.yml`

To view and edit data visually, run `pnpm db:studio`

## Tech Stack

- **[Next.js](https://nextjs.org/)** — React framework with App Router
- **[MapLibre GL](https://maplibre.org/)** — open-source map rendering
- **[Drizzle ORM](https://orm.drizzle.team/)** — TypeScript ORM for PostgreSQL
- **[Better Auth](https://better-auth.com/)** — authentication
- **[TanStack Query](https://tanstack.com/query)** — server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** — client state management
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling