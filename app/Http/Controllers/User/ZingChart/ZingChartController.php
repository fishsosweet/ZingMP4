<?php

namespace App\Http\Controllers\User\ZingChart;

use App\Http\Controllers\Controller;
use App\Http\Service\TrangChu\TrangChuService;
use App\Models\Baihat;
use App\Models\Playlist;
use Illuminate\Http\Request;


class ZingChartController extends Controller
{
    public function zingChart() {
        try {
            $top10 = BaiHat::with('casi')->orderBy('luotxem', 'desc')
                ->limit(10)
                ->get();
            return response()->json($top10,200);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
    }
}
