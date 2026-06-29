import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import FlashMessage from '@/Components/Admin/FlashMessage';
import PwaInstallPrompt from '@/Components/PwaInstallPrompt';
import PwaUpdateNotification from '@/Components/PwaUpdateNotification';

const allNavigation = [
    { name: 'الرئيسية', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'المستويات', href: '/levels', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'المجموعات', href: '/groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'الطلاب', href: '/students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { name: 'المدرسين', href: '/teachers', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    {
        name: 'الحضور',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        children: [
            { name: 'سجل الحضور', href: '/attendance' },
            { name: 'تسجيل حضور', href: '/attendance/create' },
            { name: 'QR Scanner', href: '/attendance/scan' },
        ],
    },
    { name: 'الامتحانات', href: '/exams', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'الرسوم', href: '/fees', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'المدفوعات', href: '/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'الإشعارات', href: '/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'أولياء الأمور', href: '/parents', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'الذكاء الاصطناعي', href: '/ai', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
    { name: 'الملف الشخصي', href: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

const roleAccess = {
    admin: ['/dashboard', '/levels', '/groups', '/students', '/teachers', '/attendance', '/exams', '/fees', '/payments', '/notifications', '/parents', '/ai', '/profile'],
    teacher: ['/dashboard', '/groups', '/students', '/attendance', '/exams', '/payments', '/notifications', '/ai', '/profile'],
    student: ['/dashboard', '/attendance', '/exams', '/payments', '/notifications', '/profile'],
    parent: ['/dashboard', '/exams', '/payments', '/notifications', '/profile'],
};

function NavSubmenu({ item, userRole }) {
    const [open, setOpen] = useState(true);

    const allowedChildren = item.children.filter(c => roleAccess[userRole]?.some(r => c.href.startsWith(r)));
    if (allowedChildren.length === 0) return null;

    const isActive = allowedChildren.some((c) => window.location.pathname === c.href);

    return (
        <div className="mb-1">
            <button
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
            >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="flex-1 text-right">{item.name}</span>
                <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="mr-6 mt-1 space-y-1 border-r-2 border-indigo-200 pr-2 dark:border-indigo-800">
                    {allowedChildren.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-lg px-3 py-2 text-sm transition ${
                                window.location.pathname === child.href
                                    ? 'text-indigo-700 dark:text-indigo-300'
                                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            {child.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({ children, title = 'EduFlow' }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const navigation = allNavigation.filter(item => {
        if (item.children) {
            const allowed = item.children.filter(c => roleAccess[user.role]?.some(r => c.href.startsWith(r)));
            return allowed.length > 0;
        }
        return roleAccess[user.role]?.some(r => item.href.startsWith(r));
    });

    return (
        <div dir="rtl" className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Head title={title} />
            <FlashMessage />
            <PwaInstallPrompt />
            <PwaUpdateNotification />

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed right-0 top-0 z-40 h-full w-64 transform bg-white shadow-lg transition-transform duration-200 dark:bg-gray-800 lg:relative lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <Link href="/dashboard" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        EduFlow
                    </Link>
                </div>
                <nav className="mt-4 overflow-y-auto px-3" style={{ height: 'calc(100% - 4rem)' }}>
                    {navigation.map((item) =>
                        item.children ? (
                            <NavSubmenu key={item.name} item={item} userRole={user.role} />
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    window.location.pathname.startsWith(item.href)
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                            >
                                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                {item.name}
                            </Link>
                        )
                    )}
                </nav>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="hidden text-right md:block">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role || 'مستخدم'}</p>
                                </div>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                    <div className="absolute left-0 z-20 mt-1 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 dark:bg-gray-700">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            الملف الشخصي
                                        </Link>
                                        <button
                                            onClick={() => { setShowUserMenu(false); handleLogout(); }}
                                            className="block w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            تسجيل الخروج
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
