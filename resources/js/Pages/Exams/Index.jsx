import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import DeleteButton from '@/Components/Admin/DeleteButton';
import Pagination from '@/Components/Admin/Pagination';
import SearchInput from '@/Components/Admin/SearchInput';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index() {
    const { exams } = usePage().props;
    const data = exams.data || exams;
    const pagination = exams.links ? exams : null;
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        router.delete(route('exams.destroy', id));
    };

    const filteredData = useMemo(() => {
        if (!search) return data || [];
        const q = search.toLowerCase();
        return (data || []).filter((e) =>
            (e.title || '').toLowerCase().includes(q) ||
            (e.level?.name || '').toLowerCase().includes(q) ||
            (e.group?.name || '').toLowerCase().includes(q) ||
            (e.subject || '').toLowerCase().includes(q) ||
            (e.type || '').toLowerCase().includes(q)
        );
    }, [data, search]);

    const typeLabels = {
        midterm: 'نصف الفصل',
        final: 'نهائي',
        quiz: 'اختبار قصير',
        assignment: 'واجب',
    };

    const headers = ['العنوان', 'المستوى', 'المجموعة', 'المادة', 'النوع', 'الدرجة', 'التاريخ'];
    const rows = filteredData.map((e) => ({
        cells: [
            <Link href={route('exam-results.index', e.id)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                {e.title}
            </Link>,
            e.level?.name || '-',
            e.group?.name || '-',
            e.subject || '-',
            typeLabels[e.type] || e.type,
            e.total_marks,
            e.exam_date,
        ],
    }));

    return (
        <AdminLayout title="الامتحانات">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الامتحانات</h1>
                    <p className="text-gray-500 dark:text-gray-400">إدارة الامتحانات والاختبارات</p>
                </div>
                <Link
                    href={route('exams.create')}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة امتحان
                </Link>
            </div>

            <div className="mb-4">
                <SearchInput onSearch={setSearch} placeholder="بحث بالعنوان، المستوى، المجموعة، المادة، النوع..." />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table
                    headers={headers}
                    rows={rows}
                    actions={(row, index) => (
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('exams.edit', filteredData[index].id)}
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                title="تعديل"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </Link>
                            <Link
                                href={route('exam-results.index', filteredData[index].id)}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                title="النتائج"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </Link>
                            <DeleteButton onDelete={() => handleDelete(filteredData[index].id)} itemName={filteredData[index].title} />
                        </div>
                    )}
                />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
