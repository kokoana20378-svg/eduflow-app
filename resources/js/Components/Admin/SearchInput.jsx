import { useState, useCallback } from 'react';

export default function SearchInput({ onSearch, placeholder = 'بحث...', className = '' }) {
    const [value, setValue] = useState('');

    const handleChange = useCallback((e) => {
        const val = e.target.value;
        setValue(val);
        if (onSearch) onSearch(val);
    }, [onSearch]);

    const handleClear = () => {
        setValue('');
        if (onSearch) onSearch('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-8 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
