<?php

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login', function () {
    $this->get('/tasks')->assertRedirect('/login');
});

test('index lists only the owners tasks', function () {
    $user = User::factory()->create();
    Task::factory()->count(3)->for($user)->create();
    Task::factory()->count(2)->create();

    $this->actingAs($user)->get('/tasks')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks.data', 3)
            ->where('tasks.total', 3));
});

test('status filter works', function () {
    $user = User::factory()->create();
    Task::factory()->count(2)->for($user)->create(['status' => TaskStatus::Completed]);
    Task::factory()->count(3)->for($user)->create(['status' => TaskStatus::Pending]);

    $this->actingAs($user)->get('/tasks?status=completed')
        ->assertInertia(fn (Assert $page) => $page->has('tasks.data', 2));
});

test('invalid sort column is rejected', function () {
    $this->actingAs(User::factory()->create())
        ->get('/tasks?sort=password')
        ->assertSessionHasErrors('sort');
});

test('store validates input', function () {
    $this->actingAs(User::factory()->create())
        ->post('/tasks', [])
        ->assertSessionHasErrors(['title', 'status', 'priority']);
});

test('store creates a task owned by the current user', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $response = $this->actingAs($user)->post('/tasks', [
        'title' => 'Write tests',
        'status' => 'pending',
        'priority' => 'high',
        'user_id' => $other->id,
    ]);

    $task = $user->tasks()->firstOrFail();
    $response->assertRedirect(route('tasks.show', $task))->assertInertiaFlash('success');
    expect($task->title)->toBe('Write tests');
});

test('users cannot view update or delete others tasks', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create();

    $this->actingAs($user)->get(route('tasks.show', $task))->assertNotFound();
    $this->actingAs($user)->put(route('tasks.update', $task), ['title' => 'x', 'status' => 'pending', 'priority' => 'low'])->assertNotFound();
    $this->actingAs($user)->delete(route('tasks.destroy', $task))->assertNotFound();

    expect($task->fresh())->not->toBeNull();
});

test('owner can update and delete', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $this->actingAs($user)->put(route('tasks.update', $task), [
        'title' => 'Updated', 'status' => 'completed', 'priority' => 'low',
    ])->assertRedirect(route('tasks.show', $task));
    expect($task->fresh()->title)->toBe('Updated');

    $this->actingAs($user)->delete(route('tasks.destroy', $task))->assertRedirect(route('tasks.index'));
    expect(Task::find($task->id))->toBeNull();
});

test('dashboard shows correct stats', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['status' => TaskStatus::Pending]);
    Task::factory()->count(2)->for($user)->create(['status' => TaskStatus::Completed]);

    $this->actingAs($user)->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('stats.total', 3)
            ->where('stats.completed', 2));
});
