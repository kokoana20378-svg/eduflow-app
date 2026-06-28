<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تقرير الحضور - {{ $group->name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'dejavu sans', sans-serif; font-size: 12px; color: #333; padding: 20px; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #059669; padding-bottom: 15px; }
        .header h1 { font-size: 22px; color: #059669; margin-bottom: 5px; }
        .header .subtitle { font-size: 14px; color: #666; }
        .header .date-info { font-size: 11px; color: #999; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #059669; color: #fff; padding: 10px 8px; font-size: 12px; text-align: center; }
        td { padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .status-present { color: #059669; font-weight: bold; }
        .status-absent { color: #dc2626; font-weight: bold; }
        .status-excused { color: #d97706; font-weight: bold; }
        .status-late { color: #ea580c; font-weight: bold; }
        .summary { margin-top: 20px; display: flex; gap: 15px; justify-content: center; }
        .summary-box { padding: 12px 20px; border-radius: 8px; text-align: center; min-width: 100px; }
        .summary-box.present { background-color: #d1fae5; color: #065f46; }
        .summary-box.absent { background-color: #fecaca; color: #991b1b; }
        .summary-box.excused { background-color: #fef3c7; color: #92400e; }
        .summary-box.late { background-color: #fed7aa; color: #9a3412; }
        .summary-box .count { font-size: 22px; font-weight: bold; }
        .summary-box .label { font-size: 11px; }
        .footer { position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 8px; }
        .page-number:before { content: "صفحة " counter(page); }
        .status-label { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 11px; }
        .status-label.present { background-color: #d1fae5; color: #065f46; }
        .status-label.absent { background-color: #fecaca; color: #991b1b; }
        .status-label.excused { background-color: #fef3c7; color: #92400e; }
        .status-label.late { background-color: #fed7aa; color: #9a3412; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name', 'مؤسسة تعليمية') }}</h1>
        <div class="subtitle">تقرير الحضور - {{ $group->name }}</div>
        <div class="date-info">
            من: {{ $date_from ?? 'بداية' }} إلى: {{ $date_to ?? 'نهاية' }}
            &nbsp;|&nbsp; تاريخ التقرير: {{ $date }}
        </div>
    </div>

    @php
        $totalPresent = $attendances->where('status', 'present')->count();
        $totalAbsent = $attendances->where('status', 'absent')->count();
        $totalExcused = $attendances->where('status', 'excused')->count();
        $totalLate = $attendances->where('status', 'late')->count();
        $grouped = $attendances->groupBy('student_id');
    @endphp

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>اسم الطالب</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>وقت الدخول</th>
                <th>طريقة التسجيل</th>
            </tr>
        </thead>
        <tbody>
            @foreach($grouped as $studentId => $records)
                @php $first = $records->first(); @endphp
                @foreach($records as $i => $attendance)
                <tr>
                    @if($i === 0)
                    <td rowspan="{{ $records->count() }}" style="vertical-align: middle; font-weight: bold;">{{ $loop->parent->iteration }}</td>
                    <td rowspan="{{ $records->count() }}" style="vertical-align: middle;">{{ $attendance->student->user->name ?? $attendance->student->student_code }}</td>
                    @endif
                    <td>{{ $attendance->date }}</td>
                    <td>
                        <span class="status-label {{ $attendance->status }}">
                            @switch($attendance->status)
                                @case('present') حاضر @break
                                @case('absent') غائب @break
                                @case('excused') معذر @break
                                @case('late') متأخر @break
                                @default {{ $attendance->status }}
                            @endswitch
                        </span>
                    </td>
                    <td>{{ $attendance->check_in_time ?? '-' }}</td>
                    <td>
                        @switch($attendance->check_in_method)
                            @case('manual') يدوي @break
                            @case('qr') رمز QR @break
                            @default {{ $attendance->check_in_method ?? '-' }}
                        @endswitch
                    </td>
                </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-box present">
            <div class="count">{{ $totalPresent }}</div>
            <div class="label">حاضر</div>
        </div>
        <div class="summary-box absent">
            <div class="count">{{ $totalAbsent }}</div>
            <div class="label">غائب</div>
        </div>
        <div class="summary-box excused">
            <div class="count">{{ $totalExcused }}</div>
            <div class="label">معذر</div>
        </div>
        <div class="summary-box late">
            <div class="count">{{ $totalLate }}</div>
            <div class="label">متأخر</div>
        </div>
    </div>

    <div class="footer">
        <span class="page-number"></span>
    </div>
</body>
</html>
