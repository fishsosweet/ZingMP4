<?php

namespace App\Http\Controllers\User\ThongTinUser;

use App\Http\Controllers\Controller;
use App\Models\Playlist;
use Illuminate\Http\Request;

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

            // Kiểm tra xem playlist có thuộc về user đang đăng nhập không
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
}
