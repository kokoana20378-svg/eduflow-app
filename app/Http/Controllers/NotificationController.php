<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Notification;
use App\Models\Student;
use App\Models\User;
use App\Models\ParentModel;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $query = Notification::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    public function create()
    {
        $parents = User::where('role', 'parent')->get();
        $students = Student::with('user')->get();
        $groups = Group::with('level')->get();
        return Inertia::render('Notifications/Create', [
            'parents' => $parents,
            'students' => $students,
            'groups' => $groups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:whatsapp,email',
            'recipient_type' => 'required|string|in:parent,student,teacher,group,all_parents,all_teachers',
            'recipient_id' => 'nullable|integer',
            'group_id' => 'nullable|integer|exists:groups,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validated['recipient_type'] === 'group') {
            $count = $this->notificationService->sendBulkToGroup(
                $validated['group_id'],
                $validated['title'],
                $validated['message'],
                $validated['type']
            );
            return redirect()->back()->with('success', "تم إرسال {$count} إشعار");
        }

        if ($validated['recipient_type'] === 'all_parents') {
            $count = $this->notificationService->sendBulkToAllParents(
                $validated['title'],
                $validated['message'],
                $validated['type']
            );
            return redirect()->back()->with('success', "تم إرسال {$count} إشعار");
        }

        if ($validated['recipient_type'] === 'all_teachers') {
            $teachers = User::where('role', 'teacher')->with('teacher')->get();
            foreach ($teachers as $teacher) {
                Notification::create([
                    'type' => $validated['type'],
                    'recipient_type' => 'teacher',
                    'recipient_id' => $teacher->teacher->id,
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'status' => 'pending',
                ]);
            }
            return redirect()->back()->with('success', 'تم الحفظ بنجاح');
        }

        Notification::create([
            'type' => $validated['type'],
            'recipient_type' => $validated['recipient_type'],
            'recipient_id' => $validated['recipient_id'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'تم الحفظ بنجاح');
    }

    public function sendWhatsApp($id)
    {
        $notification = Notification::findOrFail($id);
        $result = $this->notificationService->sendWhatsApp($notification);

        if ($result) {
            return redirect()->back()->with('success', 'تم إرسال الإشعار عبر واتساب');
        }
        return redirect()->back()->with('error', 'فشل إرسال الإشعار عبر واتساب');
    }

    public function sendEmail($id)
    {
        $notification = Notification::findOrFail($id);
        $result = $this->notificationService->sendEmail($notification);

        if ($result) {
            return redirect()->back()->with('success', 'تم إرسال الإشعار عبر البريد الإلكتروني');
        }
        return redirect()->back()->with('error', 'فشل إرسال الإشعار عبر البريد الإلكتروني');
    }

    public function sendBulk(Request $request)
    {
        $validated = $request->validate([
            'recipient_type' => 'required|string|in:group,all_parents,all_teachers',
            'group_id' => 'required_if:recipient_type,group|integer|exists:groups,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|string|in:whatsapp,email',
        ]);

        $count = 0;

        if ($validated['recipient_type'] === 'group') {
            $count = $this->notificationService->sendBulkToGroup(
                $validated['group_id'],
                $validated['title'],
                $validated['message'],
                $validated['type']
            );
        } elseif ($validated['recipient_type'] === 'all_parents') {
            $count = $this->notificationService->sendBulkToAllParents(
                $validated['title'],
                $validated['message'],
                $validated['type']
            );
        } elseif ($validated['recipient_type'] === 'all_teachers') {
            $teachers = User::where('role', 'teacher')->with('teacher')->get();
            foreach ($teachers as $teacher) {
                $notification = Notification::create([
                    'type' => $validated['type'],
                    'recipient_type' => 'teacher',
                    'recipient_id' => $teacher->teacher->id,
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'status' => 'pending',
                ]);
                if ($validated['type'] === 'whatsapp') {
                    if ($this->notificationService->sendWhatsApp($notification)) $count++;
                } else {
                    if ($this->notificationService->sendEmail($notification)) $count++;
                }
            }
        }

        return redirect()->back()->with('success', "تم إرسال {$count} إشعار بنجاح");
    }

    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return redirect()->back()->with('success', 'تم الحذف');
    }

    public function bulkForm()
    {
        $groups = Group::with('level')->get();
        return Inertia::render('Notifications/SendBulk', [
            'groups' => $groups,
        ]);
    }
}
