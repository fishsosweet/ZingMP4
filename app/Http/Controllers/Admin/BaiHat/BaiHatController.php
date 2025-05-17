<?php

namespace App\Http\Controllers\Admin\BaiHat;

use App\Http\Controllers\Controller;
use App\Http\Service\BaiHat\BaiHatService;
use Illuminate\Http\Request;

class BaiHatController extends Controller
{
    protected $baiHatService;
    public function __construct(BaiHatService $baiHatService){
        $this->baiHatService = $baiHatService;
    }
    public function getTheLoai()
    {
        $response=$this->baiHatService->theLoai();
        return $response;
    }
    public function getCaSi()
    {
        $response=$this->baiHatService->caSi();
        return $response;
    }

    public function postBaiHat(Request $request){
        $response = $this->baiHatService->post($request);
        return $response;
    }

    public function getList(){
        $response=$this->baiHatService->list();
        return $response;
    }

    public function postCapNhatBaiHat(Request $request,$id)
    {
        $response = $this->baiHatService->update($request,$id);
        return $response;
    }

    public function getBaiHat($id)
    {
        $response = $this->baiHatService->getID($id);
        return $response;
    }

    public function delete($id){
        $response = $this->baiHatService->destroy($id);
        return $response;
    }

    public function getPlaylist()
    {
        $response = $this->baiHatService->getPlaylists();
        return $response;
    }

    public function addBaiHatList(Request $request)
    {
        $response = $this->baiHatService->addBaiHattoList($request);
        return $response;
    }
}
