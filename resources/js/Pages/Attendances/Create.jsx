import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const { groups } = usePage().props;
    const { errors } = usePage().props;
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState({});

    const loadStudents = async () => {
        if (!selectedGroup || !selectedDate) return;
        setLoading(true);
        try {
            const response = await fetch(`/attendance/group/${selectedGroup}/${selectedDate}`);
            const data = await response.json();
            setStudents(data.students || []);
            const initial = {};
            (data.students || []).forEach((s) => {
                initial[s.id] = s.status || 'present';
            });
            setAttendanceData(initial);
        } catch (e) {
            setStudents([]);
        }
        setLoading(false);
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
    };

    const { setData, post, processing } = useForm({
        records: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const records = Object.entries(attendanceData).map(([studentId, status]) => ({
            student_id: parseInt(studentId),
            group_id: parseInt(selectedGroup),
            date: selectedDate,
            status,
        }));
        setData('records', records);
        post(route('attendance.store'));
    };

    const statusOptions = [
        { value: 'present', label: 'حاضر', color: 'text-green-600' },
        { value: 'absent', label: 'غائب', color: 'text-red-600' },
        { value: 'excused', label: 'معذر', color: 'text-yellow-600' },
        { value: 'late', label: 'متأخر', color: 'text-orange-600' },
    ];

    return (
        <AdminLayout title="تسجيل حضور">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تسجيل حضور</h1>
                <p className="text-gray-500 dark:text-gray-400">تسجيل حضور الطلاب</p>
            </div>

            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                {/* Selection */}
                <div className="mb-6 flex flex-wrap items-end gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">المجموعة</label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="">اختر مجموعة</option>
                            {(groups || []).map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">التاريخ</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={loadStudents}
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        تحميل الطلاب
                    </button>
                </div>

                {loading && <p className="text-center text-gray-500">جاري التحميل...</p>}

                {students.length > 0 && (
                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">#</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">الطالب</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-300">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {students.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{student.name}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-3">
                                                    {statusOptions.map((opt) => (
                                                        <label key={opt.value} className="flex cursor-pointer items-center gap-1">
                                                            <input
                                                                type="radio"
                                                                name={`status_${student.id}`}
                                                                value={opt.value}
                                                                checked={attendanceData[student.id] === opt.value}
                                                                onChange={() => handleStatusChange(student.id, opt.value)}
                                                                className="text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className={`text-sm ${opt.color}`}>{opt.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.attendances && (
                            <p className="mt-2 text-sm text-red-600">{errors.attendances}</p>
                        )}

                        <div className="mt-6 flex items-center gap-3">
                            <PrimaryButton disabled={processing}>حفظ الحضور</PrimaryButton>
                            <Link
                                href={route('attendance.index')}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                إلغاء
                            </Link>
                        </div>
                    </form>
                )}

                {students.length === 0 && !loading && (
                    <p className="py-8 text-center text-gray-500 dark:text-gray-400">اختر مجموعة وتاريخ ثم اضغط "تحميل الطلاب"</p>
                )}
            </div>
        </AdminLayout>
    );
}
