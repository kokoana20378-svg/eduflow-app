import { useEffect, useState } from 'react';

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            setIsInstalled(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.showUpdateNotification = () => setShowUpdate(true);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowInstall(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstall(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowInstall(false);
        sessionStorage.setItem('eduflow_install_dismissed', 'true');
    };

    useEffect(() => {
        if (sessionStorage.getItem('eduflow_install_dismissed') === 'true') {
            setShowInstall(false);
        }
    }, []);

    if (isInstalled || !showInstall) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
            <div className="rounded-xl bg-white p-4 shadow-2xl ring-1 ring-black/5 dark:bg-gray-800">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
                        <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">تثبيت EduFlow</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">أضف التطبيق إلى الشاشة الرئيسية للوصول السريع</p>
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                            >
                                تثبيت
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                لاحقاً
                            </button>
                        </div>
                    </div>
                    <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
