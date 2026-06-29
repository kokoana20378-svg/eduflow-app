import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function QRGenerate() {
    const { qr_svg, token, group, expires_at } = usePage().props;
    const [timeLeft, setTimeLeft] = useState('');
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const exp = new Date(expires_at);
            const diff = exp - now;

            if (diff <= 0) {
                setTimeLeft('منتهي');
                setExpired(true);
                return;
            }

            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [expires_at]);

    const handleRefresh = () => {
        router.get(route('attendance.qr', { group: group.id }));
    };

    const handlePrint = () => {
        window.print();
    };

    const scanUrl = route('attendance.scan.form', { token });

    return (
        <AdminLayout title="رمز QR للحضور">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">رمز QR للحضور</h1>
                    <p className="text-gray-500 dark:text-gray-400">مسح الرمز لتسجيل الحضور</p>
                </div>

                <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{group.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {group.level?.name} - {new Date().toLocaleDateString('ar-SA')}
                        </p>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <div
                            className="inline-block rounded-xl border-4 border-indigo-100 p-4 dark:border-indigo-900"
                            dangerouslySetInnerHTML={{ __html: qr_svg }}
                        />
                    </div>

                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">رابط المسح:</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 break-all ltr">{scanUrl}</p>
                    </div>

                    <div className="mb-6 text-center">
                        {expired ? (
                            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                <p className="text-lg font-bold text-red-600 dark:text-red-400">انتهت صلاحية رمز QR</p>
                                <p className="text-sm text-red-500 dark:text-red-400">يرجى تجديد الرمز</p>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                <p className="text-sm text-green-600 dark:text-green-400">مدة الصلاحية المتبقية</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300" dir="ltr">{timeLeft}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {expired && (
                            <button
                                onClick={handleRefresh}
                                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                تجديد QR
                            </button>
                        )}
                        <button
                            onClick={handlePrint}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            طباعة QR
                        </button>
                        <Link
                            href={route('attendance.index')}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            العودة للحضور
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
