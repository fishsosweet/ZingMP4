<?php

namespace App\Http\Controllers\Admin\Login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class apiLoginAdmin extends Controller
{
    public function __construct() {}

    public function getapiLoginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], Response::HTTP_UNAUTHORIZED);
        }

        $admin = auth('api')->user();
        if ($admin->level !== 0) {
            return response()->json(['error' => 'Bạn không có quyền đăng nhập vào trang Admin'], Response::HTTP_FORBIDDEN);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'role' => 'admin'
        ]);
    }

    public function getAdminProfile(Request $request)
    {
        try {
            $admin = auth('api')->user();
            if (!$admin) {
                return response()->json(['error' => 'Admin not found'], 401);
            }

            if ($admin->level !== 0) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            Log::info('Admin profile request:', ['admin' => $admin]);

            return response()->json([
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'level' => $admin->level,
                'image' => $admin->image ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getAdminProfile: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    public function getThongTin()
    {
        try {
            $totalBaiHat = DB::table('baihat')->count();
            $totalTaiKhoan = DB::table('users')->count();
            $totalTaiKhoanVip = DB::table('users')
                ->where('vip', 1)
                ->count();
            $totalDoanhThu = DB::table('user_goi_vip')
                ->sum('tien');
            return response()->json([
                'success' => true,
                'data' => [
                    'BaiHat' => $totalBaiHat,
                    'TaiKhoan' => $totalTaiKhoan,
                    'TaiKhoanVip' => $totalTaiKhoanVip,
                    'DoanhThu' => $totalDoanhThu
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin: ' . $e->getMessage()
            ], 500);
        }
    }
}
