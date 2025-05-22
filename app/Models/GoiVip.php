<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoiVip extends Model
{

    use HasFactory;
    protected $table = 'goi_vips';
    protected $fillable = [
        'id',
        'gia',
        'thoi_han',
        'trangthai',
        'created_at',
        'updated_at',
    ];
    public function users()
    {
        return $this->hasMany(UserGoiVip::class);
    }
}
