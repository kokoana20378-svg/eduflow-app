export default function StatsCard({ title, value, icon, color = 'indigo' }) {
    const colorClasses = {
        indigo: 'bg-indigo-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        teal: 'bg-teal-500',
    };

    return (
        <div className="flex items-center rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${colorClasses[color] || colorClasses.indigo} ml-4`}>
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
}
