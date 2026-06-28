<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeController extends Controller
{
    public function index()
    {
        $fees = Fee::with('level')->withCount('payments')->get();
        return Inertia::render('Fees/Index', ['fees' => $fees]);
    }

    public function create()
    {
        $levels = Level::orderBy('order')->get();
        return Inertia::render('Fees/Create', ['levels' => $levels]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'level_id' => 'required|exists:levels,id',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        Fee::create($validated);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Fee $fee)
    {
        $levels = Level::orderBy('order')->get();
        return Inertia::render('Fees/Edit', [
            'fee' => $fee->load('level'),
            'levels' => $levels,
        ]);
    }

    public function update(Request $request, Fee $fee)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'level_id' => 'required|exists:levels,id',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $fee->update($validated);

        return redirect()->back()->with('success', 'تم التحديث');
    }

    public function destroy(Fee $fee)
    {
        if ($fee->payments()->exists()) {
            return redirect()->back()->with('error', 'لا يمكن حذف الرسوم لوجود مدفوعات مرتبطة بها');
        }

        $fee->delete();

        return redirect()->back()->with('success', 'تم الحذف');
    }
}
