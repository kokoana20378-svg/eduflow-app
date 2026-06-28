import AdminLayout from '@/Layouts/AdminLayout';
import Table from '@/Components/Admin/Table';
import Pagination from '@/Components/Admin/Pagination';
import { Link, usePage } from '@inertiajs/react';

export default function Index() {
    const { payments } = usePage().props;
    const data = payments.data || payments;
    const pagination = payments.links ? payments : null;

    const headers = ['رقم الإيصال', 'الطالب', 'المبلغ', 'التاريخ', 'طريقة الدفع', 'إجراءات'];
    const paymentMethods = { cash: 'نقدي', bank_transfer: 'تحويل بنكي', card: 'بطاقة', check: 'شيك' };
    const rows = (data || []).map((p) => ({
        cells: [
            p.receipt_number || '-',
            p.student?.user?.name || '-',
            <span className="font-medium text-gray-900 dark:text-white">{p.amount?.toLocaleString()} د.ل</span>,
            p.payment_date,
            p.payment_method ? (paymentMethods[p.payment_method] || p.payment_method) : '-',
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
            </a>,
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

            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                <Table headers={headers} rows={rows} />
                {pagination && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"><Pagination links={pagination.links} /></div>}
            </div>
        </AdminLayout>
    );
}
