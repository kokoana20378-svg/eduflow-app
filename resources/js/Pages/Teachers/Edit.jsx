import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ teacher }) {
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        name: teacher.user?.name || '',
        email: teacher.user?.email || '',
        phone: teacher.user?.phone || '',
        teacher_code: teacher.teacher_code || '',
        specialization: teacher.specialization || '',
        qualification: teacher.qualification || '',
        hire_date: teacher.hire_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('teachers.update', teacher.id));
    };

    return (
        <AdminLayout title="تعديل مدرس">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل المدرس</h1>
                <p className="text-gray-500 dark:text-gray-400">تعديل بيانات المدرس</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-medium text-gray-700 dark:text-gray-300">معلومات الحساب</h3>
                    <FormInput
                        label="الاسم"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />
                    <FormInput
                        label="البريد الإلكتروني"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        required
                    />
                    <FormInput
                        label="رقم الهاتف"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        error={errors.phone}
                    />

                    <h3 className="border-b pb-2 text-lg font-medium text-gray-700 dark:text-gray-300">معلومات المدرس</h3>
                    <FormInput
                        label="كود المدرس"
                        name="teacher_code"
                        value={data.teacher_code}
                        onChange={(e) => setData('teacher_code', e.target.value)}
                        error={errors.teacher_code}
                    />
                    <FormInput
                        label="التخصص"
                        name="specialization"
                        value={data.specialization}
                        onChange={(e) => setData('specialization', e.target.value)}
                        error={errors.specialization}
                    />
                    <FormInput
                        label="المؤهل"
                        name="qualification"
                        value={data.qualification}
                        onChange={(e) => setData('qualification', e.target.value)}
                        error={errors.qualification}
                    />
                    <FormInput
                        label="تاريخ التعيين"
                        name="hire_date"
                        type="date"
                        value={data.hire_date}
                        onChange={(e) => setData('hire_date', e.target.value)}
                        error={errors.hire_date}
                    />

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('teachers.index')}
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
