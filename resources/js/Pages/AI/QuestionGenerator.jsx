import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function QuestionGenerator({ subjects }) {
    const [form, setForm] = useState({
        subject: '',
        count: 5,
        difficulty: 'medium',
        type: 'multiple_choice',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/ai/questions/generate', form, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AdminLayout title="توليد الأسئلة">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">توليد الأسئلة</h1>
                <p className="text-gray-500 dark:text-gray-400">توليد أسئلة امتحانات آلية باستخدام الذكاء الاصطناعي</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">المادة</label>
                        <select
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">اختر المادة</option>
                            {subjects?.map((s) => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">عدد الأسئلة</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={form.count}
                            onChange={(e) => setForm({ ...form, count: parseInt(e.target.value) || 5 })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">المستوى</label>
                        <select
                            value={form.difficulty}
                            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="easy">سهل</option>
                            <option value="medium">متوسط</option>
                            <option value="hard">صعب</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">نوع الأسئلة</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="multiple_choice">اختيار من متعدد</option>
                            <option value="true_false">صح/خطأ</option>
                            <option value="essay">مقالي</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.subject}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                جاري التوليد...
                            </>
                        ) : 'توليد الأسئلة'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
