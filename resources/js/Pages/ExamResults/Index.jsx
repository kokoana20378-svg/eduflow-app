import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import Pagination from '@/Components/Admin/Pagination';
import { Link, usePage } from '@inertiajs/react';

export default function Index() {
    const { exam, results } = usePage().props;
    const data = results.data || results;
    const pagination = results.links ? results : null;

    const headers = ['الطالب', 'الدرجة', 'التقدير', 'ملاحظات'];
    const rows = (data || []).map((r) => ({
        cells: [
            r.student?.user?.name || '-',
            `${r.marks_obtained ?? '-'}/${exam?.total_marks || 0}`,
            r.grade || '-',
            r.notes || '-',
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

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table headers={headers} rows={rows} />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
