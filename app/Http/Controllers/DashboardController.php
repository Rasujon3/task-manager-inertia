<?php

namespace App\Http\Controllers;

use App\Services\TaskStatsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, TaskStatsService $stats): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'stats' => $stats->forUser($user),
            'recent' => Inertia::defer(fn () => $user->tasks()
                ->latest('id')
                ->limit(5)
                ->get(['id', 'title', 'status', 'due_date'])),
        ]);
    }
}
