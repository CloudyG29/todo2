import { getDb } from '@/lib/db';
import { listTasks, type SortField } from '@/lib/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; archived?: string }>;
}) {
  const { sort, archived } = await searchParams;
  const sortBy = (sort as SortField) || 'due_date';
  const showArchived = archived === 'true';

  const db = getDb();
  const tasks = listTasks(db, { sortBy, includeArchived: showArchived });
  const visibleTasks = showArchived ? tasks.filter((t) => t.archived_at !== null) : tasks;

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-indigo-500/70 mb-1 font-semibold">
          coursework tracker
        </p>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
          Todo
        </h1>
      </header>
      {!showArchived && <TaskForm />}
      <TaskList tasks={visibleTasks} currentSort={sortBy} showingArchived={showArchived} />
    </main>
  );
}