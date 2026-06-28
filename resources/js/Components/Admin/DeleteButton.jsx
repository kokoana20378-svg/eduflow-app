import { useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function DeleteButton({ onDelete, itemName = '' }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        onDelete();
        setShowConfirm(false);
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title="حذف"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">تأكيد الحذف</h3>
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            {itemName ? `هل أنت متأكد من حذف "${itemName}"؟` : 'هل أنت متأكد من حذف هذا العنصر؟'}
                        </p>
                        <div className="flex justify-start gap-3">
                            <DangerButton onClick={handleDelete}>حذف</DangerButton>
                            <SecondaryButton onClick={() => setShowConfirm(false)}>إلغاء</SecondaryButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
