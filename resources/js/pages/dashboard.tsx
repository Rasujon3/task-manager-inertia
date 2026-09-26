import { Deferred, Head, Link } from '@inertiajs/react';

import { StatusBadge } from '@/components/tasks/badges';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import tasks from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';
import type { TaskStatus } from '@/types/task';

type Stats = { total: number; pending: number; in_progress: number; completed: number; high_priority: number };
type Recent = { id: number; title: string; status: TaskStatus; due_date: string | null };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];

export default function Dashboard({ stats, recent }: { stats: Stats; recent?: Recent[] }) {
    const cards: [string, number][] = [
        ['Total tasks', stats.total],
        ['Pending', stats.pending],
        ['In progress', stats.in_progress],
        ['Completed', stats.completed],
        ['High priority', stats.high_priority],
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {cards.map(([label, value]) => (
                        <div key={label} className="rounded-xl border p-4">
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-3xl font-bold">{value}</p>
                        </div>
                    ))}
                </div>
                <h2 className="mt-8 text-lg font-semibold">Recent tasks</h2>
                <Deferred data="recent" fallback={<p className="mt-2 text-gray-500">Loading...</p>}>
                    <ul className="mt-2 divide-y">
                        {recent?.map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-2">
                                <Link href={tasks.show(t.id).url} className="hover:underline">{t.title}</Link>
                                <StatusBadge status={t.status} />
                            </li>
                        ))}
                    </ul>
                </Deferred>
            </div>
        </AppLayout>
    );
}
