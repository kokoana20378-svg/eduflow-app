<?php
namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationMail;

class NotificationService
{
    public function sendWhatsApp(Notification $notification)
    {
        $recipient = $this->getRecipient($notification);
        if (!$recipient || !$recipient->phone) {
            $notification->update(['status' => 'failed']);
            return false;
        }

        $config = config('services.whatsapp');

        try {
            $phone = $recipient->phone;
            if (str_starts_with($phone, '0')) {
                $phone = '2' . substr($phone, 1);
            }

            $sent = false;

            if ($config['ultramsg_token'] && $config['ultramsg_instance']) {
                $response = Http::post("https://api.ultramsg.com/{$config['ultramsg_instance']}/messages/chat", [
                    'token' => $config['ultramsg_token'],
                    'to' => $phone,
                    'body' => $notification->message,
                ]);
                if ($response->successful()) $sent = true;
            }

            if (!$sent && $config['chatapi_token'] && $config['chatapi_instance']) {
                $response = Http::post("https://api.chat-api.com/instance{$config['chatapi_instance']}/sendMessage", [
                    'token' => $config['chatapi_token'],
                    'phone' => $phone,
                    'body' => $notification->message,
                ]);
                if ($response->successful()) $sent = true;
            }

            if (!$sent && $config['wati_token']) {
                $response = Http::withToken($config['wati_token'])
                    ->post("https://api.wati.io/api/v1/sendSessionMessage/{$phone}", [
                        'messageText' => $notification->title . "\n\n" . $notification->message,
                    ]);
                if ($response->successful()) $sent = true;
            }

            $notification->update([
                'status' => $sent ? 'sent' : 'failed',
                'sent_at' => now(),
            ]);

            return $sent;
        } catch (\Exception $e) {
            $notification->update(['status' => 'failed']);
            return false;
        }
    }

    public function sendEmail(Notification $notification)
    {
        $recipient = $this->getRecipient($notification);
        if (!$recipient || !$recipient->email) {
            $notification->update(['status' => 'failed']);
            return false;
        }

        try {
            Mail::to($recipient->email)->send(new NotificationMail($notification));
            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
            return true;
        } catch (\Exception $e) {
            $notification->update(['status' => 'failed']);
            return false;
        }
    }

    private function getRecipient(Notification $notification)
    {
        if (!$notification->recipient_id) return null;

        return match($notification->recipient_type) {
            'teacher' => User::whereHas('teacher', fn($q) => $q->where('id', $notification->recipient_id))->first(),
            'student' => User::whereHas('student', fn($q) => $q->where('id', $notification->recipient_id))->first(),
            'parent' => User::whereHas('parent', fn($q) => $q->where('id', $notification->recipient_id))->first(),
            default => User::find($notification->recipient_id),
        };
    }

    public function sendBulkToGroup($groupId, $title, $message, $type = 'whatsapp')
    {
        $students = \App\Models\Student::where('group_id', $groupId)->with('user')->get();
        $count = 0;
        foreach ($students as $student) {
            $notification = Notification::create([
                'type' => $type,
                'recipient_type' => 'student',
                'recipient_id' => $student->id,
                'title' => $title,
                'message' => $message,
                'status' => 'pending',
            ]);
            if ($type === 'whatsapp') {
                if ($this->sendWhatsApp($notification)) $count++;
            } else {
                if ($this->sendEmail($notification)) $count++;
            }
        }
        return $count;
    }

    public function sendBulkToAllParents($title, $message, $type = 'whatsapp')
    {
        $parents = \App\Models\ParentModel::with('user')->get();
        $count = 0;
        foreach ($parents as $parent) {
            $notification = Notification::create([
                'type' => $type,
                'recipient_type' => 'parent',
                'recipient_id' => $parent->id,
                'title' => $title,
                'message' => $message,
                'status' => 'pending',
            ]);
            if ($type === 'whatsapp') {
                if ($this->sendWhatsApp($notification)) $count++;
            } else {
                if ($this->sendEmail($notification)) $count++;
            }
        }
        return $count;
    }
}
