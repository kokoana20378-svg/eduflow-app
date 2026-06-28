<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'DejaVu Sans', sans-serif; background: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #1e293b; font-size: 24px; margin: 0;">EduFlow</h1>
            <p style="color: #64748b; font-size: 14px;">نظام إدارة السنتر التعليمي</p>
        </div>
        <h2 style="color: #1e293b; font-size: 18px;">{{ $notification->title }}</h2>
        <div style="color: #475569; font-size: 15px; line-height: 1.8;">
            {!! nl2br(e($notification->message)) !!}
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p>تم الإرسال بواسطة EduFlow © 2036</p>
        </div>
    </div>
</body>
</html>
