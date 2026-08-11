
import { makeTestDb } from './setup';
import { createTask, updateTask, archiveTask, isOverdue, listTasks } from '../lib/tasks';

describe('overdue derivation', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('flags a task whose due date has passed and is not complete', () => {
    const task = createTask(db, {
      title: 'Late thing',
      due_date: '2020-01-01T00:00:00Z',
      topic: 'Uni',
    });
    expect(isOverdue(task)).toBe(true);
  });

  it('does not flag a task due in the future', () => {
    const task = createTask(db, {
      title: 'Future thing',
      due_date: '2099-01-01T00:00:00Z',
      topic: 'Uni',
    });
    expect(isOverdue(task)).toBe(false);
  });

  it('does not flag a completed task even if the due date has passed', () => {
    const task = createTask(db, {
      title: 'Done late',
      due_date: '2020-01-01T00:00:00Z',
      topic: 'Uni',
    });
    const updated = updateTask(db, task.id, { status: 'complete' });
    expect(isOverdue(updated)).toBe(false);
  });

  it('does not flag an archived task even if the due date has passed', () => {
    const task = createTask(db, {
      title: 'Archived late',
      due_date: '2020-01-01T00:00:00Z',
      topic: 'Uni',
    });
    const archived = archiveTask(db, task.id);
    expect(isOverdue(archived)).toBe(false);
  });

  it('reflects overdue status in listTasks output, not as a stored status value', () => {
    createTask(db, { title: 'Late thing', due_date: '2020-01-01T00:00:00Z', topic: 'Uni' });
    const [task] = listTasks(db);
    expect(task.overdue).toBe(true);
    expect(['todo', 'in-progress', 'complete']).toContain(task.status);
  });
});