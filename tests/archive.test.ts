import { makeTestDb } from './setup';
import { createTask, archiveTask, listTasks, getTaskById } from '../lib/tasks';

describe('archiving', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('removes an archived task from the default (active) list', () => {
    const task = createTask(db, { title: 'A', due_date: '2099-01-01', topic: 'Uni' });
    archiveTask(db, task.id);

    const active = listTasks(db);
    expect(active.find((t) => t.id === task.id)).toBeUndefined();
  });

  it('keeps the archived task viewable via getTaskById', () => {
    const task = createTask(db, { title: 'A', due_date: '2099-01-01', topic: 'Uni' });
    archiveTask(db, task.id);

    const fetched = getTaskById(db, task.id);
    expect(fetched).toBeDefined();
    expect(fetched?.archived_at).not.toBeNull();
  });

  it('keeps the archived task viewable via listTasks when includeArchived is true', () => {
    const task = createTask(db, { title: 'A', due_date: '2099-01-01', topic: 'Uni' });
    archiveTask(db, task.id);

    const all = listTasks(db, { includeArchived: true });
    expect(all.find((t) => t.id === task.id)).toBeDefined();
  });

  it('does not delete the row from the database', () => {
    const task = createTask(db, { title: 'A', due_date: '2099-01-01', topic: 'Uni' });
    archiveTask(db, task.id);

    const count = db.prepare('SELECT COUNT(*) as c FROM tasks').get() as { c: number };
    expect(count.c).toBe(1);
  });
});