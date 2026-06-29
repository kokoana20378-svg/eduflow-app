<?php
namespace Database\Seeders;

use App\Models\User;
use App\Models\Level;
use App\Models\Group;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\ParentModel;
use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Fee;
use App\Models\Payment;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // ========== ADMIN ==========
        $admin = User::create([
            'name' => 'أحمد علي - مدير النظام',
            'email' => 'admin@eduflow.local',
            'password' => $password,
            'role' => 'admin',
            'phone' => '01234567890',
            'is_active' => true,
        ]);

        // ========== LEVELS ==========
        $levelNames = [
            ['name' => 'الأول الإعدادي', 'code' => 'P1', 'order' => 1],
            ['name' => 'الثاني الإعدادي', 'code' => 'P2', 'order' => 2],
            ['name' => 'الثالث الإعدادي', 'code' => 'P3', 'order' => 3],
            ['name' => 'الأول الثانوي', 'code' => 'S1', 'order' => 4],
            ['name' => 'الثاني الثانوي', 'code' => 'S2', 'order' => 5],
            ['name' => 'الثالث الثانوي', 'code' => 'S3', 'order' => 6],
        ];
        foreach ($levelNames as $i => $l) {
            Level::create($l);
        }
        $levels = Level::all();

        // ========== SUBJECTS ==========
        $subjectNames = ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية'];
        foreach ($levels as $level) {
            foreach ($subjectNames as $subj) {
                Subject::create([
                    'name' => $subj,
                    'level_id' => $level->id,
                    'code' => $level->code . '-' . substr($subj, 0, 4),
                ]);
            }
        }

        // ========== TEACHERS (3 teachers) ==========
        $teacherData = [
            ['name' => 'محمد حسن - مدرس رياضيات', 'email' => 'teacher1@eduflow.local', 'phone' => '01111111111', 'specialization' => 'الرياضيات', 'qualification' => 'بكالوريوس تربية رياضيات'],
            ['name' => 'سارة أحمد - مدرسة علوم', 'email' => 'teacher2@eduflow.local', 'phone' => '01111111112', 'specialization' => 'العلوم', 'qualification' => 'بكالوريوس علوم'],
            ['name' => 'خالد عمر - مدرس لغة عربية', 'email' => 'teacher3@eduflow.local', 'phone' => '01111111113', 'specialization' => 'اللغة العربية', 'qualification' => 'ليسانس آداب'],
        ];
        $teachers = [];
        foreach ($teacherData as $i => $td) {
            $user = User::create([
                'name' => $td['name'],
                'email' => $td['email'],
                'password' => $password,
                'role' => 'teacher',
                'phone' => $td['phone'],
                'is_active' => true,
            ]);
            $teachers[] = Teacher::create([
                'user_id' => $user->id,
                'teacher_code' => 'TCH-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'specialization' => $td['specialization'],
                'qualification' => $td['qualification'],
                'hire_date' => '2024-09-01',
            ]);
        }

        // ========== GROUPS (6 groups, one per level) ==========
        $groupNames = ['مجموعة A', 'مجموعة B', 'مجموعة C', 'مجموعة D', 'مجموعة E', 'مجموعة F'];
        $groups = [];
        foreach ($levels as $i => $level) {
            $groups[] = Group::create([
                'name' => $groupNames[$i],
                'level_id' => $level->id,
                'teacher_id' => $teachers[$i % 3]->id,
                'max_students' => 25,
                'room' => 'غرفة ' . ($i + 101),
                'schedule' => 'السبت - الأربعاء 10:00 - 12:00',
            ]);
        }

        // ========== STUDENTS (18 students, 3 per group) ==========
        $studentData = [
            ['name' => 'أحمد محمد', 'guardian' => 'محمد أحمد'],
            ['name' => 'علي حسن', 'guardian' => 'حسن علي'],
            ['name' => 'فاطمة عمر', 'guardian' => 'عمر فاطمة'],
            ['name' => 'محمود خالد', 'guardian' => 'خالد محمود'],
            ['name' => 'نورا سامي', 'guardian' => 'سامي نورا'],
            ['name' => 'يوسف ابراهيم', 'guardian' => 'ابراهيم يوسف'],
            ['name' => 'سارة عبدالله', 'guardian' => 'عبدالله سارة'],
            ['name' => 'كريم حسن', 'guardian' => 'حسن كريم'],
            ['name' => 'مريم عادل', 'guardian' => 'عادل مريم'],
            ['name' => 'عمر حسام', 'guardian' => 'حسام عمر'],
            ['name' => 'لبنى محمد', 'guardian' => 'محمد لبنى'],
            ['name' => 'زياد أحمد', 'guardian' => 'أحمد زياد'],
            ['name' => 'هند علاء', 'guardian' => 'علاء هند'],
            ['name' => 'عبدالرحمن نور', 'guardian' => 'نور عبدالرحمن'],
            ['name' => 'ملك تامر', 'guardian' => 'تامر ملك'],
            ['name' => 'آدم حسين', 'guardian' => 'حسين آدم'],
            ['name' => 'جنى وليد', 'guardian' => 'وليد جنى'],
            ['name' => 'إياد محسن', 'guardian' => 'محسن إياد'],
        ];
        $students = [];
        $si = 0;
        foreach ($groups as $g) {
            for ($j = 0; $j < 3; $j++) {
                $sd = $studentData[$si];
                $user = User::create([
                    'name' => $sd['name'],
                    'email' => 'student' . ($si + 1) . '@eduflow.local',
                    'password' => $password,
                    'role' => 'student',
                    'phone' => '012' . str_pad($si + 1, 8, '0', STR_PAD_LEFT),
                    'is_active' => true,
                ]);
                $students[] = Student::create([
                    'user_id' => $user->id,
                    'student_code' => 'STD-' . str_pad($si + 1, 4, '0', STR_PAD_LEFT),
                    'guardian_name' => $sd['guardian'],
                    'guardian_phone' => '012' . str_pad(100 + $si, 8, '0', STR_PAD_LEFT),
                    'level_id' => $g->level_id,
                    'group_id' => $g->id,
                    'birth_date' => Carbon::now()->subYears(14 + ($si % 4))->subDays($si * 10),
                    'address' => 'شارع ' . ['التحرير', 'الفيوم', 'المعادي', 'المهندسين', 'الزمالك', 'مدينة نصر'][$si % 6],
                    'enrolled_at' => '2025-09-01',
                ]);
                $si++;
            }
        }

        // ========== PARENTS (create from guardian names) ==========
        $existingGuardians = [];
        foreach ($students as $s) {
            if (!in_array($s->guardian_name, $existingGuardians)) {
                $existingGuardians[] = $s->guardian_name;
                $pi = count($existingGuardians);
                $user = User::create([
                    'name' => $s->guardian_name,
                    'email' => 'parent' . $pi . '@eduflow.local',
                    'password' => $password,
                    'role' => 'parent',
                    'phone' => $s->guardian_phone,
                    'is_active' => true,
                ]);
                $parent = ParentModel::create(['user_id' => $user->id]);
                $s->parents()->attach($parent->id, ['primary' => true]);
            }
        }

        // ========== ATTENDANCE (last 10 days) ==========
        $statuses = ['present', 'present', 'present', 'present', 'absent', 'present', 'present', 'late', 'present', 'excused', 'present', 'present'];
        foreach ($groups as $group) {
            foreach ($group->students as $student) {
                for ($d = 9; $d >= 0; $d--) {
                    $date = Carbon::now()->subDays($d);
                    if (in_array($date->dayOfWeek, [5, 6])) continue;
                    $randStatus = $statuses[array_rand($statuses)];
                    Attendance::create([
                        'student_id' => $student->id,
                        'group_id' => $group->id,
                        'date' => $date->format('Y-m-d'),
                        'status' => $randStatus,
                        'check_in_time' => $randStatus === 'present' || $randStatus === 'late' ? '08:' . str_pad(rand(0, 59), 2, '0') . ':00' : null,
                        'check_in_method' => 'manual',
                    ]);
                }
            }
        }

        // ========== EXAMS (2 per group) ==========
        $examTypes = ['quiz', 'midterm'];
        $subjects = Subject::all()->groupBy('level_id');
        foreach ($groups as $group) {
            $groupSubjects = $subjects[$group->level_id] ?? Subject::where('level_id', $group->level_id)->get();
            foreach ($examTypes as $ei => $type) {
                $subject = $groupSubjects[$ei % count($groupSubjects)];
                $exam = Exam::create([
                    'title' => $type === 'quiz' ? 'اختبار قصير' : 'امتحان منتصف الفصل',
                    'description' => $type === 'quiz' ? 'اختبار سريع على الدروس السابقة' : 'امتحان شامل لمنتصف الفصل الدراسي',
                    'level_id' => $group->level_id,
                    'group_id' => $group->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $group->teacher_id,
                    'type' => $type,
                    'total_marks' => $type === 'quiz' ? 20 : 50,
                    'date' => Carbon::now()->subDays(rand(5, 20))->format('Y-m-d'),
                    'duration' => $type === 'quiz' ? 30 : 60,
                ]);
                foreach ($group->students as $student) {
                    $marks = rand(10, $exam->total_marks);
                    $percentage = round(($marks / $exam->total_marks) * 100, 1);
                    ExamResult::create([
                        'exam_id' => $exam->id,
                        'student_id' => $student->id,
                        'marks_obtained' => $marks,
                        'percentage' => $percentage,
                        'grade' => $percentage >= 90 ? 'ممتاز' : ($percentage >= 80 ? 'جيد جداً' : ($percentage >= 65 ? 'جيد' : ($percentage >= 50 ? 'مقبول' : 'ضعيف'))),
                    ]);
                }
            }
        }

        // ========== FEES ==========
        $feesData = [
            ['title' => 'مصروفات دراسية - الفصل الأول', 'amount' => 1500, 'level_id' => null],
            ['title' => 'مصروفات دراسية - الفصل الثاني', 'amount' => 1500, 'level_id' => null],
            ['title' => 'رسوم امتحانات', 'amount' => 300, 'level_id' => null],
            ['title' => 'رسوم مواد تعليمية', 'amount' => 200, 'level_id' => null],
        ];
        foreach ($feesData as $fd) {
            Fee::create($fd);
        }

        // ========== PAYMENTS ==========
        foreach ($students as $i => $student) {
            if ($i % 3 != 0) {
                $fee = Fee::inRandomOrder()->first();
                Payment::create([
                    'student_id' => $student->id,
                    'fee_id' => $fee->id,
                    'amount' => $fee->amount,
                    'payment_date' => Carbon::now()->subDays(rand(1, 30))->format('Y-m-d'),
                    'payment_method' => ['cash', 'bank_transfer', 'online', 'cheque'][array_rand(['cash', 'bank_transfer', 'online', 'cheque'])],
                    'receipt_number' => 'RCP-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                    'notes' => $i % 2 == 0 ? 'تم الدفع كاملاً' : 'دفعة أولى',
                ]);
            }
        }

        // ========== NOTIFICATIONS ==========
        $notificationTypes = ['whatsapp', 'email', 'in_app'];
        foreach ($students as $i => $student) {
            if ($i < 5) {
                Notification::create([
                    'type' => $notificationTypes[$i % 3],
                    'recipient_type' => 'student',
                    'recipient_id' => $student->id,
                    'title' => 'تذكير بالحضور',
                    'message' => 'عزيزي الطالب، يرجى الالتزام بمواعيد الحضور غداً الساعة 9 صباحاً.',
                    'status' => 'sent',
                    'sent_at' => Carbon::now()->subDays(rand(0, 5)),
                ]);
            }
        }
    }
}
