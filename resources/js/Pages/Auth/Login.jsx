import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>

            {/* Demo Quick Login */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">
                    🚀 تجربة سريعة — اختر دور المستخدم
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { role: 'admin', email: 'admin@eduflow.local', label: 'مدير النظام', color: 'bg-indigo-600 hover:bg-indigo-700' },
                        { role: 'teacher', email: 'teacher1@eduflow.local', label: 'مدرس', color: 'bg-emerald-600 hover:bg-emerald-700' },
                        { role: 'student', email: 'student1@eduflow.local', label: 'طالب', color: 'bg-amber-600 hover:bg-amber-700' },
                        { role: 'parent', email: 'parent1@eduflow.local', label: 'ولي أمر', color: 'bg-rose-600 hover:bg-rose-700' },
                    ].map((item) => (
                        <button
                            key={item.role}
                            type="button"
                            onClick={() => router.post(route('login'), { email: item.email, password: 'password' })}
                            className={`w-full px-3 py-2.5 rounded-xl text-white text-xs font-bold ${item.color} transition hover:scale-105 shadow-sm`}
                        >
                            {item.label}
                            <span className="block text-[10px] opacity-80 mt-0.5">({item.email.split('@')[0]})</span>
                        </button>
                    ))}
                </div>
                <p className="text-center text-[11px] text-gray-400 mt-3">
                    كل الحسابات بكلمة مرور: <span className="font-mono font-bold">password</span>
                </p>
            </div>
        </GuestLayout>
    );
}
