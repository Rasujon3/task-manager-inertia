import { Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import tasks from '@/routes/tasks';
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskPriority, type TaskStatus } from '@/types/task';

type FormData = { title: string; description: string; status: TaskStatus; priority: TaskPriority; due_date: string };

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div className="grid gap-1">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function TaskForm({ task }: { task?: Task }) {
    const form = useForm<FormData>({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? 'pending',
        priority: task?.priority ?? 'medium',
        due_date: task?.due_date ?? '',
    });
    const field = 'w-full rounded border px-3 py-2';

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (task) {
            form.put(tasks.update(task.id).url, { preserveScroll: true });
        } else {
            form.post(tasks.store().url);
        }
    }

    return (
        <form onSubmit={submit} className="mt-6 grid max-w-xl gap-4">
            <Field label="Title" error={form.errors.title}>
                <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
            </Field>
            <Field label="Description" error={form.errors.description}>
                <textarea rows={4} className={field} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Status" error={form.errors.status}>
                    <select className={field} value={form.data.status} onChange={(e) => form.setData('status', e.target.value as TaskStatus)}>
                        {TASK_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                </Field>
                <Field label="Priority" error={form.errors.priority}>
                    <select className={field} value={form.data.priority} onChange={(e) => form.setData('priority', e.target.value as TaskPriority)}>
                        {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                </Field>
            </div>
            <Field label="Due date" error={form.errors.due_date}>
                <Input type="date" value={form.data.due_date} onChange={(e) => form.setData('due_date', e.target.value)} />
            </Field>
            <div className="flex items-center gap-3">
                <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : task ? 'Update task' : 'Create task'}</Button>
                <Button asChild variant="ghost"><Link href={tasks.index().url}>Cancel</Link></Button>
            </div>
        </form>
    );
}
