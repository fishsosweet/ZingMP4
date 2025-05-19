<?php

namespace App\Http\Controllers\User\Login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class apiLoginUser extends Controller
{
    public function __construct() {}
    public function getapiLoginUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (! $token = auth('user')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], Response::HTTP_UNAUTHORIZED);
        }
        $user = auth('user')->user();
        if ($user->level !== 1)
            return response()->json(['error' => 'Bạn không có quyền đăng nhập vào trang Zing MP4'], Response::HTTP_FORBIDDEN);
        return $this->respondWithToken($token);
    }
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'role' => 'user'
        ]);
    }
    public function getUserProfile(Request $request)
    {
        try {
            $user = auth('user')->user();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

            if ($user->level !== 1) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            Log::info('User profile request:', ['user' => $user]);

            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'level' => $user->level,
                'phone' => $user->phone,
                'image' => $user->image ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getUserProfile: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }
}
