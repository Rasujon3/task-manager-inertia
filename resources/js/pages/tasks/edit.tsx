import { Head } from '@inertiajs/react';

import { TaskForm } from '@/components/tasks/task-form';
import { TasksLayout } from '@/components/tasks/tasks-layout';
import tasks from '@/routes/tasks';
import type { Task } from '@/types/task';

export default function EditTask({ task }: { task: Task }) {
    return (
        <TasksLayout breadcrumbs={[{ title: 'Tasks', href: tasks.index().url }, { title: 'Edit', href: tasks.edit(task.id).url }]}>
            <Head title={`Edit: ${task.title}`} />
            <h1 className="text-2xl font-bold">Edit task</h1>
            <TaskForm task={task} />
        </TasksLayout>
    );
}
