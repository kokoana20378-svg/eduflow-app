<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Level;
use App\Models\Group;
use App\Models\User;
use App\Services\PdfExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['user', 'level', 'group'])->get();
        return Inertia::render('Students/Index', ['students' => $students]);
    }

    public function create()
    {
        $levels = Level::orderBy('order')->get();
        $groups = Group::all();
        return Inertia::render('Students/Create', ['levels' => $levels, 'groups' => $groups]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'level_id' => 'required|exists:levels,id',
            'group_id' => 'nullable|exists:groups,id',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        $email = 'student.' . Str::random(6) . '@eduflow.local';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => bcrypt('password'),
            'phone' => $validated['phone'] ?? null,
            'role' => 'student',
            'is_active' => true,
        ]);

        Student::create([
            'user_id' => $user->id,
            'student_code' => 'STU-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
            'guardian_name' => $validated['guardian_name'] ?? null,
            'guardian_phone' => $validated['guardian_phone'] ?? null,
            'level_id' => $validated['level_id'],
            'group_id' => $validated['group_id'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'address' => $validated['address'] ?? null,
            'enrolled_at' => now(),
        ]);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Student $student)
    {
        $levels = Level::orderBy('order')->get();
        $groups = Group::all();
        return Inertia::render('Students/Edit', [
            'student' => $student->load(['user', 'level', 'group']),
            'levels' => $levels,
            'groups' => $groups,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'level_id' => 'required|exists:levels,id',
            'group_id' => 'nullable|exists:groups,id',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        $student->user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $student->update([
            'guardian_name' => $validated['guardian_name'] ?? null,
            'guardian_phone' => $validated['guardian_phone'] ?? null,
            'level_id' => $validated['level_id'],
            'group_id' => $validated['group_id'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function destroy(Student $student)
    {
        $student->user->delete();
        $student->delete();

        return redirect()->back()->with('success', 'تم الحذف');
    }

    public function exportPdf(Request $request)
    {
        $students = Student::with('user', 'level', 'group')->get();
        if ($request->level_id) $students = $students->where('level_id', $request->level_id);
        if ($request->group_id) $students = $students->where('group_id', $request->group_id);
        return app(PdfExportService::class)->studentList($students);
    }
}
