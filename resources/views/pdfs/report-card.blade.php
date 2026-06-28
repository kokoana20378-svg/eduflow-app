<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>كشف نقاط - {{ $student->student_code }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'dejavu sans', sans-serif; font-size: 12px; color: #333; padding: 25px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #2563eb; padding-bottom: 15px; }
        .header h1 { font-size: 22px; color: #2563eb; margin-bottom: 5px; }
        .header .date-info { font-size: 11px; color: #999; margin-top: 5px; }
        .student-info { display: flex; gap: 20px; margin-bottom: 20px; padding: 15px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe; }
        .student-info .info-item { flex: 1; }
        .student-info .info-item .label { font-size: 10px; color: #666; }
        .student-info .info-item .value { font-size: 14px; font-weight: bold; color: #1e40af; }
        .section-title { font-size: 16px; font-weight: bold; color: #2563eb; margin: 20px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #2563eb; color: #fff; padding: 10px 8px; font-size: 12px; text-align: center; }
        td { padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .grade-A { color: #059669; font-weight: bold; }
        .grade-B { color: #16a34a; font-weight: bold; }
        .grade-C { color: #ca8a04; font-weight: bold; }
        .grade-D { color: #d97706; font-weight: bold; }
        .grade-E { color: #ea580c; font-weight: bold; }
        .grade-F { color: #dc2626; font-weight: bold; }
        .overall-grade { text-align: center; margin: 20px 0; padding: 15px; background: #f0fdf4; border: 2px solid #86efac; border-radius: 10px; }
        .overall-grade .grade-value { font-size: 36px; font-weight: bold; color: #059669; }
        .overall-grade .grade-label { font-size: 14px; color: #666; }
        .attendance-summary { display: flex; gap: 15px; margin: 15px 0; justify-content: center; }
        .attendance-box { padding: 10px 15px; border-radius: 8px; text-align: center; min-width: 80px; }
        .attendance-box.present { background: #d1fae5; color: #065f46; }
        .attendance-box.absent { background: #fecaca; color: #991b1b; }
        .attendance-box.excused { background: #fef3c7; color: #92400e; }
        .attendance-box.late { background: #fed7aa; color: #9a3412; }
        .attendance-box .count { font-size: 18px; font-weight: bold; }
        .attendance-box .label { font-size: 10px; }
        .remarks { margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; min-height: 80px; }
        .remarks .label { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; }
        .remarks .content { font-size: 13px; color: #333; line-height: 1.8; }
        .footer { position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 8px; }
        .page-number:before { content: "صفحة " counter(page); }
        .signatures { display: flex; justify-content: space-between; margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; }
        .signature-field { text-align: center; min-width: 150px; }
        .signature-field .line { border-bottom: 1px solid #333; margin: 5px 0 8px; height: 25px; }
        .signature-field .label { font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name', 'مؤسسة تعليمية') }}</h1>
        <div>كشف نقاط الطالب</div>
        <div class="date-info">تاريخ الطباعة: {{ $date }}</div>
    </div>

    <div class="student-info">
        <div class="info-item">
            <div class="label">اسم الطالب</div>
            <div class="value">{{ $student->user->name ?? $student->student_code }}</div>
        </div>
        <div class="info-item">
            <div class="label">كود الطالب</div>
            <div class="value">{{ $student->student_code }}</div>
        </div>
        <div class="info-item">
            <div class="label">المستوى</div>
            <div class="value">{{ $student->level->name ?? '-' }}</div>
        </div>
        <div class="info-item">
            <div class="label">المجموعة</div>
            <div class="value">{{ $student->group->name ?? '-' }}</div>
        </div>
    </div>

    @if(count($exams) > 0)
    <div class="section-title">نتائج الامتحانات</div>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>الامتحان</th>
                <th>المادة</th>
                <th>التاريخ</th>
                <th>الدرجة</th>
                <th>النسبة %</th>
                <th>التقدير</th>
            </tr>
        </thead>
        <tbody>
            @foreach($exams as $index => $exam)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $exam->exam->title ?? $exam->exam_id }}</td>
                <td>{{ $exam->exam->subject->name ?? '-' }}</td>
                <td>{{ $exam->exam->date ?? '-' }}</td>
                <td>{{ $exam->marks_obtained }} / {{ $exam->exam->total_marks ?? 0 }}</td>
                <td>{{ number_format($exam->percentage, 1) }}%</td>
                <td class="grade-{{ $exam->grade }}">{{ $exam->grade }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @php
        $avgPercentage = $exams->avg('percentage');
        $overallGrade = match(true) {
            $avgPercentage >= 90 => 'A',
            $avgPercentage >= 80 => 'B',
            $avgPercentage >= 70 => 'C',
            $avgPercentage >= 60 => 'D',
            $avgPercentage >= 50 => 'E',
            default => 'F',
        };
    @endphp

    <div class="overall-grade">
        <div class="grade-label">المعدل العام</div>
        <div class="grade-value">{{ number_format($avgPercentage, 1) }}%</div>
        <div style="font-size: 18px; color: #059669; font-weight: bold;">تقدير: {{ $overallGrade }}</div>
    </div>
    @endif

    @php
        $attendances = $student->attendances ?? collect();
        $presentCount = $attendances->where('status', 'present')->count();
        $absentCount = $attendances->where('status', 'absent')->count();
        $excusedCount = $attendances->where('status', 'excused')->count();
        $lateCount = $attendances->where('status', 'late')->count();
    @endphp

    @if($attendances->count() > 0)
    <div class="section-title">ملخص الحضور</div>
    <div class="attendance-summary">
        <div class="attendance-box present">
            <div class="count">{{ $presentCount }}</div>
            <div class="label">حاضر</div>
        </div>
        <div class="attendance-box absent">
            <div class="count">{{ $absentCount }}</div>
            <div class="label">غائب</div>
        </div>
        <div class="attendance-box excused">
            <div class="count">{{ $excusedCount }}</div>
            <div class="label">معذر</div>
        </div>
        <div class="attendance-box late">
            <div class="count">{{ $lateCount }}</div>
            <div class="label">متأخر</div>
        </div>
    </div>
    @endif

    <div class="section-title">ملاحظات المدرس</div>
    <div class="remarks">
        <div class="content">
            .................................................................................<br>
            .................................................................................<br>
            .................................................................................
        </div>
    </div>

    <div class="signatures">
        <div class="signature-field">
            <div class="line"></div>
            <div class="label">توقيع المدرس</div>
        </div>
        <div class="signature-field">
            <div class="line"></div>
            <div class="label">توقيع ولي الأمر</div>
        </div>
        <div class="signature-field">
            <div class="line"></div>
            <div class="label">ختم المؤسسة</div>
        </div>
    </div>

    <div class="footer">
        <span class="page-number"></span>
    </div>
</body>
</html>
