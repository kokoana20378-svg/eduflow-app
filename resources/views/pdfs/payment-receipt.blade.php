<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إيصال دفع - {{ $payment->receipt_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'dejavu sans', sans-serif; font-size: 13px; color: #333; padding: 30px; }
        .receipt { max-width: 700px; margin: 0 auto; border: 2px solid #1e3a5f; border-radius: 10px; padding: 30px; }
        .header { text-align: center; border-bottom: 2px dashed #1e3a5f; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { font-size: 24px; color: #1e3a5f; margin-bottom: 5px; }
        .header .school-name { font-size: 14px; color: #666; }
        .receipt-title { text-align: center; font-size: 18px; font-weight: bold; color: #1e3a5f; margin-bottom: 20px; padding: 8px; background: #e8f0fe; border-radius: 5px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 8px 5px; font-size: 13px; }
        .info-table .label { font-weight: bold; color: #1e3a5f; width: 35%; }
        .info-table .value { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .amount-box { text-align: center; margin: 20px 0; padding: 15px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; }
        .amount-box .amount { font-size: 28px; font-weight: bold; color: #059669; }
        .amount-box .currency { font-size: 16px; color: #059669; }
        .amount-words { text-align: center; font-size: 14px; color: #666; margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
        .amount-words strong { color: #333; }
        .signatures { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        .signature-field { text-align: center; min-width: 150px; }
        .signature-field .line { border-bottom: 1px solid #333; margin: 5px 0 10px; height: 30px; }
        .signature-field .label { font-size: 11px; color: #666; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #999; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80px; color: rgba(0,0,0,0.03); font-weight: bold; pointer-events: none; z-index: -1; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="watermark">مدفوع</div>

        <div class="header">
            <h1>{{ config('app.name', 'مؤسسة تعليمية') }}</h1>
            <div class="school-name">إيصال دفع رسمي</div>
        </div>

        <div class="receipt-title">إيصال رقم: {{ $payment->receipt_number }}</div>

        <table class="info-table">
            <tr>
                <td class="label">تاريخ الإيصال:</td>
                <td class="value">{{ $payment->payment_date }}</td>
                <td class="label">تاريخ الطباعة:</td>
                <td class="value">{{ $date }}</td>
            </tr>
            <tr>
                <td class="label">اسم الطالب:</td>
                <td class="value">{{ $payment->student->user->name ?? $payment->student->student_code }}</td>
                <td class="label">كود الطالب:</td>
                <td class="value">{{ $payment->student->student_code }}</td>
            </tr>
            <tr>
                <td class="label">الرسوم:</td>
                <td class="value">{{ $payment->fee->name ?? '-' }}</td>
                <td class="label">طريقة الدفع:</td>
                <td class="value">
                    @switch($payment->payment_method)
                        @case('cash') نقدي @break
                        @case('bank_transfer') تحويل بنكي @break
                        @case('card') بطاقة @break
                        @case('check') شيك @break
                        @default {{ $payment->payment_method }}
                    @endswitch
                </td>
            </tr>
            @if($payment->notes)
            <tr>
                <td class="label">ملاحظات:</td>
                <td class="value" colspan="3">{{ $payment->notes }}</td>
            </tr>
            @endif
        </table>

        <div class="amount-box">
            <div class="amount">{{ number_format($payment->amount, 2) }} <span class="currency">د.ل</span></div>
        </div>

        @php
            $amountWords = function($num) {
                if ($num == 0) return 'صفر';
                $units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
                $teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
                $tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
                $hundreds = ['', 'مئة', 'مئتان', 'ثلاث مئة', 'أربع مئة', 'خمس مئة', 'ست مئة', 'سبع مئة', 'ثمان مئة', 'تسع مئة'];

                $intPart = floor($num);
                $words = '';

                if ($intPart >= 1000) {
                    $thousands = floor($intPart / 1000);
                    $words .= ($thousands == 1 ? 'ألف' : ($thousands == 2 ? 'ألفان' : $units[$thousands] . ' آلاف')) . ' ';
                    $intPart = $intPart % 1000;
                }

                if ($intPart >= 100) {
                    $h = floor($intPart / 100);
                    $words .= $hundreds[$h] . ' ';
                    $intPart = $intPart % 100;
                }

                if ($intPart >= 20) {
                    $t = floor($intPart / 10);
                    $words .= $tens[$t] . ' ';
                    $intPart = $intPart % 10;
                    if ($intPart > 0) $words .= 'و' . $units[$intPart] . ' ';
                } elseif ($intPart >= 10) {
                    $words .= $teens[$intPart - 10] . ' ';
                    $intPart = 0;
                } elseif ($intPart > 0) {
                    $words .= $units[$intPart] . ' ';
                }

                return trim($words) . ' دينار ليبي';
            };
        @endphp

        <div class="amount-words">
            <strong>المبلغ كتابةً:</strong> {{ $amountWords($payment->amount) }}
        </div>

        <div class="signatures">
            <div class="signature-field">
                <div class="line"></div>
                <div class="label">توقيع المستلم</div>
            </div>
            <div class="signature-field">
                <div class="line"></div>
                <div class="label">توقيع المحاسب</div>
            </div>
            <div class="signature-field">
                <div class="line"></div>
                <div class="label">الختم</div>
            </div>
        </div>

        <div class="footer">
            {{ config('app.name', 'مؤسسة تعليمية') }} - جميع الحقوق محفوظة &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
