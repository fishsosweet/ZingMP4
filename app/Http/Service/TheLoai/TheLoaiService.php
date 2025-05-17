<?php

namespace App\Http\Service\TheLoai;

use App\Http\Controllers\Controller;
use App\Models\Casi;
use App\Models\TheLoai;

class TheLoaiService extends Controller
{
    public function post($request)
    {
        try {
            TheLoai::create([
                'ten_theloai' => $request->tenTheLoai,
                'trangthai' => $request->trangThai,
                'created_at' => $request->ngayTao,
            ]);
            return response()->json([
                'success' => 'Thêm thể loại thành công'
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Thêm thể loại thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function getID($id)
    {
        try {
            $theloai = TheLoai::find($id);
            return response()->json($theloai);
        }catch (\Exception $exception) {
            return response()->json([
                'error' =>"ID không tồn tại",
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function list()
    {
        $theLoai = TheLoai::select('id', 'ten_theloai', 'trangthai', 'updated_at')->paginate(10);;
        if ($theLoai->count() > 0)
            return response()->json($theLoai, 200);
        return response()->json(['error' => 'Không có dữ liệu'], 500);
    }

    public function update($request, $id)
    {
        try {
            $theLoai = TheLoai::find($id);
            if (!$theLoai) {

                return response()->json(['error' => 'Thể loại không tồn tại'], 404);
            }
            $theLoai->ten_theloai = $request->tenTheLoai;
            $theLoai->trangthai = $request->trangThai;
            $theLoai->updated_at = $request->ngayCapNhat;
            $theLoai->save();

            return response()->json(['success' => 'Cập nhật thể loại thành công'], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Cập nhật thể loại thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $theloai = TheLoai::find($id);
        if (!$theloai) {
            return response()->json(['erorr' => 'Không tìm thấy thể loại'], 404);
        }

        $theloai->delete();
        return response()->json(['success' => 'Xóa thành công']);
    }

}
