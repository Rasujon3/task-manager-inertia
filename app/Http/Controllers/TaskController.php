<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexTaskRequest;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(IndexTaskRequest $request): Response
    {
        Gate::authorize('viewAny', Task::class);
        $filters = $request->filters();

        $tasks = $request->user()->tasks()
            ->select(['id', 'title', 'status', 'priority', 'due_date', 'created_at'])
            ->search($filters['search'])
            ->status($filters['status'])
            ->priority($filters['priority'])
            ->orderBy($filters['sort'], $filters['direction'])
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Task::class);

        return Inertia::render('tasks/create');
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $task = $request->user()->tasks()->create($request->validated());

        Inertia::flash(['success', 'Task created successfully.']);

        return to_route('tasks.show', $task);
    }

    public function show(Task $task): Response
    {
        Gate::authorize('view', $task);

        return Inertia::render('tasks/show', [
            'task' => $task->load('user:id,name'),
            'can' => [
                'update' => Gate::allows('update', $task),
                'delete' => Gate::allows('delete', $task),
            ],
        ]);
    }

    public function edit(Task $task): Response
    {
        Gate::authorize('update', $task);

        return Inertia::render('tasks/edit', ['task' => $task]);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $task->update($request->validated());

        Inertia::flash(['success', 'Task updated successfully.']);

        return to_route('tasks.show', $task);
    }

    public function destroy(Task $task): RedirectResponse
    {
        Gate::authorize('delete', $task);

        $task->delete();

        Inertia::flash(['success', 'Task deleted.']);

        return to_route('tasks.index');
    }
}
