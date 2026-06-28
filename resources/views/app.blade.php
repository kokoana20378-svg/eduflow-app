<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'EduFlow') }}</title>

        <!-- PWA: iOS -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="EduFlow">
        <link rel="apple-touch-icon" href="/icons/icon-192.png">
        <link rel="apple-touch-startup-image" href="/icons/splash.png">

        <!-- PWA: Android / General -->
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#4f46e5">
        <link rel="manifest" href="/manifest.json">
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">

        <!-- PWA: Windows -->
        <meta name="msapplication-TileColor" content="#4f46e5">
        <meta name="msapplication-TileImage" content="/icons/icon-144.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
            }
        </script>
    </body>
</html>
