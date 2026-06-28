import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Edit({ level }) {
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        name: level.name || '',
        code: level.code || '',
        order: level.order || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('levels.update', level.id));
    };

    return (
        <AdminLayout title="تعديل مستوى">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل المستوى</h1>
                <p className="text-gray-500 dark:text-gray-400">تعديل بيانات المستوى الدراسي</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="الاسم"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />
                    <FormInput
                        label="الكود"
                        name="code"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        error={errors.code}
                        required
                    />
                    <FormInput
                        label="الترتيب"
                        name="order"
                        type="number"
                        value={data.order}
                        onChange={(e) => setData('order', e.target.value)}
                        error={errors.order}
                    />

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('levels.index')}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
