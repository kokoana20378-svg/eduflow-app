import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import DeleteButton from '@/Components/Admin/DeleteButton';
import Pagination from '@/Components/Admin/Pagination';
import SearchInput from '@/Components/Admin/SearchInput';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index() {
    const { students } = usePage().props;
    const data = students.data || students;
    const pagination = students.links ? students : null;
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        router.delete(route('students.destroy', id));
    };

    const filteredData = useMemo(() => {
        if (!search) return data || [];
        const q = search.toLowerCase();
        return (data || []).filter((s) =>
            (s.user?.name || '').toLowerCase().includes(q) ||
            (s.student_code || '').toLowerCase().includes(q) ||
            (s.user?.email || '').toLowerCase().includes(q) ||
            (s.user?.phone || '').toLowerCase().includes(q) ||
            (s.level?.name || '').toLowerCase().includes(q) ||
            (s.group?.name || '').toLowerCase().includes(q) ||
            (s.guardian_name || '').toLowerCase().includes(q)
        );
    }, [data, search]);

    const headers = ['الكود', 'الاسم', 'البريد', 'الهاتف', 'المستوى', 'المجموعة', 'ولي الأمر'];
    const rows = filteredData.map((s) => ({
        cells: [
            s.student_code || '-',
            s.user?.name || '-',
            s.user?.email || '-',
            s.user?.phone || '-',
            s.level?.name || '-',
            s.group?.name || '-',
            s.guardian_name || '-',
        ],
    }));

    return (
        <AdminLayout title="الطلاب">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الطلاب</h1>
                    <p className="text-gray-500 dark:text-gray-400">إدارة بيانات الطلاب</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href={route('students.export-pdf')}
                        target="_blank"
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        تصدير PDF
                    </a>
                    <Link
                        href={route('students.create')}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة طالب
                    </Link>
                </div>
            </div>

            <div className="mb-4">
                <SearchInput onSearch={setSearch} placeholder="بحث بالاسم، الكود، البريد، الهاتف، المستوى، المجموعة..." />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table
                    headers={headers}
                    rows={rows}
                    actions={(row, index) => (
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('students.edit', filteredData[index].id)}
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                title="تعديل"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </Link>
                            <DeleteButton onDelete={() => handleDelete(filteredData[index].id)} itemName={filteredData[index].user?.name || filteredData[index].student_code} />
                        </div>
                    )}
                />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
