import type { TaskPriority, TaskStatus } from '@/types/task';

const STATUS: Record<TaskStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
};
const PRIORITY: Record<TaskPriority, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
    return <span className={`rounded px-2 py-1 text-xs font-medium ${STATUS[status]}`}>{status.replace('_', ' ')}</span>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
    return <span className={`rounded px-2 py-1 text-xs font-medium ${PRIORITY[priority]}`}>{priority}</span>;
}
