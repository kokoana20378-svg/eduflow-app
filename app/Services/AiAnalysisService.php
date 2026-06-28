<?php
namespace App\Services;

use App\Models\Student;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Subject;
use App\Models\Group;
use Illuminate\Support\Facades\DB;

class AiAnalysisService
{
    public function analyzeStudent(Student $student)
    {
        $results = ExamResult::where('student_id', $student->id)
            ->with('exam')
            ->get();

        $attendances = Attendance::where('student_id', $student->id)->get();

        $totalExams = $results->count();
        $avgPercentage = $results->avg('percentage');
        $passedExams = $results->where('percentage', '>=', 50)->count();
        $failedExams = $results->where('percentage', '<', 50)->count();

        $totalDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

        $subjectPerformance = $results->groupBy('exam.subject_id')->map(function ($subjectResults) {
            return [
                'count' => $subjectResults->count(),
                'avg' => round($subjectResults->avg('percentage'), 1),
                'max' => $subjectResults->max('percentage'),
                'min' => $subjectResults->min('percentage'),
            ];
        });

        $sortedResults = $results->sortBy('exam.date')->values();
        $trend = 'مستقر';
        if ($sortedResults->count() >= 3) {
            $recent = $sortedResults->slice(-3)->avg('percentage');
            $older = $sortedResults->slice(0, 3)->avg('percentage');
            if ($recent > $older + 5) $trend = 'في تحسن مستمر';
            elseif ($recent < $older - 5) $trend = 'في تراجع - يحتاج متابعة';
        }

        $predictedGrade = $this->predictGrade($avgPercentage, $trend);

        $weaknesses = $subjectPerformance->sortBy('avg')->take(3)->keys()
            ->map(fn($id) => Subject::find($id)?->name)
            ->filter()
            ->values();

        $strengths = $subjectPerformance->sortByDesc('avg')->take(3)->keys()
            ->map(fn($id) => Subject::find($id)?->name)
            ->filter()
            ->values();

        return [
            'student_name' => $student->user?->name,
            'student_code' => $student->student_code,
            'total_exams' => $totalExams,
            'average_percentage' => round($avgPercentage, 1),
            'passed_exams' => $passedExams,
            'failed_exams' => $failedExams,
            'pass_rate' => $totalExams > 0 ? round(($passedExams / $totalExams) * 100, 1) : 0,
            'attendance_rate' => $attendanceRate,
            'present_days' => $presentDays,
            'absent_days' => $absentDays,
            'trend' => $trend,
            'predicted_grade' => $predictedGrade,
            'weaknesses' => $weaknesses,
            'strengths' => $strengths,
            'subject_performance' => $subjectPerformance,
            'recommendations' => $this->generateRecommendations($weaknesses, $strengths, $attendanceRate, $trend),
        ];
    }

    public function analyzeGroup($groupId)
    {
        $students = Student::where('group_id', $groupId)->with('user', 'examResults.exam')->get();

        $analysis = $students->map(fn($s) => $this->analyzeStudent($s));

        return [
            'group_name' => Group::find($groupId)?->name,
            'total_students' => $students->count(),
            'average_performance' => round($analysis->avg('average_percentage'), 1),
            'average_attendance' => round($analysis->avg('attendance_rate'), 1),
            'at_risk_students' => $analysis->where('trend', 'like', '%تراجع%')->values(),
            'top_students' => $analysis->sortByDesc('average_percentage')->take(5)->values(),
            'pass_rate' => round($analysis->where('pass_rate', '>=', 50)->count() / max($students->count(), 1) * 100, 1),
        ];
    }

    public function generateQuestions($subject, $count = 5, $difficulty = 'medium', $type = 'multiple_choice')
    {
        $questions = [];
        $questionTemplates = $this->getQuestionTemplates($subject, $difficulty);

        for ($i = 0; $i < min($count, count($questionTemplates)); $i++) {
            $template = $questionTemplates[$i];
            $questions[] = $this->buildQuestion($template, $type, $i + 1);
        }

        return [
            'subject' => $subject,
            'difficulty' => $difficulty,
            'count' => count($questions),
            'questions' => $questions,
        ];
    }

    private function predictGrade($avgPercentage, $trend)
    {
        $adjusted = $avgPercentage ?? 0;
        if (str_contains($trend, 'تحسن')) $adjusted += 5;
        elseif (str_contains($trend, 'تراجع')) $adjusted -= 5;

        return match(true) {
            $adjusted >= 90 => 'ممتاز',
            $adjusted >= 80 => 'جيد جداً',
            $adjusted >= 65 => 'جيد',
            $adjusted >= 50 => 'مقبول',
            default => 'ضعيف',
        };
    }

    private function generateRecommendations($weaknesses, $strengths, $attendanceRate, $trend)
    {
        $recs = [];

        if ($attendanceRate < 80) {
            $recs[] = 'نسبة الحضور منخفضة - يجب تحسين الانتظام في الحضور';
        }
        if (!empty($weaknesses)) {
            $recs[] = 'المواد التي تحتاج تحسين: ' . implode('، ', $weaknesses->toArray());
        }
        if (str_contains($trend, 'تراجع')) {
            $recs[] = 'الأداء في تراجع - ينصح بعمل خطة متابعة مكثفة';
        }
        if (!empty($strengths)) {
            $recs[] = 'نقاط القوة: ' . implode('، ', $strengths->toArray()) . ' - استمر في التميز';
        }
        if (str_contains($trend, 'تحسن')) {
            $recs[] = 'أداء ممتاز في تحسن مستمر - استمر بنفس المستوى';
        }

        return $recs;
    }

    private function getQuestionTemplates($subject, $difficulty)
    {
        $templates = [
            'الرياضيات' => [
                ['q' => 'ما قيمة :equation', 'equation' => '15 + 27 = ?', 'options' => ['42', '32', '52', '62'], 'answer' => '42'],
                ['q' => 'احسب :equation', 'equation' => '12 × 8 = ?', 'options' => ['96', '86', '106', '116'], 'answer' => '96'],
                ['q' => 'ما ناتج :equation', 'equation' => '144 ÷ 12 = ?', 'options' => ['12', '10', '14', '8'], 'answer' => '12'],
                ['q' => 'حل المعادلة: 2x + 6 = 14، x = ?', 'equation' => '', 'options' => ['4', '3', '5', '6'], 'answer' => '4'],
                ['q' => 'ما مساحة مربع طول ضلعه 5 سم؟', 'equation' => '', 'options' => ['25 سم²', '20 سم²', '15 سم²', '10 سم²'], 'answer' => '25 سم²'],
                ['q' => 'حول الكسر 3/4 إلى نسبة مئوية', 'equation' => '', 'options' => ['75%', '50%', '25%', '80%'], 'answer' => '75%'],
                ['q' => 'ما محيط دائرة نصف قطرها 7 سم؟ (π = 22/7)', 'equation' => '', 'options' => ['44 سم', '42 سم', '48 سم', '40 سم'], 'answer' => '44 سم'],
                ['q' => 'احسب: -5 + 8 = ?', 'equation' => '', 'options' => ['3', '-3', '13', '-13'], 'answer' => '3'],
            ],
            'اللغة العربية' => [
                ['q' => 'ما هي علامة رفع الفاعل في الجملة الاسمية؟', 'equation' => '', 'options' => ['الضمة', 'الفتحة', 'الكسرة', 'السكون'], 'answer' => 'الضمة'],
                ['q' => '"اجتهد الطالب" - ما نوع الفعل؟', 'equation' => '', 'options' => ['فعل ماض', 'فعل مضارع', 'فعل أمر', 'اسم'], 'answer' => 'فعل ماض'],
                ['q' => 'جمع كلمة "كتاب"', 'equation' => '', 'options' => ['كتب', 'كتابة', 'كاتب', 'مكتب'], 'answer' => 'كتب'],
                ['q' => 'ما إعراب "المعلم" في: حضر المعلم؟', 'equation' => '', 'options' => ['فاعل مرفوع', 'مفعول به منصوب', 'مبتدأ مرفوع', 'خبر مرفوع'], 'answer' => 'فاعل مرفوع'],
                ['q' => '"إن الطالب مجتهد" - ما اسم "إن"؟', 'equation' => '', 'options' => ['الطالب', 'مجتهد', 'إن', 'ال'], 'answer' => 'الطالب'],
                ['q' => 'مرادف كلمة "شجاع"', 'equation' => '', 'options' => ['جريء', 'جبان', 'حذر', 'كسول'], 'answer' => 'جريء'],
                ['q' => 'ضد كلمة "نشيط"', 'equation' => '', 'options' => ['كسول', 'ماهر', 'سريع', 'قوي'], 'answer' => 'كسول'],
                ['q' => 'المبتدأ في الجملة الاسمية يكون دائمًا', 'equation' => '', 'options' => ['مرفوعاً', 'منصوباً', 'مجروراً', 'مجزوماً'], 'answer' => 'مرفوعاً'],
            ],
            'اللغة الإنجليزية' => [
                ['q' => 'What is the past tense of "go"?', 'equation' => '', 'options' => ['went', 'gone', 'going', 'goes'], 'answer' => 'went'],
                ['q' => 'She ___ a teacher. (complete)', 'equation' => '', 'options' => ['is', 'am', 'are', 'be'], 'answer' => 'is'],
                ['q' => 'The plural of "child" is', 'equation' => '', 'options' => ['children', 'childs', 'childes', 'child'], 'answer' => 'children'],
                ['q' => 'I have ___ apple. (article)', 'equation' => '', 'options' => ['an', 'a', 'the', 'none'], 'answer' => 'an'],
                ['q' => 'He ___ to school every day.', 'equation' => '', 'options' => ['goes', 'go', 'going', 'went'], 'answer' => 'goes'],
                ['q' => 'Which word is an adjective?', 'equation' => '', 'options' => ['beautiful', 'beauty', 'beautify', 'beautifully'], 'answer' => 'beautiful'],
                ['q' => 'What is the opposite of "hot"?', 'equation' => '', 'options' => ['cold', 'warm', 'cool', 'freezing'], 'answer' => 'cold'],
                ['q' => 'She has been studying ___ two hours.', 'equation' => '', 'options' => ['for', 'since', 'during', 'by'], 'answer' => 'for'],
            ],
            'العلوم' => [
                ['q' => 'ما وحدة قياس القوة؟', 'equation' => '', 'options' => ['نيوتن', 'جول', 'واط', 'أمبير'], 'answer' => 'نيوتن'],
                ['q' => 'كم عدد الكواكب في المجموعة الشمسية؟', 'equation' => '', 'options' => ['8', '7', '9', '10'], 'answer' => '8'],
                ['q' => 'ما أكبر كوكب في المجموعة الشمسية؟', 'equation' => '', 'options' => ['المشتري', 'زحل', 'الأرض', 'نبتون'], 'answer' => 'المشتري'],
                ['q' => 'عملية تحويل الماء إلى بخار تسمى', 'equation' => '', 'options' => ['التبخر', 'التكثف', 'التجمد', 'الانصهار'], 'answer' => 'التبخر'],
                ['q' => 'ما لون الدم المؤكسج؟', 'equation' => '', 'options' => ['أحمر فاتح', 'أحمر غامق', 'أزرق', 'أخضر'], 'answer' => 'أحمر فاتح'],
                ['q' => 'أي من التالي يعتبر من الثدييات؟', 'equation' => '', 'options' => ['الحوت', 'التمساح', 'النسر', 'السلحفاة'], 'answer' => 'الحوت'],
                ['q' => 'ما عنصر الماء الكيميائي؟', 'equation' => '', 'options' => ['H₂O', 'CO₂', 'NaCl', 'HCl'], 'answer' => 'H₂O'],
                ['q' => 'سرعة الضوء حوالي', 'equation' => '', 'options' => ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], 'answer' => '300,000 km/s'],
            ],
        ];

        return $templates[$subject] ?? $templates[array_rand($templates)];
    }

    private function buildQuestion($template, $type, $number)
    {
        $question = [
            'number' => $number,
            'question' => str_replace(':equation', $template['equation'] ?? '', $template['q']),
            'type' => $type,
        ];

        if ($type === 'multiple_choice') {
            $question['options'] = $template['options'];
            $question['correct_answer'] = $template['answer'];
        } elseif ($type === 'true_false') {
            $question['options'] = ['صح', 'خطأ'];
            $question['correct_answer'] = 'صح';
        } elseif ($type === 'essay') {
            $question['correct_answer'] = $template['answer'];
        }

        return $question;
    }

    public function getDashboardInsights()
    {
        $totalStudents = Student::count();
        $totalExams = Exam::count();

        $avgPerformance = ExamResult::avg('percentage') ?? 0;
        $avgAttendance = Attendance::whereDate('date', '>=', now()->subMonth())
            ->selectRaw('(SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as rate')
            ->value('rate') ?? 0;

        $atRiskCount = ExamResult::selectRaw('student_id')
            ->groupBy('student_id')
            ->havingRaw('AVG(percentage) < 50')
            ->get()->count();

        $topSubjects = Subject::withCount('exams')
            ->orderByDesc('exams_count')
            ->take(5)
            ->get()
            ->pluck('name');

        return [
            'total_students' => $totalStudents,
            'total_exams' => $totalExams,
            'average_performance' => round($avgPerformance, 1),
            'average_attendance' => round($avgAttendance, 1),
            'at_risk_count' => $atRiskCount,
            'top_subjects' => $topSubjects,
            'recommendations' => $this->getGlobalRecommendations($avgPerformance, $avgAttendance, $atRiskCount),
        ];
    }

    private function getGlobalRecommendations($avgPerf, $avgAtt, $atRisk)
    {
        $recs = [];
        if ($avgPerf < 60) $recs[] = 'تحتاج خطة تحسين شاملة لمستوى الطلاب';
        if ($avgAtt < 80) $recs[] = 'نسبة الحضور تحتاج تحسين - يفضل تفعيل نظام الإشعارات';
        if ($atRisk > 0) $recs[] = "يوجد {$atRisk} طالب يحتاجون متابعة خاصة";
        $recs[] = 'ينصح بعمل امتحانات دورية لقياس مستوى التقدم';
        return $recs;
    }
}
