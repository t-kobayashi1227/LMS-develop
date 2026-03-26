<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isSystem = is_null($this->sender_id);

        return [
            'id' => $this->uuid,
            'senderId' => $isSystem ? 'system' : $this->sender->uuid,
            'senderName' => $isSystem
                ? 'AI 学習アシスタント'
                : $this->sender->name . ($this->sender->isAdmin() ? ' (メンター)' : ''),
            'senderAvatar' => $isSystem
                ? '/default-avatar.svg'
                : $this->sender->avatarUrl(),
            'content' => $this->content,
            'timestamp' => $this->created_at->locale('ja')->diffForHumans(),
            'isUnread' => !$this->is_read,
            'type' => $this->type,
        ];
    }
}
