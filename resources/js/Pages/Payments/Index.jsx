import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import DeleteButton from '@/Components/Admin/DeleteButton';
import Pagination from '@/Components/Admin/Pagination';
import SearchInput from '@/Components/Admin/SearchInput';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index() {
    const { payments } = usePage().props;
    const data = payments.data || payments;
    const pagination = payments.links ? payments : null;
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!search) return data || [];
        const q = search.toLowerCase();
        return (data || []).filter((p) =>
            (p.receipt_number || '').toLowerCase().includes(q) ||
            (p.student?.user?.name || '').toLowerCase().includes(q) ||
            (p.payment_method || '').toLowerCase().includes(q) ||
            (p.notes || '').toLowerCase().includes(q)
        );
    }, [data, search]);

    const paymentMethods = { cash: 'نقدي', bank_transfer: 'تحويل بنكي', card: 'بطاقة', cheque: 'شيك' };

    const headers = ['رقم الإيصال', 'الطالب', 'المبلغ', 'التاريخ', 'طريقة الدفع', 'إجراءات'];
    const rows = filteredData.map((p) => ({
        cells: [
            p.receipt_number || '-',
            p.student?.user?.name || '-',
            <span className="font-medium text-gray-900 dark:text-white">{p.amount?.toLocaleString()} د.ل</span>,
            p.payment_date,
            p.payment_method ? (paymentMethods[p.payment_method] || p.payment_method) : '-',
            <div className="flex items-center gap-2">
                <Link
                    href={route('payments.edit', p.id)}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="تعديل"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </Link>
                <a
                    href={route('payments.receipt-pdf', p.id)}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                    title="طباعة الإيصال"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    إيصال
                </a>
                <DeleteButton onDelete={() => { if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) router.delete(route('payments.destroy', p.id)); }} itemName={p.receipt_number} />
            </div>,
        ],
    }));

    return (
        <AdminLayout title="المدفوعات">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">المدفوعات</h1>
                    <p className="text-gray-500 dark:text-gray-400">سجل المدفوعات</p>
                </div>
                <Link
                    href={route('payments.create')}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة دفعة
                </Link>
            </div>

            <div className="mb-4">
                <SearchInput onSearch={setSearch} placeholder="بحث برقم الإيصال، اسم الطالب، طريقة الدفع..." />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table headers={headers} rows={rows} />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
