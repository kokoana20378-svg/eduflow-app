import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const { exam, students } = usePage().props;
    const { errors } = usePage().props;
    const [marks, setMarks] = useState({});
    const [notes, setNotes] = useState({});

    const handleMarksChange = (studentId, value) => {
        setMarks((prev) => ({ ...prev, [studentId]: value }));
    };

    const handleNotesChange = (studentId, value) => {
        setNotes((prev) => ({ ...prev, [studentId]: value }));
    };

    const { setData, post, processing } = useForm({
        results: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const results = (students || []).map((s) => ({
            student_id: s.id,
            marks_obtained: marks[s.id] ?? 0,
            notes: notes[s.id] || null,
        }));
        setData('results', results);
        post(route('exam-results.store', exam.id));
    };

    const list = students || [];

    return (
        <AdminLayout title={`إضافة نتائج: ${exam?.title || ''}`}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    إضافة نتائج: {exam?.title || ''}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">الدرجة النهائية: {exam?.total_marks}</p>
            </div>

            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                {list.length === 0 ? (
                    <p className="py-8 text-center text-gray-500 dark:text-gray-400">لا يوجد طلاب في هذا الامتحان</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">#</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">الطالب</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">الدرجة</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">ملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {list.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{student.user?.name || student.student_code}</td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    max={exam?.total_marks}
                                                    value={marks[student.id] || ''}
                                                    onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                    placeholder="0"
                                                />
                                                {errors[`marks.${student.id}`] && (
                                                    <p className="text-xs text-red-600">{errors[`marks.${student.id}`]}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={notes[student.id] || ''}
                                                    onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                    placeholder="اختياري"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.marks && <p className="mt-2 text-sm text-red-600">{errors.marks}</p>}

                        <div className="mt-6 flex items-center gap-3">
                            <PrimaryButton disabled={processing}>حفظ النتائج</PrimaryButton>
                            <Link
                                href={route('exam-results.index', exam.id)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                إلغاء
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
