<?php

namespace App\Http\Controllers\Admin\Playlist;

use App\Http\Controllers\Controller;
use App\Http\Service\Playlist\PlaylistService;
use App\Http\Service\TheLoai\TheLoaiService;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
    protected $playlistService;
    public function __construct(PlaylistService $playlistService)
    {
        $this->playlistService = $playlistService;
    }
    public function getPlaylist($id)
    {
        $response = $this->playlistService->getID($id);
        return $response;
    }
    public function postPlaylist(Request $request)
    {
        $response = $this->playlistService->post($request);
        return $response;
    }

    public function postCapNhatPlaylist(Request $request,$id)
    {
        $response = $this->playlistService->update($request,$id);
        return $response;
    }

    public function getList(){
        $response=$this->playlistService->list();
        return $response;
    }

    public function delete($id){
        $response=$this->playlistService->destroy($id);
        return $response;
    }

    public function getSong($id)
    {
        $response=$this->playlistService->getSongs($id);
        return $response;
    }
    public function deleteBaiHatOfPlaylist($playlistId, $songId)
    {
        $response=$this->playlistService->destroySong($playlistId,$songId);
        return $response;
    }
}
