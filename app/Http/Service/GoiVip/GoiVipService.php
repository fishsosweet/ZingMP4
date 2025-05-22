<?php

namespace App\Http\Service\GoiVip;

use App\Http\Controllers\Controller;
use App\Models\GoiVip;

class GoiVipService extends Controller
{
    public function post($request)
    {
        try {
            GoiVip::create([
                'gia' => $request->gia,
                'thoi_han' => $request->thoi_han,
                'trangthai' => $request->trang_thai,
                'created_at' => $request->ngayTao,
            ]);
            return response()->json([
                'success' => 'Thêm gói VIP thành công'
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Thêm gói VIP thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function getID($id)
    {
        try {
            $goiVip = GoiVip::find($id);
            return response()->json($goiVip);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => "ID không tồn tại",
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function list()
    {
        $per_page = request()->get('per_page', 10);
        $goiVip = GoiVip::select('id', 'gia', 'thoi_han', 'trangthai', 'updated_at')->paginate($per_page);
        if ($goiVip->count() > 0)
            return response()->json($goiVip, 200);
        return response()->json(['error' => 'Không có dữ liệu'], 500);
    }

    public function update($request, $id)
    {
        try {
            $goiVip = GoiVip::find($id);
            if (!$goiVip) {
                return response()->json(['error' => 'Gói VIP không tồn tại'], 404);
            }
            $goiVip->gia = $request->gia;
            $goiVip->thoi_han = $request->thoi_han;
            $goiVip->trangthai = $request->trang_thai;
            $goiVip->updated_at = $request->ngayCapNhat;
            $goiVip->save();

            return response()->json(['success' => 'Cập nhật gói VIP thành công'], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Cập nhật gói VIP thất bại',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $goiVip = GoiVip::find($id);
        if (!$goiVip) {
            return response()->json(['error' => 'Không tìm thấy gói VIP'], 404);
        }

        $goiVip->delete();
        return response()->json(['success' => 'Xóa thành công']);
    }
}
