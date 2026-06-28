<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\AttendanceQrToken;
use App\Models\Group;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Str;

class QrAttendanceService
{
    public function generateToken(Group $group, User $teacher): AttendanceQrToken
    {
        $existing = AttendanceQrToken::where('group_id', $group->id)
            ->where('date', now()->toDateString())
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->first();

        if ($existing) {
            $existing->update(['is_active' => false]);
        }

        return AttendanceQrToken::create([
            'group_id' => $group->id,
            'teacher_id' => $teacher->teacher?->id,
            'token' => (string) Str::uuid(),
            'date' => now()->toDateString(),
            'expires_at' => now()->addHour(),
            'is_active' => true,
        ]);
    }

    public function validateToken(string $token, Student $student): array
    {
        $qrToken = AttendanceQrToken::where('token', $token)
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->first();

        if (!$qrToken) {
            return ['success' => false, 'message' => 'رمز QR غير صالح أو منتهي الصلاحية'];
        }

        if ($student->group_id !== $qrToken->group_id) {
            return ['success' => false, 'message' => 'الطالب ليس في هذه المجموعة'];
        }

        $existing = Attendance::where('student_id', $student->id)
            ->where('group_id', $qrToken->group_id)
            ->whereDate('date', $qrToken->date)
            ->first();

        if ($existing) {
            return ['success' => false, 'message' => 'تم تسجيل حضور هذا الطالب مسبقاً'];
        }

        Attendance::create([
            'student_id' => $student->id,
            'group_id' => $qrToken->group_id,
            'date' => $qrToken->date,
            'status' => 'present',
            'check_in_time' => now()->format('H:i:s'),
            'check_in_method' => 'qr',
        ]);

        return ['success' => true, 'message' => 'تم تسجيل الحضور بنجاح'];
    }

    public function getTokenStatus(string $token): ?AttendanceQrToken
    {
        return AttendanceQrToken::where('token', $token)
            ->with(['group.level', 'teacher.user'])
            ->first();
    }
}
