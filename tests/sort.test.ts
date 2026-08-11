import { makeTestDb } from './setup';
import { createTask, listTasks, updateTask } from '../lib/tasks';

describe('sorting', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
    createTask(db, { title: 'C task', due_date: '2026-03-01', topic: 'Zoology' });
    createTask(db, { title: 'A task', due_date: '2026-01-01', topic: 'Anatomy' });
    createTask(db, { title: 'B task', due_date: '2026-02-01', topic: 'Maths' });
  });

  afterEach(() => {
    db.close();
  });

  it('sorts by topic ascending', () => {
    const tasks = listTasks(db, { sortBy: 'topic' });
    expect(tasks.map((t) => t.topic)).toEqual(['Anatomy', 'Maths', 'Zoology']);
  });

  it('sorts by due_date ascending', () => {
    const tasks = listTasks(db, { sortBy: 'due_date' });
    expect(tasks.map((t) => t.due_date)).toEqual(['2026-01-01', '2026-02-01', '2026-03-01']);
  });

  it('sorts by status ascending', () => {
    const all = listTasks(db);
    updateTask(db, all[0].id, { status: 'complete' });
    const tasks = listTasks(db, { sortBy: 'status' });
    expect(tasks[0].status).toBe('complete');
  });

  it('throws on an invalid sort field', () => {
    expect(() => listTasks(db, { sortBy: 'nonsense' as any })).toThrow();
  });
});