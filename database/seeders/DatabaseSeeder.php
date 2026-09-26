<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $demo = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com'
        ]);

        $other = User::factory()->create([
            'name' => 'Other User',
            'email' => 'other@example.com'
        ]);

        Task::factory()->count(40)->for($demo)->create();
        Task::factory()->count(10)->for($other)->create();
    }
}
