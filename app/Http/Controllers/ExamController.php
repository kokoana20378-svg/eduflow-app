<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Level;
use App\Models\Group;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        $exams = Exam::with(['level', 'group', 'subject', 'teacher.user'])->withCount('examResults')->get();
        return Inertia::render('Exams/Index', ['exams' => $exams]);
    }

    public function create()
    {
        $levels = Level::orderBy('order')->get();
        $groups = Group::all();
        $subjects = Subject::all();
        $teachers = Teacher::with('user')->get();
        return Inertia::render('Exams/Create', [
            'levels' => $levels,
            'groups' => $groups,
            'subjects' => $subjects,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level_id' => 'required|exists:levels,id',
            'group_id' => 'nullable|exists:groups,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'type' => 'required|string|in:midterm,final,quiz,assignment',
            'total_marks' => 'required|numeric|min:0',
            'date' => 'required|date',
            'duration' => 'nullable|integer|min:1',
        ]);

        Exam::create($validated);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Exam $exam)
    {
        $levels = Level::orderBy('order')->get();
        $groups = Group::all();
        $subjects = Subject::all();
        $teachers = Teacher::with('user')->get();
        return Inertia::render('Exams/Edit', [
            'exam' => $exam->load(['level', 'group', 'subject', 'teacher.user']),
            'levels' => $levels,
            'groups' => $groups,
            'subjects' => $subjects,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level_id' => 'required|exists:levels,id',
            'group_id' => 'nullable|exists:groups,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'type' => 'required|string|in:midterm,final,quiz,assignment',
            'total_marks' => 'required|numeric|min:0',
            'date' => 'required|date',
            'duration' => 'nullable|integer|min:1',
        ]);

        $exam->update($validated);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function destroy(Exam $exam)
    {
        if ($exam->examResults()->exists()) {
            return redirect()->back()->with('error', 'لا يمكن حذف الاختبار لوجود نتائج مرتبطة به');
        }

        $exam->delete();

        return redirect()->back()->with('success', 'تم الحذف');
    }
}
