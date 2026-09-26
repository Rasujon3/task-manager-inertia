<?php

namespace App\Services;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;

class TaskStatsService
{
    /** @return array{total: int, pending: int, in_progress: int, completed: int, high_priority: int} */
    public function forUser(User $user): array
    {
        $row = Task::query()
            ->where('user_id', $user->id)
            ->toBase()
            ->selectRaw('count(*) as total')
            ->selectRaw('coalesce(sum(case when status = ? then 1 else 0 end), 0) as pending', [TaskStatus::Pending->value])
            ->selectRaw('coalesce(sum(case when status = ? then 1 else 0 end), 0) as in_progress', [TaskStatus::InProgress->value])
            ->selectRaw('coalesce(sum(case when status = ? then 1 else 0 end), 0) as completed', [TaskStatus::Completed->value])
            ->selectRaw('coalesce(sum(case when priority = ? then 1 else 0 end), 0) as high_priority', [TaskPriority::High->value])
            ->first();

        return [
            'total' => (int) $row->total,
            'pending' => (int) $row->pending,
            'in_progress' => (int) $row->in_progress,
            'completed' => (int) $row->completed,
            'high_priority' => (int) $row->high_priority,
        ];
    }
}
