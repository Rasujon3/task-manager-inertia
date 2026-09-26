export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type Task = {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export type TaskListItem = Pick<Task, 'id' | 'title' | 'status' | 'priority' | 'due_date' | 'created_at'>;
export type TaskDetail = Task & { user: {id:number; name: string} };

export type TaskFilters = { search: string; status: string; priority: string; sort: string; direction: string };
