<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            if ($request->inertia()) {
                return redirect()->back()->with('error', 'غير مصرح بالوصول إلى هذه الصفحة');
            }
            abort(403, 'غير مصرح بالوصول');
        }
        return $next($request);
    }
}
