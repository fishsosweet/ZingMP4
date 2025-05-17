<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;
    protected $table='playlists';
    protected $fillable = [
        'id',
        'ten_playlist',
        'user_id',
        'trangthai',
        'anh',
        'theloai_id',
        'created_at',
        'updated_at'
    ];
    public function baihats()
    {
        return $this->belongsToMany(Baihat::class, 'playlist_song', 'playlist_id', 'song_id')->withTimestamps();
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function theloai()
    {
        return $this->belongsTo(TheLoai::class, 'theloai_id');
    }
}
