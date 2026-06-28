export default function Table({ headers, rows, actions }) {
    if (!rows || rows.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <svg className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg">لا توجد بيانات</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">#</th>
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                {header}
                            </th>
                        ))}
                        {actions && <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">الإجراءات</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="transition hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{rowIndex + 1}</td>
                            {row.cells.map((cell, cellIndex) => (
                                <td key={cellIndex} className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {cell}
                                </td>
                            ))}
                            {actions && (
                                <td className="whitespace-nowrap px-4 py-3 text-sm">
                                    {actions(row, rowIndex)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
