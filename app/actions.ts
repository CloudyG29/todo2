'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { createTask, updateTask, archiveTask, type Status } from '@/lib/tasks';

export async function createTaskAction(formData: FormData) {
  const db = getDb();
  createTask(db, {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    due_date: formData.get('due_date') as string,
    topic: formData.get('topic') as string,
  });
  revalidatePath('/');
}

export async function updateStatusAction(id: number, status: Status) {
  const db = getDb();
  updateTask(db, id, { status });
  revalidatePath('/');
}

export async function updateTaskAction(id: number, formData: FormData) {
  const db = getDb();
  updateTask(db, id, {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    due_date: formData.get('due_date') as string,
    topic: formData.get('topic') as string,
  });
  revalidatePath('/');
}

export async function archiveTaskAction(id: number) {
  const db = getDb();
  archiveTask(db, id);
  revalidatePath('/');
}