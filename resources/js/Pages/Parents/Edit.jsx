import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ parent }) {
    const { students, linked_students } = usePage().props;
    const { errors } = usePage().props;
    const linkedIds = (linked_students || []).map((s) => s.id);
    const { data, setData, put, processing } = useForm({
        name: parent.name || '',
        email: parent.email || '',
        phone: parent.phone || '',
        student_ids: linkedIds,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('parents.update', parent.id));
    };

    const handleStudentToggle = (studentId) => {
        const current = data.student_ids;
        if (current.includes(studentId)) {
            setData('student_ids', current.filter((id) => id !== studentId));
        } else {
            setData('student_ids', [...current, studentId]);
        }
    };

    return (
        <AdminLayout title="تعديل ولي أمر">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل ولي الأمر</h1>
                <p className="text-gray-500 dark:text-gray-400">تعديل بيانات ولي الأمر</p>
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
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">ربط الطلاب</label>
                        <div className="max-h-40 overflow-y-auto rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900">
                            {(students || []).length === 0 ? (
                                <p className="text-sm text-gray-500">لا يوجد طلاب</p>
                            ) : (
                                (students || []).map((s) => (
                                    <label key={s.id} className="flex cursor-pointer items-center gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            checked={data.student_ids.includes(s.id)}
                                            onChange={() => handleStudentToggle(s.id)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {s.user?.name || s.student_code} {s.student_code ? `(${s.student_code})` : ''}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                        {errors.student_ids && <p className="mt-1 text-sm text-red-600">{errors.student_ids}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('parents.index')}
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
