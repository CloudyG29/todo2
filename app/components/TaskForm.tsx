'use client';

import { createTaskAction } from '../actions';
import { useRef } from 'react';

export default function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTaskAction(formData);
        formRef.current?.reset();
      }}
      className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(91,95,239,0.08)] p-6 mb-10 flex flex-col gap-3 border border-indigo-50"
    >
      <input
        name="title"
        placeholder="Title"
        required
        className="text-lg font-semibold placeholder:text-slate-300 focus:outline-none"
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        className="text-sm text-slate-500 resize-none focus:outline-none placeholder:text-slate-300"
      />
      <div className="flex gap-3 font-mono text-xs">
        <input
          name="due_date"
          type="date"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          name="topic"
          placeholder="topic"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <button
        type="submit"
        className="self-start bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:brightness-105 transition-all"
      >
        Add task
      </button>
    </form>
  );
}