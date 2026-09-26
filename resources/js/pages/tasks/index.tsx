import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Pagination } from '@/components/pagination';
import { PriorityBadge, StatusBadge } from '@/components/tasks/badges';
import { DeleteTaskButton } from '@/components/tasks/delete-task-button';
import { TasksLayout } from '@/components/tasks/tasks-layout';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import tasks from '@/routes/tasks';
import type { Paginated } from '@/types/pagination';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskFilters, type TaskListItem } from '@/types/task';

type Props = { tasks: Paginated<TaskListItem>; filters: TaskFilters };

export default function TasksIndex({ tasks: page, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(search, 400);

    function visit(next: TaskFilters) {
        const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== ''));

        router.get(tasks.index().url, params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['tasks', 'filters'],
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    }

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            visit({ ...filters, search: debouncedSearch });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const select = 'rounded border px-3 py-2';

    return (
        <TasksLayout breadcrumbs={[{ title: 'Tasks', href: tasks.index().url }]}>
            <Head title="Tasks" />

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tasks ({page.total})</h1>
                <Button asChild><Link href={tasks.create().url}>New task</Link></Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                <input className={`${select} flex-1`} placeholder="Search title or description..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className={select} value={filters.status} onChange={(e) => visit({ ...filters, status: e.target.value })}>
                    <option value="">All statuses</option>
                    {TASK_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <select className={select} value={filters.priority} onChange={(e) => visit({ ...filters, priority: e.target.value })}>
                    <option value="">All priorities</option>
                    {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select className={select} value={`${filters.sort}:${filters.direction}`} onChange={(e) => {
                    const [sort, direction] = e.target.value.split(':');
                    visit({ ...filters, sort, direction });
                }}>
                    <option value="created_at:desc">Newest first</option>
                    <option value="created_at:asc">Oldest first</option>
                    <option value="due_date:asc">Due date ↑</option>
                    <option value="due_date:desc">Due date ↓</option>
                    <option value="title:asc">Title A–Z</option>
                </select>
            </div>

            <div className={loading ? 'opacity-60' : ''}>
                {page.data.length === 0 ? (
                    <p className="mt-8 text-center text-gray-500">No tasks found. Try changing the filters or create a new task.</p>
                ) : (
                    <ul className="mt-6 divide-y">
                        {page.data.map((task) => (
                            <li key={task.id} className="flex items-center justify-between gap-3 py-3">
                                <div>
                                    <Link href={tasks.show(task.id).url} className="font-medium hover:underline">{task.title}</Link>
                                    <div className="mt-1 flex gap-2"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} />{task.due_date && <span className="text-xs text-gray-500">Due {task.due_date}</span>}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="sm"><Link href={tasks.edit(task.id).url}>Edit</Link></Button>
                                    <DeleteTaskButton id={task.id} title={task.title} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Pagination page={page} />
        </TasksLayout>
    );
}
