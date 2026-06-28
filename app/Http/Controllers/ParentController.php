<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\ParentModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ParentController extends Controller
{
    public function index()
    {
        $parents = User::where('role', 'parent')
            ->with('parent.students.user')
            ->get()
            ->each(fn($u) => $u->students_count = $u->parent?->students->count() ?? 0);

        return Inertia::render('Parents/Index', ['parents' => $parents]);
    }

    public function create()
    {
        $students = Student::with('user')->get();
        return Inertia::render('Parents/Create', ['students' => $students]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:20',
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt('password'),
            'phone' => $validated['phone'],
            'role' => 'parent',
            'is_active' => true,
        ]);

        $parent = ParentModel::create(['user_id' => $user->id]);

        $parent->students()->attach($validated['student_ids'], ['primary' => true]);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function show(User $parent)
    {
        if ($parent->role !== 'parent') {
            return redirect()->back()->with('error', 'المستخدم ليس ولي أمر');
        }

        return redirect()->route('parents.edit', $parent->id);
    }

    public function destroy(User $parent)
    {
        if ($parent->role !== 'parent') {
            return redirect()->back()->with('error', 'المستخدم ليس ولي أمر');
        }

        $parent->parent?->students()->detach();
        $parent->parent?->delete();
        $parent->delete();

        return redirect()->route('parents.index')->with('success', 'تم الحذف');
    }

    public function edit(User $parent)
    {
        if ($parent->role !== 'parent') {
            return redirect()->back()->with('error', 'المستخدم ليس ولي أمر');
        }

        $parent->load('parent.students.user');
        $students = Student::with('user')->get();

        return Inertia::render('Parents/Edit', [
            'parent' => $parent,
            'students' => $students,
        ]);
    }

    public function update(Request $request, User $parent)
    {
        if ($parent->role !== 'parent') {
            return redirect()->back()->with('error', 'المستخدم ليس ولي أمر');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $parent->id,
            'phone' => 'required|string|max:20',
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $parent->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        if ($parent->parent) {
            $parent->parent->students()->syncWithPivotValues($validated['student_ids'], ['primary' => true]);
        }

        return redirect()->back()->with('success', 'تم التحديث');
    }
}
