import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit() {
    const { examResult } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        marks_obtained: examResult.marks_obtained || '',
        notes: examResult.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('exam-results.update', examResult.id));
    };

    return (
        <AdminLayout title="تعديل نتيجة">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل نتيجة</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    الطالب: {examResult.student?.user?.name || '-'} | الامتحان: {examResult.exam?.title || '-'}
                </p>
            </div>

            <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            الدرجة النهائية: <span className="font-bold text-gray-800 dark:text-white">{examResult.exam?.total_marks || 0}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            التقدير الحالي: <span className="font-bold text-gray-800 dark:text-white">{examResult.grade || '-'}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            النسبة: <span className="font-bold text-gray-800 dark:text-white">{examResult.percentage || 0}%</span>
                        </p>
                    </div>
                    <FormInput
                        label="الدرجة المحصلة"
                        name="marks_obtained"
                        type="number"
                        min="0"
                        max={examResult.exam?.total_marks}
                        value={data.marks_obtained}
                        onChange={(e) => setData('marks_obtained', e.target.value)}
                        error={errors.marks_obtained}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ملاحظات</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            rows="3"
                            placeholder="اختياري"
                        />
                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('exam-results.index', examResult.exam?.id)}
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
