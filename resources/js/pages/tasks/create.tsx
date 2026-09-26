import { Head } from '@inertiajs/react';

import { TaskForm } from '@/components/tasks/task-form';
import { TasksLayout } from '@/components/tasks/tasks-layout';
import tasks from '@/routes/tasks';

export default function CreateTask() {
    return (
        <TasksLayout breadcrumbs={[{ title: 'Tasks', href: tasks.index().url }, { title: 'Create', href: tasks.create().url }]}>
            <Head title="Create task" />
            <h1 className="text-2xl font-bold">Create task</h1>
            <TaskForm />
        </TasksLayout>
    );
}
