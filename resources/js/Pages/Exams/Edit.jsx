import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ exam }) {
    const { levels, groups } = usePage().props;
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        title: exam.title || '',
        level_id: exam.level_id || '',
        group_id: exam.group_id || '',
        subject: exam.subject || '',
        type: exam.type || '',
        total_marks: exam.total_marks || '',
        pass_marks: exam.pass_marks || '',
        exam_date: exam.exam_date || '',
        duration: exam.duration || '',
        description: exam.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('exams.update', exam.id));
    };

    return (
        <AdminLayout title="تعديل امتحان">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل الامتحان</h1>
                <p className="text-gray-500 dark:text-gray-400">تعديل بيانات الامتحان</p>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="المادة"
                            name="subject"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            error={errors.subject}
                        />
                        <FormSelect
                            label="النوع"
                            name="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            options={[
                                { value: 'midterm', label: 'نصف الفصل' },
                                { value: 'final', label: 'نهائي' },
                                { value: 'quiz', label: 'اختبار قصير' },
                                { value: 'assignment', label: 'واجب' },
                            ]}
                            error={errors.type}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="الدرجة النهائية"
                            name="total_marks"
                            type="number"
                            value={data.total_marks}
                            onChange={(e) => setData('total_marks', e.target.value)}
                            error={errors.total_marks}
                            required
                        />
                        <FormInput
                            label="درجة النجاح"
                            name="pass_marks"
                            type="number"
                            value={data.pass_marks}
                            onChange={(e) => setData('pass_marks', e.target.value)}
                            error={errors.pass_marks}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="تاريخ الامتحان"
                            name="exam_date"
                            type="date"
                            value={data.exam_date}
                            onChange={(e) => setData('exam_date', e.target.value)}
                            error={errors.exam_date}
                            required
                        />
                        <FormInput
                            label="المدة (بالدقائق)"
                            name="duration"
                            type="number"
                            value={data.duration}
                            onChange={(e) => setData('duration', e.target.value)}
                            error={errors.duration}
                        />
                    </div>
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
                        <PrimaryButton disabled={processing}>تحديث</PrimaryButton>
                        <Link
                            href={route('exams.index')}
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
