import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ student }) {
    const { levels, groups } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        name: student.user?.name || '',
        email: student.user?.email || '',
        phone: student.user?.phone || '',
        student_code: student.student_code || '',
        guardian_name: student.guardian_name || '',
        guardian_phone: student.guardian_phone || '',
        level_id: student.level_id || '',
        group_id: student.group_id || '',
        birth_date: student.birth_date || '',
        address: student.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('students.update', student.id));
    };

    return (
        <AdminLayout title="تعديل طالب">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل الطالب</h1>
                <p className="text-gray-500 dark:text-gray-400">تعديل بيانات الطالب</p>
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

                    <h3 className="border-b pb-2 text-lg font-medium text-gray-700 dark:text-gray-300">معلومات الطالب</h3>
                    <FormInput
                        label="كود الطالب"
                        name="student_code"
                        value={data.student_code}
                        onChange={(e) => setData('student_code', e.target.value)}
                        error={errors.student_code}
                    />
                    <FormInput
                        label="اسم ولي الأمر"
                        name="guardian_name"
                        value={data.guardian_name}
                        onChange={(e) => setData('guardian_name', e.target.value)}
                        error={errors.guardian_name}
                    />
                    <FormInput
                        label="هاتف ولي الأمر"
                        name="guardian_phone"
                        value={data.guardian_phone}
                        onChange={(e) => setData('guardian_phone', e.target.value)}
                        error={errors.guardian_phone}
                    />
                    <FormSelect
                        label="المستوى"
                        name="level_id"
                        value={data.level_id}
                        onChange={(e) => setData('level_id', e.target.value)}
                        options={(levels || []).map((l) => ({ value: l.id, label: l.name }))}
                        error={errors.level_id}
                    />
                    <FormSelect
                        label="المجموعة"
                        name="group_id"
                        value={data.group_id}
                        onChange={(e) => setData('group_id', e.target.value)}
                        options={(groups || []).map((g) => ({ value: g.id, label: g.name }))}
                        error={errors.group_id}
                    />
                    <FormInput
                        label="تاريخ الميلاد"
                        name="birth_date"
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        error={errors.birth_date}
                    />
                    <FormInput
                        label="العنوان"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        error={errors.address}
                    />

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('students.index')}
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
