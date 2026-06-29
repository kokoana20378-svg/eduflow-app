import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Demo() {
    const { accounts } = usePage().props;
    const [loading, setLoading] = useState(null);

    const handleLogin = (email) => {
        setLoading(email);
        router.post(route('demo.login'), { email }, {
            onFinish: () => setLoading(null),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <span className="text-4xl font-bold text-white">EF</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">EduFlow</h1>
                    <p className="text-indigo-200">نظام إدارة المراكز التعليمية</p>
                    <p className="text-indigo-300 text-sm mt-2">اختر حساباً للدخول المباشر</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {accounts.map((account) => (
                        <button
                            key={account.email}
                            onClick={() => handleLogin(account.email)}
                            disabled={loading !== null}
                            className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-right transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-wait"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl transition group-hover:bg-white/30">
                                    {account.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white truncate">{account.name}</h3>
                                    <p className="text-sm text-indigo-200">{account.role}</p>
                                    <p className="text-xs text-indigo-300 mt-1 truncate">{account.email}</p>
                                </div>
                            </div>
                            {loading === account.email && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-indigo-300 text-sm">
                        كلمة المرور لجميع الحسابات:{' '}
                        <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">password</span>
                    </p>
                    <a
                        href={route('login')}
                        className="mt-4 inline-block text-sm text-indigo-200 underline transition hover:text-white"
                    >
                        تسجيل الدخول بالبريد وكلمة المرور
                    </a>
                </div>
            </div>
        </div>
    );
}
