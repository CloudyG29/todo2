'use client';

import { useState } from 'react';
import type { TaskWithOverdue, SortField, Status } from '@/lib/tasks';
import { updateStatusAction, updateTaskAction, archiveTaskAction } from '../actions';
import { getTopicColor } from '@/lib/topicColor';
import { useRouter } from 'next/navigation';


const STATUSES: Status[] = ['todo', 'in-progress', 'complete'];

const STATUS_STYLES: Record<Status, string> = {
  todo: 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  complete: 'bg-emerald-100 text-emerald-700',
};

export default function TaskList({
  tasks,
  currentSort,
  showingArchived,
}: {
  tasks: TaskWithOverdue[];
  currentSort: SortField;
  showingArchived: boolean;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 font-mono text-xs">
        <div className="flex gap-2">
          {!showingArchived &&
            (['due_date', 'topic', 'status'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => router.push(`/?sort=${field}`)}
                className={`px-3 py-1.5 rounded-full uppercase tracking-wide transition-colors ${
                  currentSort === field
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {field.replace('_', ' ')}
              </button>
            ))}
        </div>
        <button
          onClick={() => router.push(showingArchived ? '/' : '/?archived=true')}
          className="text-indigo-500 uppercase tracking-wide hover:text-indigo-700 font-semibold"
        >
          {showingArchived ? '← active' : 'archived →'}
        </button>
      </div>

      {tasks.length === 0 && (
        <p className="text-sm text-slate-400 italic">
          {showingArchived ? 'Nothing archived yet.' : 'Nothing here. Add your first task above.'}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => {
          const color = getTopicColor(task.topic);
          return (
            <li
              key={task.id}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)] pl-5 pr-4 py-4 ${
                showingArchived ? 'opacity-60' : ''
              }`}
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${color.bar}`} />

              {editingId === task.id ? (
                <form
                  action={async (formData) => {
                    await updateTaskAction(task.id, formData);
                    setEditingId(null);
                  }}
                  className="flex flex-col gap-2"
                >
                  <input
                    name="title"
                    defaultValue={task.title}
                    required
                    className="font-semibold border-b border-slate-200 pb-1 focus:outline-none focus:border-indigo-400"
                  />
                  <textarea
                    name="description"
                    defaultValue={task.description ?? ''}
                    rows={2}
                    className="text-sm text-slate-500 resize-none focus:outline-none"
                  />
                  <div className="flex gap-2 font-mono text-xs">
                    <input
                      name="due_date"
                      type="date"
                      defaultValue={task.due_date}
                      required
                      className="border border-slate-200 rounded-lg px-2 py-1"
                    />
                    <input
                      name="topic"
                      defaultValue={task.topic}
                      required
                      className="border border-slate-200 rounded-lg px-2 py-1 flex-1"
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-slate-400 text-xs px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-[15px] font-semibold">{task.title}</strong>
                    {task.overdue && !showingArchived && (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-rose-600 bg-rose-50 px-2 py-1 rounded-full whitespace-nowrap">
                        overdue
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${color.chip}`}>
                      {task.topic}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">due {task.due_date}</span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-500 mt-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    {showingArchived ? (
                      <span className={`font-mono text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[task.status]}`}>
                        {task.status}
                      </span>
                    ) : (
                      <>
                        <select
                          value={task.status}
                          onChange={(e) => updateStatusAction(task.id, e.target.value as Status)}
                          className={`font-mono text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full border-0 cursor-pointer ${STATUS_STYLES[task.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingId(task.id)}
                          className="text-xs text-slate-400 hover:text-indigo-600 ml-1 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => archiveTaskAction(task.id)}
                          className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          Archive
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}