import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Create() {
    const { levels, teachers } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        name: '',
        level_id: '',
        teacher_id: '',
        max_students: '',
        room: '',
        schedule: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('groups.store'));
    };

    return (
        <AdminLayout title="إضافة مجموعة">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إضافة مجموعة جديدة</h1>
                <p className="text-gray-500 dark:text-gray-400">أدخل بيانات المجموعة الدراسية</p>
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
                        placeholder="مثال: الأحد والأربعاء 10:00 ص"
                        error={errors.schedule}
                    />

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>حفظ</PrimaryButton>
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
