<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamResultController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AiController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'time' => now()->toIso8601String()]);
});

Route::get('/offline', function () {
    return response()->view('offline')->header('Cache-Control', 'public, max-age=86400');
})->name('offline');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Levels (admin only)
    Route::resource('levels', LevelController::class)->except(['show'])->middleware('role:admin');

    // Groups (admin, teacher)
    Route::resource('groups', GroupController::class)->except(['show'])->middleware('role:admin,teacher');

    // Students (admin, teacher)
    Route::get('/students/export/pdf', [StudentController::class, 'exportPdf'])->name('students.export-pdf');
    Route::resource('students', StudentController::class)->except(['show'])->middleware('role:admin,teacher');

    // Teachers (admin only)
    Route::resource('teachers', TeacherController::class)->except(['show'])->middleware('role:admin');

    // Attendance (admin, teacher)
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/create', [AttendanceController::class, 'create'])->name('attendance.create');
    Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
    Route::get('/attendance/group/{group}/{date?}', [AttendanceController::class, 'showByGroup'])->name('attendance.group');
    Route::get('/attendance/{group}/export-pdf', [AttendanceController::class, 'exportPdf'])->name('attendance.export-pdf');
    Route::get('/attendance/qr/{group}', [AttendanceController::class, 'generateQR'])->name('attendance.qr');
    Route::get('/attendance/scan', [AttendanceController::class, 'scanForm'])->name('attendance.scan.form');
    Route::post('/attendance/scan', [AttendanceController::class, 'scanQR'])->name('attendance.scan');

    // Exams (admin, teacher)
    Route::resource('exams', ExamController::class)->except(['show'])->middleware('role:admin,teacher');
    Route::get('/exams/{exam}/results', [ExamResultController::class, 'index'])->name('exam-results.index');
    Route::get('/exams/{exam}/results/create', [ExamResultController::class, 'create'])->name('exam-results.create');
    Route::post('/exams/{exam}/results', [ExamResultController::class, 'store'])->name('exam-results.store');
    Route::get('/exams/{exam}/results/export-pdf', [ExamResultController::class, 'exportPdf'])->name('exam-results.export-pdf');
    Route::get('/exam-results/{examResult}/edit', [ExamResultController::class, 'edit'])->name('exam-results.edit');
    Route::put('/exam-results/{examResult}', [ExamResultController::class, 'update'])->name('exam-results.update');

    // Fees (admin)
    Route::resource('fees', FeeController::class)->except(['show'])->middleware('role:admin');

    // Payments (admin, teacher)
    Route::get('/payments/{payment}/receipt-pdf', [PaymentController::class, 'receiptPdf'])->name('payments.receipt-pdf');
    Route::resource('payments', PaymentController::class)->except(['edit', 'update', 'destroy'])->middleware('role:admin,teacher');

    // Notifications (admin, teacher)
    Route::resource('notifications', NotificationController::class)->only(['index', 'create', 'store', 'destroy'])->middleware('role:admin,teacher');
    Route::post('/notifications/{notification}/send-whatsapp', [NotificationController::class, 'sendWhatsApp'])->name('notifications.send-whatsapp');
    Route::post('/notifications/{notification}/send-email', [NotificationController::class, 'sendEmail'])->name('notifications.send-email');
    Route::post('/notifications/bulk', [NotificationController::class, 'sendBulk'])->name('notifications.bulk');
    Route::get('/notifications/bulk/create', [NotificationController::class, 'bulkForm'])->name('notifications.bulk-form');

    // Parents (admin)
    Route::resource('parents', ParentController::class)->middleware('role:admin');

    // AI routes
    Route::middleware('role:admin,teacher')->group(function () {
        Route::get('/ai', [AiController::class, 'index'])->name('ai.index');
        Route::get('/ai/student/{student}', [AiController::class, 'analyzeStudent'])->name('ai.student');
        Route::get('/ai/group-analysis', [AiController::class, 'analyzeGroup'])->name('ai.group');
        Route::get('/ai/questions', [AiController::class, 'questionForm'])->name('ai.questions');
        Route::post('/ai/questions/generate', [AiController::class, 'generateQuestions'])->name('ai.questions.generate');
    });
});

require __DIR__.'/auth.php';
