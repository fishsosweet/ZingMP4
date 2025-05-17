<?php

namespace App\Http\Controllers\Admin\TheLoai;

use App\Http\Controllers\Controller;
use App\Http\Service\TheLoai\TheLoaiService;
use Illuminate\Http\Request;

class TheLoaiController extends Controller
{
    protected $theLoaiService;
    public function __construct(TheLoaiService $theLoaiService)
    {
        $this->theLoaiService = $theLoaiService;
    }
    public function getTheloai($id)
    {
        $response = $this->theLoaiService->getID($id);
        return $response;
    }

    public function postTheLoai(Request $request)
    {
        $response = $this->theLoaiService->post($request);
        return $response;
    }

    public function postCapNhatTheLoai(Request $request,$id)
    {
        $response = $this->theLoaiService->update($request,$id);
        return $response;
    }

    public function getList(){
        $response=$this->theLoaiService->list();
        return $response;
    }

    public function delete($id){
        $response=$this->theLoaiService->destroy($id);
        return $response;
    }
}
