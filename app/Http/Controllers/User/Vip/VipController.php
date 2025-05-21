<?php

namespace App\Http\Controllers\User\Vip;

use App\Http\Controllers\Controller;
use App\Models\GoiVip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class VipController extends Controller
{
    public function __construct() {}

    public function getGoiVip()
    {
        $goiVip = GoiVip::where('trangthai', 1)->get();
        return response()->json($goiVip);
    }

    public function postVipVNPay(Request $request)
    {

        $user = User::find($request->user_id);

        if ($user && $user->exp_vip && (new \DateTime($user->exp_vip)) > new \DateTime()) {
            return response()->json(['code' => '01', 'message' => 'Bạn đã có gói VIP đang hoạt động.'], 400);
        }


        $data = $request->all();
        $vnp_TxnRef = 'VIP_' . time() . '_' . $data['user_id'];
        DB::table('user_goi_vip')->insert([
            'user_id' => $data['user_id'],
            'goi_vip_id' => $data['package_id'],
            'ngay_dang_ky' => null,
            'ngay_het_han' => null,
            'trangthai' => 'pending',
            'transaction_code' => $vnp_TxnRef,
            'tien' => $data['amount'],
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = route('vipprocess-get');
        $vnp_TmnCode = "1VYBIYQP"; //Mã website tại VNPAY
        $vnp_HashSecret = "NOH6MBGNLQL9O9OMMFMZ2AX8NIEP50W1"; //Chuỗi bí mật

        $vnp_OrderInfo = 'Thanh toán gói VIP ZingMP4';
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $data['amount'] * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip(); // Lấy IP từ request

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        return response()->json([
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        ]);
    }

    public function processVipPayment(Request $request)
    {
        $vnp_HashSecret = "NOH6MBGNLQL9O9OMMFMZ2AX8NIEP50W1";
        $vnp_ResponseCode = $request->get('vnp_ResponseCode');
        $vnp_TransactionStatus = $request->get('vnp_TransactionStatus');
        $vnp_SecureHash = $request->get('vnp_SecureHash');

        $inputData = array();


        $data = $request->all();
        foreach ($data as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        $transactionCode = $request->get('vnp_TxnRef');

        $transaction = DB::table('user_goi_vip')
            ->where('transaction_code', $transactionCode)
            ->first();

        if ($secureHash == $vnp_SecureHash) {
            if ($vnp_ResponseCode == '00' && $vnp_TransactionStatus == '00') {
                if ($transaction && $transaction->trangthai === 'pending') {
                    $user_id = $transaction->user_id;
                    $goi_vip_id = $transaction->goi_vip_id;
                    $goiVip = GoiVip::find($goi_vip_id);
                    if (!$goiVip) {
                        DB::table('user_goi_vip')
                            ->where('transaction_code', $transactionCode)
                            ->update(['trangthai' => 'error', 'updated_at' => now()]);

                        return redirect('http://localhost:5173/zingmp4/payment-result?status=error&message=Không tìm thấy gói VIP');
                    }
                    $user = User::find($user_id);
                    $ngayDangKy = now();
                    $ngayHetHan = $user && $user->exp_vip ?
                        (new \DateTime($user->exp_vip))->modify('+' . $goiVip->thoi_han . ' months') :
                        now()->addMonths($goiVip->thoi_han);
                    $ngayHetHan = $ngayHetHan->format('Y-m-d H:i:s');

                    DB::table('user_goi_vip')
                        ->where('transaction_code', $transactionCode)
                        ->update([
                            'trangthai' => 'completed',
                            'ngay_dang_ky' => $ngayDangKy,
                            'ngay_het_han' => $ngayHetHan,
                            'updated_at' => now()
                        ]);

                    if ($user) {
                        $user->vip = true;
                        $user->exp_vip = $ngayHetHan;
                        $user->save();
                    }

                    return redirect('http://localhost:5173/zingmp4/payment-result?status=success&message=Thanh toán gói VIP thành công');
                } else if ($transaction && $transaction->trangthai !== 'pending') {

                    return redirect('http://localhost:5173/zingmp4/payment-result?status=info&message=Giao dịch đã được xử lý');
                } else {

                    return redirect('http://localhost:5173/zingmp4/payment-result?status=error&message=Không tìm thấy giao dịch');
                }
            } else {

                if ($transaction && $transaction->trangthai === 'pending') {
                    DB::table('user_goi_vip')
                        ->where('transaction_code', $transactionCode)
                        ->update(['trangthai' => 'failed', 'updated_at' => now()]);
                }

                return redirect('http://localhost:5173/zingmp4/payment-result?status=error&message=Thanh toán không thành công. Mã lỗi VNPay: ' . $vnp_ResponseCode);
            }
        } else {

            if ($transaction && $transaction->trangthai === 'pending') {
                DB::table('user_goi_vip')
                    ->where('transaction_code', $transactionCode)
                    ->update(['trangthai' => 'error', 'updated_at' => now()]);
            }

            return redirect('http://localhost:5173/zingmp4/payment-result?status=error&message=Chữ ký VNPay không hợp lệ');
        }
    }
}
