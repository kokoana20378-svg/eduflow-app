<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceQrToken;
use App\Models\Group;
use App\Models\Student;
use App\Services\QrAttendanceService;
use App\Services\PdfExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student.user', 'group']);

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->orderBy('date', 'desc')->paginate(20);
        $groups = Group::all();

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
            'groups' => $groups,
            'filters' => $request->only(['date', 'group_id', 'status']),
        ]);
    }

    public function create()
    {
        $groups = Group::with('level')->get();
        return Inertia::render('Attendances/Create', ['groups' => $groups]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.group_id' => 'required|exists:groups,id',
            'records.*.date' => 'required|date',
            'records.*.status' => 'required|in:present,absent,late,excused',
            'records.*.check_in_time' => 'nullable|date_format:H:i',
            'records.*.notes' => 'nullable|string',
        ]);

        foreach ($validated['records'] as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'group_id' => $record['group_id'],
                    'date' => $record['date'],
                ],
                [
                    'status' => $record['status'],
                    'check_in_time' => $record['check_in_time'] ?? null,
                    'check_in_method' => 'manual',
                    'notes' => $record['notes'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function showByGroup(Group $group, string $date)
    {
        $attendances = Attendance::where('group_id', $group->id)
            ->whereDate('date', $date)
            ->with('student.user')
            ->get();

        $students = Student::where('group_id', $group->id)
            ->with('user')
            ->get()
            ->map(function ($student) use ($attendances) {
                $attendance = $attendances->firstWhere('student_id', $student->id);
                return [
                    'id' => $student->id,
                    'name' => $student->user?->name ?? $student->student_code,
                    'status' => $attendance?->status ?? null,
                ];
            });

        if (!\Inertia\Inertia::isInertiaRequest(request())) {
            return response()->json([
                'students' => $students,
                'attendances' => $attendances,
            ]);
        }

        return Inertia::render('Attendances/GroupSheet', [
            'group' => $group->load('level'),
            'date' => $date,
            'attendances' => $attendances,
            'students' => $students,
        ]);
    }

    public function generateQR(Group $group)
    {
        $token = app(QrAttendanceService::class)->generateToken($group, auth()->user());

        $qrUrl = route('attendance.scan.form', ['token' => $token->token]);
        $qrSvg = QrCode::format('svg')->size(300)->generate($qrUrl);

        return Inertia::render('Attendance/QRGenerate', [
            'qr_svg' => $qrSvg,
            'token' => $token->token,
            'group' => $group->load('level'),
            'expires_at' => $token->expires_at->toISOString(),
        ]);
    }

    public function scanQR(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|exists:attendance_qr_tokens,token',
            'student_id' => 'required|exists:students,id',
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $result = app(QrAttendanceService::class)->validateToken($validated['token'], $student);

        if (!$result['success']) {
            return redirect()->back()->with('error', $result['message']);
        }

        return redirect()->back()->with('success', $result['message']);
    }

    public function exportPdf(Request $request, Group $group)
    {
        $query = Attendance::where('group_id', $group->id)->with('student.user');
        if ($request->date_from) $query->whereDate('date', '>=', $request->date_from);
        if ($request->date_to) $query->whereDate('date', '<=', $request->date_to);
        $attendances = $query->get();
        return app(PdfExportService::class)->attendanceReport($attendances, $group, $request->date_from, $request->date_to);
    }

    public function scanForm(Request $request)
    {
        $token = $request->query('token');

        if ($token) {
            $qrToken = AttendanceQrToken::where('token', $token)
                ->with(['group.level', 'group.students.user'])
                ->first();

            if (!$qrToken) {
                return Inertia::render('Attendance/QRScan', [
                    'error' => 'رمز QR غير صالح',
                    'token' => null,
                ]);
            }

            $expired = $qrToken->expires_at < now() || !$qrToken->is_active;
            if ($expired) {
                return Inertia::render('Attendance/QRScan', [
                    'error' => 'رمز QR منتهي الصلاحية',
                    'token' => $token,
                    'group' => $qrToken->group->load('level'),
                    'expired' => true,
                ]);
            }

            $students = $qrToken->group->students()->with('user')->get()->map(function ($s) {
                return ['id' => $s->id, 'name' => $s->user?->name ?? $s->student_code];
            });

            return Inertia::render('Attendance/QRScan', [
                'token' => $token,
                'group' => $qrToken->group->load('level'),
                'students' => $students,
                'expires_at' => $qrToken->expires_at->toISOString(),
                'error' => null,
            ]);
        }

        return Inertia::render('Attendance/QRScan', [
            'token' => null,
            'error' => null,
        ]);
    }
}
