<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Student;
use App\Models\Fee;
use App\Services\PdfExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['student.user', 'fee'])->orderBy('payment_date', 'desc')->get();
        return Inertia::render('Payments/Index', ['payments' => $payments]);
    }

    public function create()
    {
        $students = Student::with('user')->get();
        $fees = Fee::all();
        return Inertia::render('Payments/Create', ['students' => $students, 'fees' => $fees]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_id' => 'nullable|exists:fees,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,bank_transfer,online,cheque',
            'receipt_number' => 'nullable|string|max:100|unique:payments,receipt_number',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['receipt_number'])) {
            $validated['receipt_number'] = 'RCP-' . str_pad((Payment::max('id') ?? 0) + 1, 6, '0', STR_PAD_LEFT);
        }

        Payment::create($validated);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function edit(Payment $payment)
    {
        $students = Student::with('user')->get();
        $fees = Fee::all();
        return Inertia::render('Payments/Edit', [
            'payment' => $payment->load(['student.user', 'fee']),
            'students' => $students,
            'fees' => $fees,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_id' => 'nullable|exists:fees,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,bank_transfer,online,cheque',
            'receipt_number' => 'nullable|string|max:100|unique:payments,receipt_number,' . $payment->id,
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->route('payments.index')->with('success', 'تم التحديث بنجاح');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->back()->with('success', 'تم الحذف بنجاح');
    }

    public function show(Payment $payment)
    {
        return redirect()->route('payments.index');
    }

    public function receiptPdf(Payment $payment)
    {
        return app(PdfExportService::class)->paymentReceipt($payment->load(['student.user', 'fee']));
    }
}
