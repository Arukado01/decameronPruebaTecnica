<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nit',
        'address',
        'city',
        'max_rooms',
    ];

    // -------- relationships ----------
    public function inventories(): HasMany
    {
        return $this->hasMany(RoomInventory::class);
    }
}
