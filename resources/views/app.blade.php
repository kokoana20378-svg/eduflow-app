<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'EduFlow') }}</title>

        <!-- PWA: iOS Safari -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="EduFlow">
        <link rel="apple-touch-icon" href="/icons/icon-192.png">
        <link rel="apple-touch-startup-image" href="/icons/splash.png">

        <!-- PWA: Android / Chrome / Samsung -->
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#4f46e5">
        <meta name="color-scheme" content="light dark">
        <link rel="manifest" href="/manifest.json">
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">
        <link rel="shortcut icon" href="/icons/favicon.svg">

        <!-- PWA: Windows -->
        <meta name="msapplication-TileColor" content="#4f46e5">
        <meta name="msapplication-TileImage" content="/icons/icon-144.png">
        <meta name="msapplication-config" content="none">

        <!-- PWA: Ubuntu / Linux -->
        <meta name="application-name" content="EduFlow">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @php
            $ziggy = new \Tighten\Ziggy\Ziggy(null, config('app.url'));
            $routeFunction = file_get_contents(base_path('vendor/tightenco/ziggy/dist/route.umd.js'));
        @endphp
        <script type="text/javascript">const Ziggy={!! $ziggy->toJson() !!};{!! $routeFunction !!}</script>
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then((reg) => {
                        reg.addEventListener('updatefound', () => {
                            const newWorker = reg.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'activated') {
                                        if (navigator.serviceWorker.controller) {
                                            if (typeof window.showUpdateNotification === 'function') {
                                                window.showUpdateNotification();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }).catch(() => {});
                });
            }
        </script>
    </body>
</html>
