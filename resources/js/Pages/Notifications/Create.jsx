import AdminLayout from '@/Layouts/AdminLayout';
import FormInput from '@/Components/Admin/FormInput';
import FormSelect from '@/Components/Admin/FormSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const { errors, groups } = usePage().props;
    const { data, setData, post, processing } = useForm({
        type: '',
        recipient_type: '',
        recipient_id: '',
        group_id: '',
        title: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('notifications.store'));
    };

    const recipientOptions = [
        { value: 'all', label: 'الجميع' },
        { value: 'students', label: 'الطلاب' },
        { value: 'teachers', label: 'المدرسين' },
        { value: 'parents', label: 'أولياء الأمور' },
        { value: 'group', label: 'مجموعة محددة' },
        { value: 'all_parents', label: 'جميع أولياء الأمور' },
        { value: 'all_teachers', label: 'جميع المدرسين' },
    ];

    return (
        <AdminLayout title="إضافة إشعار">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إضافة إشعار جديد</h1>
                <p className="text-gray-500 dark:text-gray-400">إنشاء وإرسال إشعار</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect
                            label="نوع الإرسال"
                            name="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            options={[
                                { value: 'whatsapp', label: 'واتساب' },
                                { value: 'email', label: 'بريد إلكتروني' },
                            ]}
                            error={errors.type}
                            required
                        />
                        <FormSelect
                            label="نوع المستلم"
                            name="recipient_type"
                            value={data.recipient_type}
                            onChange={(e) => setData('recipient_type', e.target.value)}
                            options={recipientOptions}
                            error={errors.recipient_type}
                            required
                        />
                    </div>

                    {data.recipient_type === 'group' && groups && (
                        <FormSelect
                            label="المجموعة"
                            name="group_id"
                            value={data.group_id}
                            onChange={(e) => setData('group_id', e.target.value)}
                            options={groups.map((g) => ({
                                value: g.id,
                                label: g.name + (g.level ? ' - ' + g.level.name : ''),
                            }))}
                            error={errors.group_id}
                            required
                        />
                    )}

                    {data.recipient_type === 'all' && (
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                            سيتم إرسال الإشعار لجميع الطلاب وأولياء الأمور
                        </p>
                    )}

                    <FormInput
                        label="العنوان"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الرسالة</label>
                        <textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            rows="5"
                            required
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <PrimaryButton disabled={processing}>حفظ</PrimaryButton>
                        <Link
                            href={route('notifications.index')}
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
