<?php

namespace App\Http\Controllers\User\ChuDe;

use App\Http\Controllers\Controller;
use App\Models\Playlist;

class ChuDeController extends Controller
{
    public function getPlaylistLofi(){
        try{
            $playlist = Playlist::where('trangthai', 1)
                ->where('user_id', 1)
                ->whereHas('theloai', function ($query) {
                    $query->where('ten_theloai', 'lofi');
                })
                ->limit(5)
                ->get();

            return response()->json($playlist, 200);
        }
        catch (\Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
            ],500);
        }

    }


    public function getPlaylistTrung(){
        try{
            $playlist = Playlist::where('trangthai', 1)
                ->where('user_id', 1)
                ->whereHas('theloai', function ($query) {
                    $query->where('ten_theloai', 'Nhạc Trung');
                })
                ->limit(5)
                ->get();

            return response()->json($playlist, 200);
        }
        catch (\Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
            ],500);
        }

    }

    public function getPlaylistAuMy(){
        try{
            $playlist = Playlist::where('trangthai', 1)
                ->where('user_id', 1)
                ->whereHas('theloai', function ($query) {
                    $query->where('ten_theloai', 'Âu Mỹ');
                })
                ->limit(5)
                ->get();

            return response()->json($playlist, 200);
        }
        catch (\Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
            ],500);
        }

    }

    public function getPlaylistAll(){
        try{
            $playlist = Playlist::where('trangthai', 1)
                ->where('user_id', 1)
                ->inRandomOrder()
                ->get();

            return response()->json($playlist, 200);
        }
        catch (\Exception $exception){
            return response()->json([
                'error' => $exception->getMessage(),
            ],500);
        }
    }


}
