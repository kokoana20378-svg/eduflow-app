import AdminLayout from '@/Layouts/AdminLayout';

export default function StudentAnalysis({ analysis }) {
    const {
        student_name,
        student_code,
        total_exams,
        average_percentage,
        passed_exams,
        failed_exams,
        pass_rate,
        attendance_rate,
        present_days,
        absent_days,
        trend,
        predicted_grade,
        weaknesses,
        strengths,
        subject_performance,
        recommendations,
    } = analysis;

    const handlePrint = () => {
        window.print();
    };

    const trendColor = trend.includes('تحسن') ? 'text-green-600' : trend.includes('تراجع') ? 'text-red-600' : 'text-yellow-600';
    const trendBg = trend.includes('تحسن') ? 'bg-green-50 dark:bg-green-900/20' : trend.includes('تراجع') ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20';

    return (
        <AdminLayout title={`تحليل الطالب - ${student_name}`}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تحليل أداء الطالب</h1>
                    <p className="text-gray-500 dark:text-gray-400">تقارير وتحليلات ذكية</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    تصدير تقرير PDF
                </button>
            </div>

            <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-2xl font-bold text-white">
                        {student_name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{student_name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">كود الطالب: {student_code}</p>
                    </div>
                    <div className={`mr-auto rounded-full px-4 py-1.5 text-sm font-medium ${trendBg} ${trendColor}`}>
                        {trend}
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">متوسط النسبة</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{average_percentage}%</p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">نسبة النجاح</p>
                    <p className="text-2xl font-bold text-green-600">{pass_rate}%</p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">نسبة الحضور</p>
                    <p className="text-2xl font-bold text-blue-600">{attendance_rate}%</p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">الدرجة المتوقعة</p>
                    <p className="text-2xl font-bold text-purple-600">{predicted_grade}</p>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">إحصائيات الامتحانات</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">إجمالي الامتحانات</span>
                            <span className="font-bold text-gray-800 dark:text-white">{total_exams}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">ناجح</span>
                            <span className="font-bold text-green-600">{passed_exams}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">راسب</span>
                            <span className="font-bold text-red-600">{failed_exams}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">إحصائيات الحضور</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">أيام الحضور</span>
                            <span className="font-bold text-green-600">{present_days}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">أيام الغياب</span>
                            <span className="font-bold text-red-600">{absent_days}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${attendance_rate}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {Object.keys(subject_performance || {}).length > 0 && (
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">الأداء حسب المادة</h3>
                    <div className="space-y-4">
                        {Object.entries(subject_performance).map(([subjectId, perf]) => (
                            <div key={subjectId}>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subjectId}</span>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{perf.avg}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className={`h-full rounded-full transition-all ${perf.avg >= 70 ? 'bg-green-500' : perf.avg >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${perf.avg}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {weaknesses?.length > 0 && (
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            نقاط الضعف
                        </h3>
                        <ul className="space-y-2">
                            {weaknesses.map((w, i) => (
                                <li key={i} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{w}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {strengths?.length > 0 && (
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            نقاط القوة
                        </h3>
                        <ul className="space-y-2">
                            {strengths.map((s, i) => (
                                <li key={i} className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-indigo-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    التوصيات
                </h3>
                <ul className="space-y-2">
                    {recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">{i + 1}</span>
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>
        </AdminLayout>
    );
}
