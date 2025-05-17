<?php

namespace App\Http\Controllers\User\TrangChu;

use App\Http\Controllers\Controller;
use App\Http\Service\TrangChu\TrangChuService;
use App\Models\Baihat;
use App\Models\Casi;
use App\Models\Playlist;
use Illuminate\Http\Request;

class TrangChuController extends Controller
{
    protected $trangChuService;
    public function __construct(TrangChuService $trangChuService)
    {
        $this->trangChuService = $trangChuService;
    }

    public function getRandomSongs()
    {
        $response = $this->trangChuService->getRandomBaiHat();
        return $response;
    }
    public function getPlaylist()
    {
        $response = $this->trangChuService->getPlaylist();
        return $response;
    }
    public function getNextSongs(Request $request)
    {
        $exclude = $request->input('exclude', []);
        $songs = Baihat::whereNotIn('id', $exclude)
            ->inRandomOrder()
            ->limit(1)
            ->with('casi')
            ->get();

        return response()->json($songs);
    }
    public function getSonginPlaylist($id)
    {
        $playlist = Playlist::with('baihats.casi')->find($id);
        if ($playlist) {
            return response()->json($playlist->baihats);
        } else {
            return response()->json(['message' => 'Không tìm thấy Playlist'], 404);
        }
    }

    public function getNewSongs()
    {
        try {
            $songs = BaiHat::with('casi')
                ->orderBy('created_at', 'desc')
                ->limit(12)
                ->get();
            return response()->json($songs, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi khi lấy bài hát mới',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    public function tangLuotXem($id)
    {
        $song = BaiHat::find($id);
        $song->increment('luotxem');
    }

    public function getTopBaiHat()
    {
        $topSongs = BaiHat::with('casi')
            ->orderByDesc('luotxem')
            ->take(3)
            ->get();

        return response()->json($topSongs);
    }
    public function getSong()
    {
        $Song = BaiHat::where('trangthai', 1)
            ->limit(1)->get();
        return response()->json($Song);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $songs = Baihat::where('trangthai', 1)
            ->where(function ($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                    ->orWhereHas('casi', function ($q) use ($query) {
                        $q->where('ten_casi', 'LIKE', "%{$query}%");
                    });
            })
            ->with('casi')
            ->get();

        return response()->json($songs);
    }

    public function search1($query)
    {
        $results = BaiHat::with('casi')
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhereHas('casi', function ($q) use ($query) {
                $q->where('ten_casi', 'LIKE', "%{$query}%");
            })
            ->limit(10)
            ->get();

        return response()->json($results); // <- trả về mảng luôn
    }


    public function thongTinBaiHat($id)
    {
        $baihat = Baihat::with(['casi', 'theloai'])->find($id);
        if (!$baihat) {
            return response()->json(['message' => 'Bài hát hông tồn tại'], 404);
        }
        return response()->json($baihat);
    }

    public function thongTinCaSi($id)
    {
        $casi = Casi::with('baihats')->find($id);
        if (!$casi) {
            return response()->json(['message' => 'Ca sĩ hông tồn tại'], 404);
        }
        return response()->json($casi);
    }


    public function getRelatedSongs($id)
    {
        $currentSong = Baihat::with(['casi', 'theloai'])->find($id);
        if (!$currentSong) {
            return response()->json(['message' => 'Bài hát không tồn tại'], 404);
        }

        $songsByArtist = Baihat::where('casi_id', $currentSong->casi_id)
            ->where('id', '!=', $id)
            ->with(['casi', 'theloai'])
            ->limit(5)
            ->get();

        if ($songsByArtist->isEmpty()) {
            $songsByGenre = Baihat::where('theloai_id', $currentSong->theloai_id)
                ->where('id', '!=', $id)
                ->with(['casi', 'theloai'])
                ->limit(5)
                ->get();
            return response()->json($songsByGenre);
        }

        return response()->json($songsByArtist);
    }
}
