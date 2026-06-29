<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Group;
use App\Models\Level;
use App\Models\Payment;
use App\Models\Attendance;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $todayAttendance = Attendance::whereDate('date', today());
        $totalToday = $todayAttendance->count();
        $presentToday = (clone $todayAttendance)->where('status', 'present')->count();
        $absentToday = (clone $todayAttendance)->where('status', 'absent')->count();

        $stats = [
            'total_students' => Student::count(),
            'total_teachers' => Teacher::count(),
            'total_groups' => Group::count(),
            'total_levels' => Level::count(),
            'pending_payments' => Payment::where('payment_date', '<', now()->subDays(30))->count(),
            'today_attendance' => [
                'total' => $totalToday,
                'present' => $presentToday,
                'absent' => $absentToday,
            ],
        ];

        return Inertia::render('Dashboard/Index', ['stats' => $stats]);
    }
}
