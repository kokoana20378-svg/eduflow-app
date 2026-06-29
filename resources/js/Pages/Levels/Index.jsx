import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import DeleteButton from '@/Components/Admin/DeleteButton';
import Pagination from '@/Components/Admin/Pagination';
import SearchInput from '@/Components/Admin/SearchInput';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index() {
    const { levels } = usePage().props;
    const data = levels.data || levels;
    const pagination = levels.links ? levels : null;
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        router.delete(route('levels.destroy', id));
    };

    const filteredData = useMemo(() => {
        if (!search) return data || [];
        const q = search.toLowerCase();
        return (data || []).filter((l) =>
            (l.name || '').toLowerCase().includes(q) ||
            (l.code || '').toLowerCase().includes(q)
        );
    }, [data, search]);

    const headers = ['الاسم', 'الكود', 'الترتيب', 'عدد المجموعات', 'عدد المواد'];
    const rows = filteredData.map((level) => ({
        cells: [
            level.name,
            level.code,
            level.order,
            level.groups_count ?? 0,
            level.subjects_count ?? 0,
        ],
    }));

    return (
        <AdminLayout title="المستويات">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">المستويات</h1>
                    <p className="text-gray-500 dark:text-gray-400">إدارة المستويات الدراسية</p>
                </div>
                <Link
                    href={route('levels.create')}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة مستوى
                </Link>
            </div>

            <div className="mb-4">
                <SearchInput onSearch={setSearch} placeholder="بحث بالاسم أو الكود..." />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table
                    headers={headers}
                    rows={rows}
                    actions={(row, index) => (
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('levels.edit', filteredData[index].id)}
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                title="تعديل"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </Link>
                            <DeleteButton onDelete={() => handleDelete(filteredData[index].id)} itemName={filteredData[index].name} />
                        </div>
                    )}
                />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
