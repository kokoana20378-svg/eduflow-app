import AdminLayout from '@/Layouts/AdminLayout';

export default function GeneratedQuestions({ questions }) {
    const { subject, difficulty, count, questions: items } = questions;

    const handlePrint = () => {
        window.print();
    };

    const difficultyLabels = {
        easy: 'سهل',
        medium: 'متوسط',
        hard: 'صعب',
    };

    const typeLabels = {
        multiple_choice: 'اختيار من متعدد',
        true_false: 'صح/خطأ',
        essay: 'مقالي',
    };

    const optionLabels = ['أ', 'ب', 'ج', 'د'];

    return (
        <AdminLayout title="الأسئلة المولدة">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الأسئلة المولدة</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {subject} - {difficultyLabels[difficulty] || difficulty} - {count} سؤال
                    </p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    طباعة
                </button>
            </div>

            <div className="mb-6 space-y-4">
                {items?.map((q) => (
                    <div key={q.number} className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="mb-3 flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {q.number}
                            </span>
                            <p className="pt-1 text-base font-medium text-gray-800 dark:text-white">{q.question}</p>
                        </div>

                        {q.options && (
                            <div className="mr-11 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                    <div
                                        key={oi}
                                        className={`rounded-lg border px-3 py-2 text-sm ${
                                            q.correct_answer === opt
                                                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                : 'border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        <span className="ml-2 font-bold">{optionLabels[oi] || oi + 1}.</span>
                                        {opt}
                                        {q.correct_answer === opt && (
                                            <svg className="mr-1 inline h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="rounded-lg bg-yellow-50 p-6 shadow-md dark:bg-yellow-900/20">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    نموذج الإجابة
                </h3>
                <div className="space-y-1">
                    {items?.map((q) => (
                        <p key={q.number} className="text-sm text-yellow-700 dark:text-yellow-300">
                            <span className="font-bold">س{q.number}:</span> {q.correct_answer}
                        </p>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
