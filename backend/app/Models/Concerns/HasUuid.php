<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasUuid
{
    public static function bootHasUuid(): void
    {
        static::creating(function ($model) {
            $model->uuid = $model->uuid ?: Str::uuid()->toString();
        });
    }
}
