import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function QRScan() {
    const { token, group, students, expires_at, error, expired } = usePage().props;
    const [timeLeft, setTimeLeft] = useState('');
    const [manualToken, setManualToken] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        student_id: '',
    });

    useEffect(() => {
        if (expires_at) {
            const update = () => {
                const now = new Date();
                const exp = new Date(expires_at);
                const diff = exp - now;
                if (diff <= 0) {
                    setTimeLeft('منتهي');
                    return;
                }
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
            };
            update();
            const interval = setInterval(update, 1000);
            return () => clearInterval(interval);
        }
    }, [expires_at]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('attendance.scan'));
    };

    const handleTokenSubmit = (e) => {
        e.preventDefault();
        window.location.href = route('attendance.scan.form', { token: manualToken });
    };

    return (
        <AdminLayout title="مسح QR">
            <div className="mx-auto max-w-xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مسح رمز QR</h1>
                    <p className="text-gray-500 dark:text-gray-400">تسجيل الحضور عبر رمز QR</p>
                </div>

                {error && !group && (
                    <div className="rounded-lg bg-red-50 p-6 text-center shadow-md dark:bg-red-900/20">
                        <svg className="mx-auto mb-3 h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">{error}</p>
                        <a
                            href={route('attendance.scan.form')}
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            إدخال رمز آخر
                        </a>
                    </div>
                )}

                {expired && group && (
                    <div className="rounded-lg bg-yellow-50 p-6 text-center shadow-md dark:bg-yellow-900/20">
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{error || 'رمز QR منتهي الصلاحية'}</p>
                        <p className="text-sm text-yellow-500 dark:text-yellow-400">المجموعة: {group.name}</p>
                        <a
                            href={route('attendance.scan.form')}
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            إدخال رمز آخر
                        </a>
                    </div>
                )}

                {token && group && !expired && !error && (
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{group.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{group.level?.name}</p>
                            {expires_at && (
                                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                    الوقت المتبقي: <span className="font-bold" dir="ltr">{timeLeft}</span>
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="hidden" name="token" value={data.token} />

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">اختر الطالب</label>
                                <select
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    required
                                >
                                    <option value="">-- اختر الطالب --</option>
                                    {(students || []).map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.student_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'جاري التسجيل...' : 'تسجيل حضور'}
                            </button>
                        </form>
                    </div>
                )}

                {!token && (
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-center text-lg font-bold text-gray-800 dark:text-white">إدخال رمز QR</h2>
                        <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            أدخل رمز QR الذي حصلت عليه من المعلم
                        </p>

                        <form onSubmit={handleTokenSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">رمز QR</label>
                                <input
                                    type="text"
                                    value={manualToken}
                                    onChange={(e) => setManualToken(e.target.value)}
                                    placeholder="أدخل رمز QR هنا"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700"
                            >
                                تحقق من الرمز
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
