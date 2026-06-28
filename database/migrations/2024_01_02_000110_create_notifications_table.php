<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['email', 'whatsapp', 'sms', 'in_app']);
            $table->enum('recipient_type', ['teacher', 'student', 'parent']);
            $table->foreignId('recipient_id')->nullable();
            $table->string('title');
            $table->text('message');
            $table->enum('status', ['pending', 'sent', 'failed']);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
