<?php

namespace App\Http\Controllers\User\ThongTinUser;

use App\Http\Controllers\Controller;
use App\Models\Baihat;
use App\Models\Casi;
use App\Models\Playlist;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongTinUser extends Controller
{
    public function postPlayList(Request $request)
    {
        try {
            Playlist::create([
                'ten_playlist' => $request->name,
                'user_id' => $request->user_id,
                'trangthai' => 1,
                'anh' => "uploads/2025/05/18/theme.jpg"
            ]);
            return response()->json([
                'success' => 'Thêm playlist thành công'
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Thêm playlist thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }


    public function getPlaylist($user)
    {
        try {
            $playlist = Playlist::where('trangthai', 1)->where('user_id', $user)->orderBy('created_at', 'desc')->get();
            return response()->json($playlist, 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    public function getSongsInPlaylist($playlistId)
    {
        try {
            $playlist = Playlist::with(['baihats.casi:id,ten_casi'])->find($playlistId);

            if (!$playlist) {
                return response()->json([
                    'error' => 'Không tìm thấy playlist'
                ], 404);
            }
            $user = auth('api')->user();
            if ($playlist->user_id !== $user->id) {
                return response()->json([
                    'error' => 'Bạn không có quyền truy cập playlist này'
                ], 403);
            }

            $songs = $playlist->baihats->map(function ($song) {
                return [
                    'id' => $song->id,
                    'title' => $song->title,
                    'audio_url' => $song->audio_url,
                    'anh' => $song->anh,
                    'casi' => [
                        'id' => $song->casi->id,
                        'ten_casi' => $song->casi->ten_casi
                    ]
                ];
            });

            return response()->json($songs, 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Lỗi khi lấy danh sách bài hát',
                'message' => $exception->getMessage()
            ], 500);
        }
    }
    public function getLikedSongs($userId)
    {
        $user = User::findOrFail($userId);
        $likedSongs = $user->favoriteSongs()->get();

        return response()->json($likedSongs);
    }


    public function deleteLike($userId, $songId)
    {
        $user = User::findOrFail($userId);
        $user->favoriteSongs()->detach($songId);
        return response()->json(['message' => 'Đã xóa bài hát khỏi danh sách yêu thích']);
    }

    public function addLike(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->favoriteSongs()->syncWithoutDetaching([$request->song_id]);
        $song = Baihat::findOrFail($request->song_id);
        $song->increment('luotthich');
        return response()->json(['message' => 'Đã thêm bài hát vào danh sách yêu thích']);
    }

    public function getLikedSongsofUser(Request $request)
    {
        $songIds = $request->input('song_ids');

        $songs = Baihat::with('casi')->whereIn('id', $songIds)->get();

        return response()->json($songs);
    }
    public function deletPlaylist($idPlaylist)
    {
        Playlist::destroy($idPlaylist);
        return response()->json('Xóa playlist thành cong');
    }


    public function register(Request $request)
    {
        $request->validate([
            'anh' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);
        try {
            $pathanh='';
            if($request->hasFile('image') && $request->file('image')->isValid()){
                $nameimage = $request->file('image')->getClientOriginalName();
                $path = 'uploads/' . date("Y/m/d");
                if (!file_exists(public_path($path))) {
                    mkdir(public_path($path), 0777, true);
                }
                $request->file('image')->move(public_path($path), $nameimage);
                $pathanh = $path . '/' . $nameimage;

            }
            User::create([
                'name' => $request->name,
                'email'=> $request->email,
                'password' => bcrypt($request->password),
                'image'=> $pathanh,
                'phone'=>$request->phone
            ]);
            return response()->json([
                'success' => 'Thêm tài khoản thành công'
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Thêm tài khoản thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        $exists = User::where('email', $email)->exists();

        return response()->json($exists);
    }

}
