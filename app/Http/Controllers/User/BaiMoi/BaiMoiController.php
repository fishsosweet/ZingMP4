<?php

namespace App\Http\Controllers\User\BaiMoi;

use App\Http\Controllers\Controller;
use App\Models\Baihat;

class BaiMoiController extends Controller
{

    public function baiMoi() {
        try {
            $top10 = BaiHat::with('casi')->orderBy('created_at', 'desc')->orderBy('luotxem', 'desc')
                ->get();
            return response()->json($top10,200);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
    }
}
