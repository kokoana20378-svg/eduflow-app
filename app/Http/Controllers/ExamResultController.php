<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Student;
use App\Services\PdfExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamResultController extends Controller
{
    public function index(Exam $exam)
    {
        $results = ExamResult::where('exam_id', $exam->id)
            ->with('student.user')
            ->get();

        return Inertia::render('ExamResults/Index', [
            'exam' => $exam->load(['level', 'group', 'subject', 'teacher.user']),
            'results' => $results,
        ]);
    }

    public function create(Exam $exam)
    {
        $students = Student::where('level_id', $exam->level_id)
            ->when($exam->group_id, fn($q) => $q->where('group_id', $exam->group_id))
            ->with('user')
            ->get();

        $existing = ExamResult::where('exam_id', $exam->id)->pluck('student_id')->toArray();

        return Inertia::render('ExamResults/Create', [
            'exam' => $exam->load(['level', 'group', 'subject']),
            'students' => $students,
            'existing_student_ids' => $existing,
        ]);
    }

    public function store(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'results' => 'required|array',
            'results.*.student_id' => 'required|exists:students,id',
            'results.*.marks_obtained' => 'required|numeric|min:0',
            'results.*.notes' => 'nullable|string',
        ]);

        foreach ($validated['results'] as $result) {
            $percentage = $exam->total_marks > 0
                ? round(($result['marks_obtained'] / $exam->total_marks) * 100, 2)
                : 0;

            $grade = $this->calculateGrade($percentage);

            ExamResult::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'student_id' => $result['student_id'],
                ],
                [
                    'marks_obtained' => $result['marks_obtained'],
                    'percentage' => $percentage,
                    'grade' => $grade,
                    'notes' => $result['notes'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(ExamResult $examResult)
    {
        return Inertia::render('ExamResults/Edit', [
            'examResult' => $examResult->load(['exam', 'student.user']),
        ]);
    }

    public function update(Request $request, ExamResult $examResult)
    {
        $validated = $request->validate([
            'marks_obtained' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $percentage = $examResult->exam->total_marks > 0
            ? round(($validated['marks_obtained'] / $examResult->exam->total_marks) * 100, 2)
            : 0;

        $grade = $this->calculateGrade($percentage);

        $examResult->update([
            'marks_obtained' => $validated['marks_obtained'],
            'percentage' => $percentage,
            'grade' => $grade,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function exportPdf(Exam $exam)
    {
        $results = ExamResult::where('exam_id', $exam->id)->with('student.user')->get();
        return app(PdfExportService::class)->examResults($exam, $results);
    }

    protected function calculateGrade(float $percentage): string
    {
        return match (true) {
            $percentage >= 90 => 'A',
            $percentage >= 80 => 'B',
            $percentage >= 70 => 'C',
            $percentage >= 60 => 'D',
            $percentage >= 50 => 'E',
            default => 'F',
        };
    }
}
