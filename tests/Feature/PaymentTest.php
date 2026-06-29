<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Level;
use App\Models\Fee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
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

    public function test_admin_can_list_payments(): void
    {
        $user = $this->createAdmin();
        $response = $this->actingAs($user)->get('/payments');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_payment(): void
    {
        $user = $this->createAdmin();
        $level = Level::create(['name' => 'الأول', 'code' => 'P1', 'order' => 1]);
        $studentUser = User::create(['name' => 'طالب', 'email' => 'std@test.com', 'password' => bcrypt('password'), 'role' => 'student', 'is_active' => true]);
        $student = Student::create(['user_id' => $studentUser->id, 'student_code' => 'STD-001', 'level_id' => $level->id, 'enrolled_at' => now()]);

        $response = $this->actingAs($user)->post('/payments', [
            'student_id' => $student->id,
            'amount' => 1500,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'cash',
            'notes' => 'دفع نقدي',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('payments', ['student_id' => $student->id, 'amount' => 1500]);
    }

    public function test_payment_requires_student_and_amount(): void
    {
        $user = $this->createAdmin();
        $response = $this->actingAs($user)->post('/payments', []);
        $response->assertSessionHasErrors(['student_id', 'amount', 'payment_date', 'payment_method']);
    }
}
