import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function FormSelect({ label, name, value, onChange, options, error, placeholder = 'اختر...', required = false, className = '' }) {
    return (
        <div className={className}>
            <InputLabel htmlFor={name} value={label} />
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <InputError message={error} className="mt-1" />
        </div>
    );
}
