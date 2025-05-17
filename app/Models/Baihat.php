<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Baihat extends Model
{
    use HasFactory;
    protected $table='baihat';
    protected $fillable = [
        'id',
        'title',
        'casi_id',
        'theloai_id',
        'audio_url',
        'anh',
        'lyrics',
        'luotxem',
        'thoiluong',
        'trangthai',
        'vip',
        'luotthich',
        'created_at',
        'updated_at'
    ];
public function casi()
{
    return $this->belongsTo(CaSi::class, 'casi_id');
}

public function theloai()
{
    return $this->belongsTo(TheLoai::class, 'theloai_id');
}
public function playlists()
{
    return $this->belongsToMany(Playlist::class, 'playlist_song', 'song_id', 'playlist_id')->withTimestamps();
}

}
