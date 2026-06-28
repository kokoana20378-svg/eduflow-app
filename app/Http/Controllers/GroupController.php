<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Level;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::with(['level', 'teacher.user'])->withCount('students')->get();
        return Inertia::render('Groups/Index', ['groups' => $groups]);
    }

    public function create()
    {
        $levels = Level::orderBy('order')->get();
        $teachers = Teacher::with('user')->get();
        return Inertia::render('Groups/Create', ['levels' => $levels, 'teachers' => $teachers]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_id' => 'required|exists:levels,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'max_students' => 'nullable|integer|min:1',
            'room' => 'nullable|string|max:100',
            'schedule' => 'nullable|string',
        ]);

        Group::create($validated);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Group $group)
    {
        $levels = Level::orderBy('order')->get();
        $teachers = Teacher::with('user')->get();
        return Inertia::render('Groups/Edit', [
            'group' => $group->load(['level', 'teacher.user']),
            'levels' => $levels,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Group $group)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_id' => 'required|exists:levels,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'max_students' => 'nullable|integer|min:1',
            'room' => 'nullable|string|max:100',
            'schedule' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function destroy(Group $group)
    {
        if ($group->students()->exists()) {
            return redirect()->back()->with('error', 'لا يمكن حذف المجموعة لوجود طلاب مرتبطين بها');
        }

        $group->delete();

        return redirect()->back()->with('success', 'تم الحذف');
    }
}
