<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Student;
use App\Models\Group;
use App\Models\Exam;
use App\Models\Payment;
use App\Models\Attendance;
use Carbon\Carbon;

class PdfExportService
{
    public function studentList($students, $title = 'قائمة الطلاب')
    {
        $pdf = Pdf::loadView('pdfs.student-list', [
            'students' => $students,
            'title' => $title,
            'date' => Carbon::now()->format('Y/m/d')
        ]);
        $pdf->setPaper('A4', 'landscape');
        $pdf->setOptions(['defaultFont' => 'dejavu sans', 'isRtlEnabled' => true, 'isHtml5ParserEnabled' => true]);
        return $pdf->download("students-list-{$title}.pdf");
    }

    public function attendanceReport($attendances, $group, $dateFrom, $dateTo)
    {
        $pdf = Pdf::loadView('pdfs.attendance-report', [
            'attendances' => $attendances,
            'group' => $group,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'date' => Carbon::now()->format('Y/m/d')
        ]);
        $pdf->setPaper('A4', 'landscape');
        $pdf->setOptions(['defaultFont' => 'dejavu sans', 'isRtlEnabled' => true, 'isHtml5ParserEnabled' => true]);
        return $pdf->download("attendance-{$group->name}.pdf");
    }

    public function examResults($exam, $results)
    {
        $pdf = Pdf::loadView('pdfs.exam-results', [
            'exam' => $exam,
            'results' => $results,
            'date' => Carbon::now()->format('Y/m/d')
        ]);
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions(['defaultFont' => 'dejavu sans', 'isRtlEnabled' => true, 'isHtml5ParserEnabled' => true]);
        return $pdf->download("exam-{$exam->id}-results.pdf");
    }

    public function paymentReceipt(Payment $payment)
    {
        $pdf = Pdf::loadView('pdfs.payment-receipt', [
            'payment' => $payment,
            'date' => Carbon::now()->format('Y/m/d')
        ]);
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions(['defaultFont' => 'dejavu sans', 'isRtlEnabled' => true, 'isHtml5ParserEnabled' => true]);
        return $pdf->download("receipt-{$payment->receipt_number}.pdf");
    }

    public function reportCard(Student $student, $exams = [])
    {
        $pdf = Pdf::loadView('pdfs.report-card', [
            'student' => $student,
            'exams' => $exams,
            'date' => Carbon::now()->format('Y/m/d')
        ]);
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions(['defaultFont' => 'dejavu sans', 'isRtlEnabled' => true, 'isHtml5ParserEnabled' => true]);
        return $pdf->download("report-card-{$student->student_code}.pdf");
    }
}
