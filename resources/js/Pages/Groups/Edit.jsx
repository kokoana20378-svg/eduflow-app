import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ group }) {
    const { levels, teachers } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        name: group.name || '',
        level_id: group.level_id || '',
        teacher_id: group.teacher_id || '',
        max_students: group.max_students || '',
        room: group.room || '',
        schedule: group.schedule || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('groups.update', group.id));
    };

    return (
        <AdminLayout title="تعديل مجموعة">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل المجموعة</h1>
                <p className="text-gray-500 dark:text-gray-400">تعديل بيانات المجموعة الدراسية</p>
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
                    <FormSelect
                        label="المستوى"
                        name="level_id"
                        value={data.level_id}
                        onChange={(e) => setData('level_id', e.target.value)}
                        options={(levels || []).map((l) => ({ value: l.id, label: l.name }))}
                        error={errors.level_id}
                        required
                    />
                    <FormSelect
                        label="المدرس"
                        name="teacher_id"
                        value={data.teacher_id}
                        onChange={(e) => setData('teacher_id', e.target.value)}
                        options={(teachers || []).map((t) => ({ value: t.id, label: t.user?.name || t.teacher_code }))}
                        error={errors.teacher_id}
                    />
                    <FormInput
                        label="الحد الأقصى للطلاب"
                        name="max_students"
                        type="number"
                        value={data.max_students}
                        onChange={(e) => setData('max_students', e.target.value)}
                        error={errors.max_students}
                    />
                    <FormInput
                        label="القاعة"
                        name="room"
                        value={data.room}
                        onChange={(e) => setData('room', e.target.value)}
                        error={errors.room}
                    />
                    <FormInput
                        label="الموعد"
                        name="schedule"
                        value={data.schedule}
                        onChange={(e) => setData('schedule', e.target.value)}
                        error={errors.schedule}
                    />

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('groups.index')}
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
