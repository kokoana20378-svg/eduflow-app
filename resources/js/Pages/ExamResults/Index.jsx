import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import Pagination from '@/Components/Admin/Pagination';
import SearchInput from '@/Components/Admin/SearchInput';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index() {
    const { exam, results } = usePage().props;
    const data = results.data || results;
    const pagination = results.links ? results : null;
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!search) return data || [];
        const q = search.toLowerCase();
        return (data || []).filter((r) =>
            (r.student?.user?.name || '').toLowerCase().includes(q) ||
            (r.grade || '').toLowerCase().includes(q) ||
            (r.notes || '').toLowerCase().includes(q)
        );
    }, [data, search]);

    const headers = ['الطالب', 'الدرجة', 'التقدير', 'النسبة', 'ملاحظات', 'إجراءات'];
    const rows = filteredData.map((r) => ({
        cells: [
            r.student?.user?.name || '-',
            `${r.marks_obtained ?? '-'}/${exam?.total_marks || 0}`,
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                r.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                r.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                r.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                r.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
                {r.grade || '-'}
            </span>,
            <span className="text-sm text-gray-600 dark:text-gray-400">{r.percentage || 0}%</span>,
            r.notes || '-',
            <Link
                href={route('exam-results.edit', r.id)}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                title="تعديل"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </Link>,
        ],
    }));

    return (
        <AdminLayout title={`نتائج: ${exam?.title || ''}`}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        نتائج: {exam?.title || ''}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {exam?.subject?.name || exam?.subject || '-'} - {exam?.date || exam?.exam_date || '-'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href={route('exam-results.export-pdf', exam?.id)}
                        target="_blank"
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        تصدير PDF
                    </a>
                    <Link
                        href={route('exam-results.create', exam?.id)}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة نتائج
                    </Link>
                </div>
            </div>

            <div className="mb-4">
                <SearchInput onSearch={setSearch} placeholder="بحث بالاسم، التقدير..." />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table headers={headers} rows={rows} />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
