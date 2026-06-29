<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\Level;
use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_list_students(): void
    {
        $user = $this->createAdmin();
        $response = $this->actingAs($user)->get('/students');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_student(): void
    {
        $user = $this->createAdmin();
        $level = Level::create(['name' => 'الأول', 'code' => 'P1', 'order' => 1]);
        $group = Group::create(['name' => 'مجموعة A', 'level_id' => $level->id]);

        $response = $this->actingAs($user)->post('/students', [
            'name' => 'طالب تجريبي',
            'level_id' => $level->id,
            'group_id' => $group->id,
            'guardian_name' => 'ولي الأمر',
            'guardian_phone' => '01234567890',
            'birth_date' => '2010-01-01',
            'address' => 'القاهرة',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['name' => 'طالب تجريبي', 'role' => 'student']);
        $this->assertDatabaseHas('students', ['level_id' => $level->id, 'group_id' => $group->id]);
    }

    public function test_student_requires_name_and_level(): void
    {
        $user = $this->createAdmin();
        $response = $this->actingAs($user)->post('/students', []);
        $response->assertSessionHasErrors(['name', 'level_id']);
    }

    public function test_admin_can_update_student(): void
    {
        $user = $this->createAdmin();
        $level = Level::create(['name' => 'الأول', 'code' => 'P1', 'order' => 1]);
        $studentUser = User::create(['name' => 'طالب', 'email' => 'std@test.com', 'password' => bcrypt('password'), 'role' => 'student', 'is_active' => true]);
        $student = Student::create(['user_id' => $studentUser->id, 'student_code' => 'STD-001', 'level_id' => $level->id, 'enrolled_at' => now()]);

        $response = $this->actingAs($user)->put("/students/{$student->id}", [
            'name' => 'طالب محدث',
            'level_id' => $level->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $studentUser->id, 'name' => 'طالب محدث']);
    }

    public function test_admin_can_delete_student(): void
    {
        $user = $this->createAdmin();
        $level = Level::create(['name' => 'الأول', 'code' => 'P1', 'order' => 1]);
        $studentUser = User::create(['name' => 'طالب', 'email' => 'std@test.com', 'password' => bcrypt('password'), 'role' => 'student', 'is_active' => true]);
        $student = Student::create(['user_id' => $studentUser->id, 'student_code' => 'STD-001', 'level_id' => $level->id, 'enrolled_at' => now()]);

        $response = $this->actingAs($user)->delete("/students/{$student->id}");
        $response->assertRedirect();
        $this->assertDatabaseMissing('students', ['id' => $student->id]);
    }
}
