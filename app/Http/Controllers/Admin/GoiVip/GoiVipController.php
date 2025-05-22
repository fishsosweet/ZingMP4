<?php

namespace App\Http\Controllers\Admin\GoiVip;

use App\Http\Controllers\Controller;
use App\Http\Service\GoiVip\GoiVipService;
use Illuminate\Http\Request;

class GoiVipController extends Controller
{
    protected $goiVipService;

    public function __construct(GoiVipService $goiVipService)
    {
        $this->goiVipService = $goiVipService;
    }

    public function post(Request $request)
    {
        return $this->goiVipService->post($request);
    }

    public function getID($id)
    {
        return $this->goiVipService->getID($id);
    }

    public function list()
    {
        return $this->goiVipService->list();
    }

    public function update(Request $request, $id)
    {
        return $this->goiVipService->update($request, $id);
    }

    public function destroy($id)
    {
        return $this->goiVipService->destroy($id);
    }
}
