import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import Pagination from '@/Components/Admin/Pagination';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    const { attendances, groups, filters } = usePage().props;
    const data = attendances.data || attendances;
    const pagination = attendances.links ? attendances : null;
    const [filterGroup, setFilterGroup] = useState(filters?.group_id || '');
    const [filterDate, setFilterDate] = useState(filters?.date || '');
    const [filterStatus, setFilterStatus] = useState(filters?.status || '');

    const applyFilters = () => {
        router.get(route('attendance.index'), {
            group_id: filterGroup,
            date: filterDate,
            status: filterStatus,
        });
    };

    const statusColors = {
        present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        excused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        late: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };

    const statusLabels = {
        present: 'حاضر',
        absent: 'غائب',
        excused: 'معذر',
        late: 'متأخر',
    };

    const headers = ['الطالب', 'المجموعة', 'التاريخ', 'الحالة', 'وقت الدخول'];
    const rows = (data || []).map((a) => ({
        cells: [
            a.student?.user?.name || '-',
            a.group?.name || '-',
            a.date,
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[a.status] || ''}`}>
                {statusLabels[a.status] || a.status}
            </span>,
            a.check_in_time || '-',
        ],
    }));

    return (
        <AdminLayout title="الحضور">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الحضور</h1>
                    <p className="text-gray-500 dark:text-gray-400">سجل حضور الطلاب</p>
                </div>
                <div className="flex items-center gap-3">
                    {filterGroup && (
                        <a
                            href={route('attendance.export-pdf', { group: filterGroup, date_from: filterDate || undefined, date_to: filterDate || undefined })}
                            target="_blank"
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            تصدير PDF
                        </a>
                    )}
                    <Link
                        href={route('attendance.create')}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        تسجيل حضور
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">المجموعة</label>
                    <select
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option value="">الكل</option>
                        {(groups || []).map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">التاريخ</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">الحالة</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option value="">الكل</option>
                        <option value="present">حاضر</option>
                        <option value="absent">غائب</option>
                        <option value="excused">معذر</option>
                        <option value="late">متأخر</option>
                    </select>
                </div>
                <button
                    onClick={applyFilters}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    بحث
                </button>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table headers={headers} rows={rows} />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
