import type Database from 'better-sqlite3';

export type Status = 'todo' | 'in-progress' | 'complete';
export type SortField = 'topic' | 'status' | 'due_date';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  topic: string;
  status: Status;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithOverdue extends Task {
  overdue: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date: string;
  topic: string;
}

export function createTask(db: Database.Database, input: CreateTaskInput): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (@title, @description, @due_date, @topic)
  `);
  const result = stmt.run({
    title: input.title,
    description: input.description ?? null,
    due_date: input.due_date,
    topic: input.topic,
  });
  return getTaskById(db, result.lastInsertRowid as number)!;
}

export function getTaskById(db: Database.Database, id: number): Task | undefined {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  due_date?: string;
  topic?: string;
  status?: Status;
}

export function updateTask(db: Database.Database, id: number, input: UpdateTaskInput): Task {
  const existing = getTaskById(db, id);
  if (!existing) throw new Error(`Task ${id} not found`);

  const merged = { ...existing, ...input };
  db.prepare(`
    UPDATE tasks
    SET title = @title, description = @description, due_date = @due_date,
        topic = @topic, status = @status, updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    title: merged.title,
    description: merged.description,
    due_date: merged.due_date,
    topic: merged.topic,
    status: merged.status,
  });

  return getTaskById(db, id)!;
}

export function archiveTask(db: Database.Database, id: number): Task {
  const existing = getTaskById(db, id);
  if (!existing) throw new Error(`Task ${id} not found`);

  db.prepare(`
    UPDATE tasks SET archived_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(id);

  return getTaskById(db, id)!;
}

export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.status === 'complete') return false;
  if (task.archived_at) return false;

  const dueEndOfDay = new Date(task.due_date);
  dueEndOfDay.setHours(23, 59, 59, 999);

  return dueEndOfDay < now;
}

function withOverdue(task: Task): TaskWithOverdue {
  return { ...task, overdue: isOverdue(task) };
}

export interface ListTasksOptions {
  sortBy?: SortField;
  includeArchived?: boolean;
}

export function listTasks(db: Database.Database, options: ListTasksOptions = {}): TaskWithOverdue[] {
  const { sortBy = 'due_date', includeArchived = false } = options;

  const validSortFields: SortField[] = ['topic', 'status', 'due_date'];
  if (!validSortFields.includes(sortBy)) {
    throw new Error(`Invalid sort field: ${sortBy}`);
  }

  const where = includeArchived ? '' : 'WHERE archived_at IS NULL';
  const rows = db.prepare(`
    SELECT * FROM tasks
    ${where}
    ORDER BY ${sortBy} ASC
  `).all() as Task[];

  return rows.map(withOverdue);
}