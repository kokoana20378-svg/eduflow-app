<?php

namespace App\Http\Controllers;

use App\Models\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LevelController extends Controller
{
    public function index()
    {
        $levels = Level::withCount(['groups', 'subjects', 'students'])->orderBy('order')->get();
        return Inertia::render('Levels/Index', ['levels' => $levels]);
    }

    public function create()
    {
        return Inertia::render('Levels/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:levels,code',
            'order' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        Level::create($validated);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Level $level)
    {
        return Inertia::render('Levels/Edit', ['level' => $level]);
    }

    public function update(Request $request, Level $level)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:levels,code,' . $level->id,
            'order' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $level->update($validated);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function destroy(Level $level)
    {
        if ($level->groups()->exists() || $level->subjects()->exists() || $level->students()->exists()) {
            return redirect()->back()->with('error', 'لا يمكن حذف المرحلة لوجود بيانات مرتبطة بها');
        }

        $level->delete();

        return redirect()->back()->with('success', 'تم الحذف');
    }
}
