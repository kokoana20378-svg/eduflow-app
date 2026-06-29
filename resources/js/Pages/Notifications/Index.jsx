import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import DeleteButton from '@/Components/Admin/DeleteButton';
import Pagination from '@/Components/Admin/Pagination';
import SearchInput from '@/Components/Admin/SearchInput';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index() {
    const { notifications } = usePage().props;
    const data = notifications.data || notifications;
    const pagination = notifications.links ? notifications : null;
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        router.delete(route('notifications.destroy', id));
    };

    const handleSendWhatsApp = (id) => {
        router.post(route('notifications.send-whatsapp', id));
    };

    const handleSendEmail = (id) => {
        router.post(route('notifications.send-email', id));
    };

    const filteredData = useMemo(() => {
        if (!search) return data || [];
        const q = search.toLowerCase();
        return (data || []).filter((n) =>
            (n.title || '').toLowerCase().includes(q) ||
            (n.message || '').toLowerCase().includes(q) ||
            (n.recipient || '').toLowerCase().includes(q) ||
            (n.type || '').toLowerCase().includes(q)
        );
    }, [data, search]);

    const typeLabels = {
        whatsapp: 'واتساب',
        email: 'بريد إلكتروني',
        in_app: 'داخل التطبيق',
        both: 'الاثنين',
    };

    const statusColors = {
        sent: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const statusLabels = {
        sent: 'مرسل',
        pending: 'قيد الانتظار',
        failed: 'فشل',
    };

    const headers = ['النوع', 'المستلم', 'العنوان', 'الحالة', 'تاريخ الإرسال'];
    const rows = filteredData.map((n) => ({
        cells: [
            typeLabels[n.type] || n.type,
            n.recipient || '-',
            n.title,
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[n.status] || ''}`}>
                {statusLabels[n.status] || n.status}
            </span>,
            n.sent_at || '-',
        ],
    }));

    return (
        <AdminLayout title="الإشعارات">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الإشعارات</h1>
                    <p className="text-gray-500 dark:text-gray-400">إدارة الإشعارات والتواصل</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('notifications.bulk-form')}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        إرسال جماعي
                    </Link>
                    <Link
                        href={route('notifications.create')}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة إشعار
                    </Link>
                </div>
            </div>

            <div className="mb-4">
                <SearchInput onSearch={setSearch} placeholder="بحث بالعنوان، الرسالة، المستلم، النوع..." />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table
                    headers={headers}
                    rows={rows}
                    actions={(row, index) => (
                        <div className="flex items-center gap-2">
                            {filteredData[index].type !== 'email' && (
                                <button
                                    onClick={() => handleSendWhatsApp(filteredData[index].id)}
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                    title="إرسال واتساب"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </button>
                            )}
                            {filteredData[index].type !== 'whatsapp' && (
                                <button
                                    onClick={() => handleSendEmail(filteredData[index].id)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="إرسال بريد"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            )}
                            <DeleteButton onDelete={() => handleDelete(filteredData[index].id)} itemName={filteredData[index].title} />
                        </div>
                    )}
                />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
