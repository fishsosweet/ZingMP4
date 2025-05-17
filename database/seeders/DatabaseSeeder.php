<?php

namespace Database\Seeders;

use App\Models\Casi;
use App\Models\TheLoai;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Phat',
            'email' => 'phat022101035@tgu.edu.vn',
            'password' => bcrypt('123456'),
        ]);

    }
}
