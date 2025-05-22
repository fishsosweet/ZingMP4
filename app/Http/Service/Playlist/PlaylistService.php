<?php

namespace App\Http\Service\Playlist;

use App\Http\Controllers\Controller;
use App\Models\Casi;
use App\Models\Playlist;

class PlaylistService extends Controller
{
    public function post($request)
    {
        $request->validate([
            'anh' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);
        try {
            $pathanh = '';
            if ($request->hasFile('anh') && $request->file('anh')->isValid()) {
                $nameimage = $request->file('anh')->getClientOriginalName();
                $path = 'uploads/' . date("Y/m/d");
                if (!file_exists(public_path($path))) {
                    mkdir(public_path($path), 0777, true);
                }
                $request->file('anh')->move(public_path($path), $nameimage);
                $pathanh = $path . '/' . $nameimage;
            }

            Playlist::create([
                'ten_playlist' => $request->tenPlaylist,
                'user_id' => auth('api')->id(),
                'trangthai' => $request->trangThai,
                'theloai_id' => $request->theloai_id,
                'anh' => $pathanh,
                'created_at' => $request->ngayTao,
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
    public function update($request, $id)
    {
        $request->validate([
            'anh' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);
        try {

            $playlist = Playlist::find($id);
            if (!$playlist) {

                return response()->json(['error' => 'Playlist không tồn tại'], 404);
            }
            $pathanh = '';
            if ($request->hasFile('anh') && $request->file('anh')->isValid()) {
                $nameimage = $request->file('anh')->getClientOriginalName();
                $path = 'uploads/' . date("Y/m/d");
                if (!file_exists(public_path($path))) {
                    mkdir(public_path($path), 0777, true);
                }
                $request->file('anh')->move(public_path($path), $nameimage);
                $pathanh = $path . '/' . $nameimage;
            }

            $playlist->ten_playlist = $request->tenPlaylist;
            $playlist->trangthai = $request->trangThai;
            $playlist->theloai_id = $request->theloai_id;
            $playlist->anh = $pathanh;
            $playlist->updated_at = $request->ngayCapNhat;
            $playlist->save();
            return response()->json(['success' => 'Cập nhật playlist thành công'], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Cập nhật playlist thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }


    public function list()
    {
        $per_page = request()->get('per_page', 10);
        $playlist = Playlist::with('user:id,name')
            ->where('user_id', auth('api')->id())
            ->select('id', 'ten_playlist', 'trangthai', 'anh', 'user_id', 'updated_at')
            ->paginate($per_page);

        if ($playlist->count() > 0)
            return response()->json($playlist, 200);
        return response()->json(['error' => 'Không có dữ liệu'], 404);
    }

    public function destroy($id)
    {
        $playlist = Playlist::find($id);
        if (!$playlist) {
            return response()->json(['erorr' => 'Không tìm thấy playlist'], 404);
        }
        $playlist->delete();
        return response()->json(['success' => 'Xóa thành công']);
    }

    public function destroySong($playlistId, $songId)
    {
        $playlist = Playlist::find($playlistId);
        if (!$playlist) {
            return response()->json(['message' => 'Playlist không tồn tại'], 404);
        }

        $playlist->baihats()->detach($songId);
        return response()->json(['message' => 'Xóa bài hát khỏi playlist thành công']);
    }

    public function getID($id)
    {
        try {
            $playlist = Playlist::find($id);
            return response()->json($playlist);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => "ID không tồn tại",
                'message' => $exception->getMessage(),
            ], 500);
        }
    }


    public function getSongs($id)
    {
        $playlist = Playlist::with('baihats')->find($id);
        if (!$playlist) {
            return response()->json(['message' => 'Playlist không tồn tại'], 404);
        }
        return response()->json($playlist->baihats);
    }
}
