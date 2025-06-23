<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class OtpController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $email = $request->email;
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put('otp_' . $email, $otp, now()->addMinutes(5));
        try {
            Mail::send('emails.otp', ['otp' => $otp], function ($message) use ($email) {
                $message->to($email)
                    ->subject('Mã xác thực đăng ký tài khoản');
            });
            return response()->json([
                'message' => 'Mã OTP đã được gửi đến email của bạn'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không thể gửi mã OTP. Vui lòng thử lại sau.'
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);
        $email = $request->email;
        $otp = $request->otp;
        $cachedOtp = Cache::get('otp_' . $email);

        if (!$cachedOtp) {
            return response()->json([
                'message' => 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.'
            ], 400);
        }

        if ($otp !== $cachedOtp) {
            return response()->json([
                'message' => 'Mã OTP không đúng. Vui lòng thử lại.'
            ], 400);
        }

        Cache::forget('otp_' . $email);

        return response()->json([
            'message' => 'Xác thực OTP thành công'
        ]);
    }
}
