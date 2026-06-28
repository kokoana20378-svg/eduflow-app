<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>نتائج الامتحان - {{ $exam->title }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'dejavu sans', sans-serif; font-size: 12px; color: #333; padding: 20px; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #7c3aed; padding-bottom: 15px; }
        .header h1 { font-size: 22px; color: #7c3aed; margin-bottom: 5px; }
        .header .exam-info { font-size: 13px; color: #666; margin-top: 5px; }
        .header .exam-info span { margin: 0 10px; }
        .header .date-info { font-size: 11px; color: #999; margin-top: 5px; }
        .exam-details { display: flex; justify-content: center; gap: 20px; margin: 15px 0; padding: 10px; background: #f5f3ff; border-radius: 8px; }
        .exam-details .detail-item { text-align: center; }
        .exam-details .detail-item .label { font-size: 10px; color: #666; }
        .exam-details .detail-item .value { font-size: 14px; font-weight: bold; color: #5b21b6; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #7c3aed; color: #fff; padding: 10px 8px; font-size: 12px; text-align: center; }
        td { padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .grade-A { color: #059669; font-weight: bold; }
        .grade-B { color: #16a34a; font-weight: bold; }
        .grade-C { color: #ca8a04; font-weight: bold; }
        .grade-D { color: #d97706; font-weight: bold; }
        .grade-E { color: #ea580c; font-weight: bold; }
        .grade-F { color: #dc2626; font-weight: bold; }
        .summary { margin-top: 20px; display: flex; gap: 15px; justify-content: center; }
        .summary-box { padding: 12px 20px; border-radius: 8px; text-align: center; min-width: 120px; background: #f5f3ff; border: 1px solid #ddd; }
        .summary-box .count { font-size: 20px; font-weight: bold; color: #5b21b6; }
        .summary-box .label { font-size: 11px; color: #666; }
        .footer { position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 8px; }
        .page-number:before { content: "صفحة " counter(page); }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name', 'مؤسسة تعليمية') }}</h1>
        <div class="exam-info">
            <span>الامتحان: {{ $exam->title }}</span>
            <span>|</span>
            <span>النوع: {{ $exam->type == 'midterm' ? 'نصفي' : ($exam->type == 'final' ? 'نهائي' : ($exam->type == 'quiz' ? 'اختبار قصير' : $exam->type)) }}</span>
            <span>|</span>
            <span>التاريخ: {{ $exam->date }}</span>
        </div>
        <div class="date-info">تاريخ التقرير: {{ $date }}</div>
    </div>

    <div class="exam-details">
        <div class="detail-item">
            <div class="label">المادة</div>
            <div class="value">{{ $exam->subject->name ?? '-' }}</div>
        </div>
        <div class="detail-item">
            <div class="label">المستوى</div>
            <div class="value">{{ $exam->level->name ?? '-' }}</div>
        </div>
        <div class="detail-item">
            <div class="label">المجموعة</div>
            <div class="value">{{ $exam->group->name ?? 'الكل' }}</div>
        </div>
        <div class="detail-item">
            <div class="label">الدرجة العظمى</div>
            <div class="value">{{ $exam->total_marks }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>اسم الطالب</th>
                <th>الدرجة</th>
                <th>النسبة %</th>
                <th>التقدير</th>
            </tr>
        </thead>
        <tbody>
            @php
                $highest = $results->max('marks_obtained');
                $lowest = $results->min('marks_obtained');
                $average = $results->avg('marks_obtained');
            @endphp
            @foreach($results as $index => $result)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $result->student->user->name ?? $result->student->student_code }}</td>
                <td>{{ $result->marks_obtained }} / {{ $exam->total_marks }}</td>
                <td>{{ number_format($result->percentage, 1) }}%</td>
                <td class="grade-{{ $result->grade }}">{{ $result->grade }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-box">
            <div class="count">{{ number_format($highest, 1) }}</div>
            <div class="label">أعلى درجة</div>
        </div>
        <div class="summary-box">
            <div class="count">{{ number_format($lowest, 1) }}</div>
            <div class="label">أدنى درجة</div>
        </div>
        <div class="summary-box">
            <div class="count">{{ number_format($average, 1) }}</div>
            <div class="label">المتوسط</div>
        </div>
        <div class="summary-box">
            <div class="count">{{ $results->count() }}</div>
            <div class="label">عدد الطلاب</div>
        </div>
    </div>

    <div class="footer">
        <span class="page-number"></span>
    </div>
</body>
</html>
