<?php

namespace App\Http\Controllers\Admin\CaSi;

use App\Http\Controllers\Controller;
use App\Http\Service\CaSi\CaSiService;
use Illuminate\Http\Request;

class CaSiController extends Controller
{
    protected $caSiService;
    public function __construct(CaSiService $caSiService){
        $this->caSiService = $caSiService;
    }
    public function postCaSi(Request $request){
        $response = $this->caSiService->post($request);
        return $response;
    }

    public function postCapNhatCaSi(Request $request,$id)
    {
        $response = $this->caSiService->update($request,$id);
        return $response;
    }

    public function getList(){
        $response=$this->caSiService->list();
        return $response;
    }
    public function delete($id){
        $response=$this->caSiService->destroy($id);
        return $response;
    }

    public function getCaSi($id)
    {
        $response = $this->caSiService->getID($id);
        return $response;
    }
}
