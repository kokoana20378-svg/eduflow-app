<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>EduFlow - غير متصل</title>
    <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6; font-family: system-ui, sans-serif; }
        .card { text-align: center; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); max-width: 400px; }
        .icon { width: 72px; height: 72px; margin: 0 auto 20px; background: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .icon svg { width: 36px; height: 36px; fill: white; }
        h1 { color: #1f2937; margin: 0 0 8px; font-size: 24px; }
        p { color: #6b7280; margin: 0 0 24px; font-size: 16px; }
        .btn { display: inline-block; padding: 10px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; }
        .btn:hover { background: #4338ca; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <svg viewBox="0 0 24 24"><path d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" stroke="white" stroke-width="2" fill="none"/></svg>
        </div>
        <h1>لا يوجد اتصال بالإنترنت</h1>
        <p>يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى</p>
        <button class="btn" onclick="window.location.reload()">إعادة المحاولة</button>
    </div>
</body>
</html>
