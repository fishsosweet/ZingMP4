<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TheLoai extends Model
{
    use HasFactory;
    protected $table='theloai';
    protected $fillable = [
        'id',
        'ten_theloai',
        'trangthai',
        'created_at',
        'updated_at'
    ];
    public function baihats()
    {
        return $this->hasMany(BaiHat::class, 'theloai_id');
    }

    public function playlists()
    {
        return $this->hasMany(Playlist::class, 'theloai_id');
    }
}
