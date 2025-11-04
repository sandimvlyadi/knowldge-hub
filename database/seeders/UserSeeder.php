<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'sandimvlyadi@gmail.com'],
            [
                'name' => 'Sandi Mulyadi',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'kelompok5@gmail.com'],
            [
                'name' => 'Kelompok 5',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
