<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class JWTUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = auth('user')->user();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

            // Kiểm tra level của user
            if ($user->level !== 1) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            Log::info('JWTUserMiddleware - User authenticated:', ['user' => $user]);

            return $next($request);
        } catch (Exception $e) {
            Log::error('JWTUserMiddleware - Error:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unauthorized: ' . $e->getMessage()], 401);
        }
    }
}
