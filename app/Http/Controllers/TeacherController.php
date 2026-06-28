<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::with('user')->withCount('groups')->get();
        return Inertia::render('Teachers/Index', ['teachers' => $teachers]);
    }

    public function create()
    {
        return Inertia::render('Teachers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt('password'),
            'phone' => $validated['phone'] ?? null,
            'role' => 'teacher',
            'is_active' => true,
        ]);

        Teacher::create([
            'user_id' => $user->id,
            'teacher_code' => 'TCH-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
            'specialization' => $validated['specialization'] ?? null,
            'qualification' => $validated['qualification'] ?? null,
            'hire_date' => $validated['hire_date'] ?? null,
        ]);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Teacher $teacher)
    {
        return Inertia::render('Teachers/Edit', ['teacher' => $teacher->load('user')]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $teacher->user_id,
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
        ]);

        $teacher->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $teacher->update([
            'specialization' => $validated['specialization'] ?? null,
            'qualification' => $validated['qualification'] ?? null,
            'hire_date' => $validated['hire_date'] ?? null,
        ]);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->groups()->exists() || $teacher->exams()->exists()) {
            return redirect()->back()->with('error', 'لا يمكن حذف المدرس لوجود بيانات مرتبطة به');
        }

        $teacher->user->delete();
        $teacher->delete();

        return redirect()->back()->with('success', 'تم الحذف');
    }
}
