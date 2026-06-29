import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit() {
    const { payment, students, fees } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        student_id: payment.student_id || '',
        fee_id: payment.fee_id || '',
        amount: payment.amount || '',
        payment_date: payment.payment_date || '',
        payment_method: payment.payment_method || '',
        receipt_number: payment.receipt_number || '',
        notes: payment.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('payments.update', payment.id));
    };

    return (
        <AdminLayout title="تعديل دفعة">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل الدفعة</h1>
                <p className="text-gray-500 dark:text-gray-400">رقم الإيصال: {payment.receipt_number || '-'}</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormSelect
                        label="الطالب"
                        name="student_id"
                        value={data.student_id}
                        onChange={(e) => setData('student_id', e.target.value)}
                        options={(students || []).map((s) => ({ value: s.id, label: `${s.user?.name || s.student_code} (${s.student_code || ''})` }))}
                        error={errors.student_id}
                        required
                    />
                    <FormSelect
                        label="الرسوم (اختياري)"
                        name="fee_id"
                        value={data.fee_id}
                        onChange={(e) => setData('fee_id', e.target.value)}
                        options={(fees || []).map((f) => ({ value: f.id, label: `${f.title} - ${f.amount} د.ل` }))}
                        error={errors.fee_id}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="المبلغ"
                            name="amount"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            error={errors.amount}
                            required
                        />
                        <FormInput
                            label="رقم الإيصال"
                            name="receipt_number"
                            value={data.receipt_number}
                            onChange={(e) => setData('receipt_number', e.target.value)}
                            error={errors.receipt_number}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="تاريخ الدفع"
                            name="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(e) => setData('payment_date', e.target.value)}
                            error={errors.payment_date}
                            required
                        />
                        <FormSelect
                            label="طريقة الدفع"
                            name="payment_method"
                            value={data.payment_method}
                            onChange={(e) => setData('payment_method', e.target.value)}
                            options={[
                                { value: 'cash', label: 'نقدي' },
                                { value: 'bank_transfer', label: 'تحويل بنكي' },
                                { value: 'card', label: 'بطاقة' },
                                { value: 'cheque', label: 'شيك' },
                            ]}
                            error={errors.payment_method}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ملاحظات</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            rows="3"
                        />
                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('payments.index')}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
