<?php
namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Subject;
use App\Models\Exam;
use App\Services\AiAnalysisService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiController extends Controller
{
    protected AiAnalysisService $aiService;

    public function __construct(AiAnalysisService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function index()
    {
        $insights = $this->aiService->getDashboardInsights();
        return Inertia::render('AI/Index', ['insights' => $insights]);
    }

    public function analyzeStudent(Student $student)
    {
        $analysis = $this->aiService->analyzeStudent($student);
        return Inertia::render('AI/StudentAnalysis', ['analysis' => $analysis]);
    }

    public function analyzeGroup(Request $request)
    {
        $request->validate(['group_id' => 'required|exists:groups,id']);
        $analysis = $this->aiService->analyzeGroup($request->group_id);
        return Inertia::render('AI/GroupAnalysis', ['analysis' => $analysis]);
    }

    public function generateQuestions(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'count' => 'integer|min:1|max:20',
            'difficulty' => 'string|in:easy,medium,hard',
            'type' => 'string|in:multiple_choice,true_false,essay',
        ]);

        $questions = $this->aiService->generateQuestions(
            $request->subject,
            $request->count ?? 5,
            $request->difficulty ?? 'medium',
            $request->type ?? 'multiple_choice'
        );

        return Inertia::render('AI/GeneratedQuestions', ['questions' => $questions]);
    }

    public function questionForm()
    {
        $subjects = Subject::all();
        return Inertia::render('AI/QuestionGenerator', ['subjects' => $subjects]);
    }
}
