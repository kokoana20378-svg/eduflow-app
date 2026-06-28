import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function FormInput({ label, name, value, onChange, type = 'text', error, placeholder, required = false, className = '' }) {
    return (
        <div className={className}>
            <InputLabel htmlFor={name} value={label} />
            <TextInput
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="mt-1 block w-full"
            />
            <InputError message={error} className="mt-1" />
        </div>
    );
}
