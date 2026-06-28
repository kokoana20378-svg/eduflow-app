import AdminLayout from '@/Layouts/AdminLayout';
import StatsCard from '@/Components/Admin/StatsCard';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { stats } = usePage().props;

    const defaultStats = stats || {
        total_students: 0,
        total_teachers: 0,
        total_groups: 0,
        total_levels: 0,
        pending_payments: 0,
        today_attendance: { present: 0, absent: 0, total: 0 },
    };

    return (
        <AdminLayout title="لوحة التحكم">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
                <p className="text-gray-500 dark:text-gray-400">مرحباً بك في نظام إدارة التعليم</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="إجمالي الطلاب"
                    value={defaultStats.total_students}
                    color="blue"
                    icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
                <StatsCard
                    title="إجمالي المدرسين"
                    value={defaultStats.total_teachers}
                    color="green"
                    icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <StatsCard
                    title="إجمالي المجموعات"
                    value={defaultStats.total_groups}
                    color="purple"
                    icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <StatsCard
                    title="إجمالي المستويات"
                    value={defaultStats.total_levels}
                    color="pink"
                    icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pending Payments */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">المدفوعات المعلقة</h2>
                    {defaultStats.pending_payments > 0 ? (
                        <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">هناك {defaultStats.pending_payments} مدفوعات معلقة</p>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">يرجى مراجعة المدفوعات المستحقة</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">لا توجد مدفوعات معلقة</p>
                    )}
                </div>

                {/* Today's Attendance */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">الحضور اليوم</h2>
                    {defaultStats.today_attendance.total > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">إجمالي الطلاب</span>
                                <span className="font-bold text-gray-800 dark:text-white">{defaultStats.today_attendance.total}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">الحاضر</span>
                                <span className="font-bold text-green-600">{defaultStats.today_attendance.present}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">الغائب</span>
                                <span className="font-bold text-red-600">{defaultStats.today_attendance.absent}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-green-500 transition-all"
                                    style={{ width: `${(defaultStats.today_attendance.present / defaultStats.today_attendance.total) * 100}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                نسبة الحضور: {Math.round((defaultStats.today_attendance.present / defaultStats.today_attendance.total) * 100)}%
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">لا توجد بيانات حضور اليوم</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
