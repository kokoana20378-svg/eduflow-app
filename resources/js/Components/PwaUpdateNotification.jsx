import { useEffect, useState } from 'react';

export default function PwaUpdateNotification() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        window.showUpdateNotification = () => setShow(true);
        return () => { delete window.showUpdateNotification; };
    }, []);

    if (!show) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
            <div className="rounded-xl bg-indigo-600 p-4 text-white shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">تحديث متاح</p>
                        <p className="text-xs text-indigo-200">انقر للحصول على أحدث إصدار</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                        تحديث
                    </button>
                    <button
                        onClick={() => setShow(false)}
                        className="text-white/80 hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
