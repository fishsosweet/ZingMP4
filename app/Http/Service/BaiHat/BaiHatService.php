<?php

namespace App\Http\Service\BaiHat;

use App\Http\Controllers\Controller;
use App\Models\Baihat;
use App\Models\Casi;
use App\Models\Playlist;
use App\Models\TheLoai;
use Illuminate\Support\Facades\DB;

class BaiHatService extends Controller
{
    public function theLoai()
    {
        $theLoai=TheLoai::select('id','ten_theloai')->get();
        return response()->json($theLoai);
    }
    public function caSi()
    {
        $caSi=Casi::select('id','ten_casi')->get();
        return response()->json($caSi);
    }


    public function post($request)
    {
        $request->validate([
            'anh' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);
        try {
            $pathanh='';
            if($request->hasFile('anh') && $request->file('anh')->isValid()){
                $nameimage = $request->file('anh')->getClientOriginalName();
                $path = 'uploads/' . date("Y/m/d");
                if (!file_exists(public_path($path))) {
                    mkdir(public_path($path), 0777, true);
                }
                $request->file('anh')->move(public_path($path), $nameimage);
                $pathanh = $path . '/' . $nameimage;

            }
            Baihat::create([
                'title' => $request->tenBaiHat,
                'casi_id' => $request->idCaSi,
                'theloai_id' => $request->idTheLoai,
                'audio_url'=> $request->audio_URL,
                'thoiluong' => $request->thoiLuong,
                'trangthai'=>$request->trangThai,
                'lyrics'=> $request->loiBaiHat,
                'vip'=>$request->vip,
                'anh'=> $pathanh,
                'created_at' => $request->ngayTao,
            ]);
            return response()->json([
                'success' => 'Thêm bài hát thành công'
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Thêm bài hát thất bại',
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

            $baihat = Baihat::find($id);
            if (!$baihat) {

                return response()->json(['error' => 'Bài hát không tồn tại'], 404);
            }
            $pathanh='';
            if($request->hasFile('anh') && $request->file('anh')->isValid()){
                $nameimage = $request->file('anh')->getClientOriginalName();
                $path = 'uploads/' . date("Y/m/d");
                if (!file_exists(public_path($path))) {
                    mkdir(public_path($path), 0777, true); // Tạo thư mục nếu chưa có
                }
                $request->file('anh')->move(public_path($path), $nameimage);
                $pathanh = $path . '/' . $nameimage;

            }

            $baihat->title= $request->tenBaiHat;
            $baihat->casi_id = $request->idCaSi;
            $baihat->theloai_id = $request->idTheLoai;
            $baihat->audio_url = $request->audio_URL;
            $baihat->trangthai = $request->trangThai;
            $baihat->thoiLuong = $request->thoiLuong;
            $baihat->lyrics= $request->loiBaiHat;
            $baihat->vip= $request->vip;
            $baihat->anh =$pathanh;
            $baihat->updated_at = $request->ngayCapNhat;
            $baihat->save();
            return response()->json(['success' => 'Cập nhật bài hát thành công'], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Cập nhật bài hát thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }


    public function list()
    {
        $BaiHat = Baihat::with(['casi:id,ten_casi', 'theloai:id,ten_theloai'])
            ->select('id', 'title', 'audio_url','thoiluong','trangthai', 'anh', 'casi_id', 'theloai_id', 'updated_at','vip')
            ->paginate(10);
        if ($BaiHat->count() > 0)
            return response()->json($BaiHat, 201);
        return response()->json(['error' => 'Không có dữ liệu'], 500);
    }

    public function getID($id)
    {
        try {
            $baihat = Baihat::find($id);
            return response()->json($baihat);
        }catch (\Exception $exception) {
            return response()->json([
                'error' =>"ID không tồn tại",
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $baihat = Baihat::find($id);
        if (!$baihat) {
            return response()->json(['erorr' => 'Không tìm thấy bài hát',], 404);
        }

        $baihat->delete();
        return response()->json(['success' => 'Xóa thành công']);
    }

    public function getPlaylists()
    {
        $user = auth('api')->id();
        $playlists = Playlist::where('user_id', $user)->where('trangthai',1)->select('id', 'ten_playlist')->get();
        return response()->json($playlists);
    }


    public function addBaiHattoList($request)
    {
        DB::table('playlist_song')->insert([
            'playlist_id' => $request->playlist_id,
            'song_id' => $request->song_id,
            'created_at' => now(),
        ]);
        return response()->json(['success' => 'Thêm bài hát thành công']);
    }
}
