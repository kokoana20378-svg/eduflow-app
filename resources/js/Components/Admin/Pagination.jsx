import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-4 flex items-center justify-center gap-1">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className="cursor-not-allowed rounded px-3 py-1 text-sm text-gray-400 dark:text-gray-600"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`rounded px-3 py-1 text-sm transition ${
                            link.active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
