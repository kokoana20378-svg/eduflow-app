import AdminLayout from '@/Layouts/AdminLayout';
import StatsCard from '@/Components/Admin/StatsCard';
import { Link } from '@inertiajs/react';

export default function AiDashboard({ insights }) {
    const avgColor = insights.average_performance >= 70 ? 'green' : insights.average_performance >= 50 ? 'yellow' : 'red';
    const attColor = insights.average_attendance >= 80 ? 'green' : insights.average_attendance >= 60 ? 'yellow' : 'red';

    return (
        <AdminLayout title="الذكاء الاصطناعي">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الذكاء الاصطناعي</h1>
                <p className="text-gray-500 dark:text-gray-400">تحليلات ذكية وتوليد أسئلة آلية</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="متوسط الأداء"
                    value={`${insights.average_performance}%`}
                    color={avgColor}
                    icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
                <StatsCard
                    title="متوسط الحضور"
                    value={`${insights.average_attendance}%`}
                    color={attColor}
                    icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <StatsCard
                    title="الطلاب المعرضون للخطر"
                    value={insights.at_risk_count}
                    color="red"
                    icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
                <StatsCard
                    title="إجمالي الامتحانات"
                    value={insights.total_exams}
                    color="indigo"
                    icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">الأداء العام</h2>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">الأداء</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{insights.average_performance}%</span>
                    </div>
                    <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${insights.average_performance}%` }} />
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">الحضور</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{insights.average_attendance}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${insights.average_attendance}%` }} />
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">المواد الأكثر امتحانات</h2>
                    <ul className="space-y-2">
                        {insights.top_subjects?.length > 0 ? insights.top_subjects.map((subject, i) => (
                            <li key={i} className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">{i + 1}</span>
                                {subject}
                            </li>
                        )) : <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد بيانات</p>}
                    </ul>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">التوصيات</h2>
                    <ul className="space-y-2">
                        {insights.recommendations?.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Link href="/ai/questions" className="group rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500">
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">توليد الأسئلة</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">توليد أسئلة امتحانات آلية ذكية</p>
                </Link>

                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500">
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">تحليل الطلاب</h3>
                    <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">تحليل أداء الطلاب وتوقع الدرجات</p>
                    <Link href="/students" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                        عرض الطلاب ←
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
