<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'dejavu sans', sans-serif; font-size: 12px; color: #333; padding: 20px; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #1a56db; padding-bottom: 15px; }
        .header h1 { font-size: 22px; color: #1a56db; margin-bottom: 5px; }
        .header .school-name { font-size: 16px; color: #666; }
        .header .date-info { font-size: 11px; color: #999; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #1a56db; color: #fff; padding: 10px 8px; font-size: 12px; text-align: center; }
        td { padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f1f5f9; }
        .footer { position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 8px; }
        .page-number:before { content: "صفحة " counter(page); }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name', 'مؤسسة تعليمية') }}</h1>
        <div class="school-name">{{ $title }}</div>
        <div class="date-info">تاريخ التقرير: {{ $date }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الكود</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>ولي الأمر</th>
                <th>المجموعة</th>
                <th>المستوى</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $student)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $student->user->name ?? $student->student_code }}</td>
                <td>{{ $student->student_code }}</td>
                <td>{{ $student->user->email ?? '-' }}</td>
                <td>{{ $student->user->phone ?? '-' }}</td>
                <td>{{ $student->guardian_name ?? '-' }}</td>
                <td>{{ $student->group->name ?? '-' }}</td>
                <td>{{ $student->level->name ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <span class="page-number"></span>
    </div>
</body>
</html>
