import { Head, Link } from '@inertiajs/react';

import { PriorityBadge, StatusBadge } from '@/components/tasks/badges';
import { DeleteTaskButton } from '@/components/tasks/delete-task-button';
import { TasksLayout } from '@/components/tasks/tasks-layout';
import { Button } from '@/components/ui/button';
import tasks from '@/routes/tasks';
import type { TaskDetail } from '@/types/task';

type Props = { task: TaskDetail; can: { update: boolean; delete: boolean } };

export default function ShowTask({ task, can }: Props) {
    const rows: [string, string][] = [
        ['Owner', task.user.name],
        ['Due date', task.due_date ?? '—'],
        ['Created', new Date(task.created_at).toLocaleString()],
        ['Updated', new Date(task.updated_at).toLocaleString()],
    ];

    return (
        <TasksLayout breadcrumbs={[{ title: 'Tasks', href: tasks.index().url }, { title: task.title, href: tasks.show(task.id).url }]}>
            <Head title={task.title} />
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="mt-2 flex gap-2"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
            <p className="mt-4 whitespace-pre-wrap">{task.description ?? 'No description.'}</p>
            <dl className="mt-6 grid max-w-md grid-cols-2 gap-2">
                {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="text-gray-500">{k}</dt><dd>{v}</dd></div>))}
            </dl>
            <div className="mt-6 flex gap-2">
                {can.update && <Button asChild><Link href={tasks.edit(task.id).url}>Edit</Link></Button>}
                {can.delete && <DeleteTaskButton id={task.id} title={task.title} />}
                <Button asChild variant="ghost"><Link href={tasks.index().url}>Back</Link></Button>
            </div>
        </TasksLayout>
    );
}
