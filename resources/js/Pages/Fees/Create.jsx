import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Create() {
    const { levels } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        title: '',
        amount: '',
        level_id: '',
        due_date: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('fees.store'));
    };

    return (
        <AdminLayout title="إضافة رسوم">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إضافة رسوم جديدة</h1>
                <p className="text-gray-500 dark:text-gray-400">أدخل بيانات الرسوم الدراسية</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="العنوان"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="المبلغ"
                            name="amount"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            error={errors.amount}
                            required
                        />
                        <FormSelect
                            label="المستوى"
                            name="level_id"
                            value={data.level_id}
                            onChange={(e) => setData('level_id', e.target.value)}
                            options={(levels || []).map((l) => ({ value: l.id, label: l.name }))}
                            error={errors.level_id}
                        />
                    </div>
                    <FormInput
                        label="تاريخ الاستحقاق"
                        name="due_date"
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                        error={errors.due_date}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            rows="3"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>حفظ</PrimaryButton>
                        <Link
                            href={route('fees.index')}
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
