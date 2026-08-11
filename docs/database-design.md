# Database Design

## Tables

A single table, `tasks`, holds all task data. No other tables exist — there
is no user table, since the application has no accounts and serves exactly
one user per machine.

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'complete')) DEFAULT 'todo',
  archived_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Column decisions

- **`status`** is constrained with a `CHECK` clause to exactly the three
  fixed values the brief specifies (Todo, In-Progress, Complete). It is not
  user-customisable, and there is no separate statuses table, since the set
  is fixed and small.

- **`archived_at`** is a nullable timestamp, not a boolean flag and not a
  second table. `NULL` means the task is active; a timestamp means archived.
  This satisfies the requirement that a task is never deleted, only archived
  — the row is never removed, just marked. A timestamp was chosen over a
  boolean so the application could report *when* something was archived, at
  no extra schema cost over a boolean.

- **There is no `overdue` column.** Overdue status is derived at read time
  from `due_date`, `status`, and `archived_at` (see `lib/tasks.ts`, function
  `isOverdue`): a task is overdue if its due date has passed, its status is
  not `complete`, and it is not archived. Storing this as a column would let
  it drift out of sync with the fields it depends on every time the system
  clock advances, so it is always computed fresh rather than persisted.

- **`created_at` / `updated_at`** are included for basic auditability but are
  not required by the brief directly.

## Relationships

None — this is intentionally a single flat table. There was no need for
foreign keys, join tables, or normalisation beyond one row per task, since
topics are free-text labels rather than a separate managed entity.