<?php

namespace App\Http\Service\TrangChu;

use App\Http\Controllers\Controller;
use App\Models\Baihat;
use App\Models\Playlist;

class TrangChuService extends Controller
{
    public function getRandomBaiHat(){
        try{
            $baiHatRandom = Baihat::inRandomOrder()->where('trangthai',1)->with(['casi:id,ten_casi', 'theloai:id,ten_theloai'])->limit(9)->get();
            return response()->json($baiHatRandom, 200);
        }
       catch (\Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
            ],500);
       }

    }

    public function getPlaylist(){
        try{
            $playlist = Playlist::where('trangthai',1)->where('user_id',1)->orderBy('created_at', 'desc')->limit(5)->get();
            return response()->json($playlist, 200);
        }
        catch (\Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
            ],500);
        }

    }
}
