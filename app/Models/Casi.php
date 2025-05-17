<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Casi extends Model
{
    use HasFactory;
    protected $table='casi';
    protected $fillable = [
        'id',
        'ten_casi',
        'gioitinh',
        'mota',
        'anh',
        'created_at',
        'updated_at'
    ];
    public function baihats()
    {
        return $this->hasMany(BaiHat::class, 'casi_id');
    }
}
