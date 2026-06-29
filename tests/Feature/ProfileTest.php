<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        return User::create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    public function test_profile_page_is_displayed(): void
    {
        $user = $this->createUser();
        $response = $this->actingAs($user)->get('/profile');
        $response->assertStatus(200);
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = $this->createUser();
        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Updated Name',
            'email' => 'updated@test.com',
        ]);
        $response->assertRedirect();
        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
    }

    public function test_password_can_be_updated(): void
    {
        $user = $this->createUser();
        $response = $this->actingAs($user)->put('/profile/password', [
            'current_password' => 'password',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);
        $response->assertRedirect();
    }
}
