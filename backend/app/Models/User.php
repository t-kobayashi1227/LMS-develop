<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuid, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar_path', 'last_active_at',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_active_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function avatarUrl(): string
    {
        return $this->avatar_path
            ? asset('storage/' . $this->avatar_path)
            : '/default-avatar.svg';
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function assignmentSubmissions(): HasMany
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function quizAnswers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function courseRatings(): HasMany
    {
        return $this->hasMany(CourseRating::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isActive(): bool
    {
        return $this->last_active_at && $this->last_active_at->gte(now()->subDays(2));
    }
}
