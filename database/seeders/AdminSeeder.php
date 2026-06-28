<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('email', 'admin@eduflow.local')->doesntExist()) {
            User::create([
                'name' => 'المدير',
                'email' => 'admin@eduflow.local',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'is_active' => true,
            ]);
        }
    }
}
