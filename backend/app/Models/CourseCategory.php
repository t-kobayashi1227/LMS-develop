<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseCategory extends Model
{
    use HasUuid;

    protected $fillable = ['name', 'slug', 'sort_order'];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
