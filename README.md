# Todo App

A local-first todo application built with Next.js and SQLite. Runs entirely
on your own machine — no accounts, no deployment, no server beyond your own
laptop.

## Features

- Create, edit, and archive tasks (title, description, due date, topic)
- Tasks are never deleted, only archived, and remain viewable afterward
- List view sortable by topic, status, or due date
- Fixed statuses: Todo, In-Progress, Complete
- Overdue tasks are visibly flagged — overdue is not a selectable status,
  it's derived automatically from the due date
- All data persists across restarts

## Quick start

```bash
git clone https://github.com/CloudyG29/todo2.git
cd todo2
npm install
npm run dev
```

Open `http://localhost:3000`.

**Requires Node.js v22.11.0.** Do not run from inside a OneDrive (or other
cloud-sync) folder — see [`docs/running-it.md`](docs/running-it.md) for why.

## Documentation

- [`docs/third-party-code.md`](docs/third-party-code.md) — dependencies and
  why each was chosen
- [`docs/database-design.md`](docs/database-design.md) — schema and design
  decisions
- [`docs/running-it.md`](docs/running-it.md) — full install, run, and test
  instructions

## Testing

```bash
npm test
```

Tests use an in-memory SQLite database and don't touch your local data.