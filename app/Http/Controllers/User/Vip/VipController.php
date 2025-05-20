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
        // Lấy thông tin user
        $user = User::find($request->user_id);

        // Kiểm tra nếu user tồn tại và đang có gói VIP còn hạn
        if ($user && $user->exp_vip && (new \DateTime($user->exp_vip)) > new \DateTime()) {
            return response()->json(['code' => '01', 'message' => 'Bạn đã có gói VIP đang hoạt động.'], 400);
        }

        // Xóa các session cũ nếu có (không còn cần thiết nếu dùng DB transaction)
        // session()->forget('user_id');
        // session()->forget('vip_id');

        $data = $request->all();
        $vnp_TxnRef = 'VIP_' . time() . '_' . $data['user_id']; // Tạo mã đơn hàng duy nhất

        // Lưu thông tin giao dịch tạm thời vào database với trạng thái pending
        DB::table('user_goi_vip')->insert([
            'user_id' => $data['user_id'],
            'goi_vip_id' => $data['package_id'],
            'ngay_dang_ky' => null, // Chưa có ngày đăng ký chính thức
            'ngay_het_han' => null, // Chưa có ngày hết hạn chính thức
            'trangthai' => 'pending', // Trạng thái chờ thanh toán
            'transaction_code' => $vnp_TxnRef, // Lưu mã giao dịch
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
            "vnp_TxnRef" => $vnp_TxnRef, // Sử dụng mã giao dịch đã lưu
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

        // Trả về URL để frontend chuyển hướng
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
        // $returnData = array(); // Không cần returnData ở đây

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

        // Lấy mã giao dịch từ callback
        $transactionCode = $request->get('vnp_TxnRef');

        // Tìm bản ghi giao dịch trong DB
        $transaction = DB::table('user_goi_vip')
            ->where('transaction_code', $transactionCode)
            ->first();

        // Kiểm tra chữ ký bảo mật và trạng thái thanh toán
        if ($secureHash == $vnp_SecureHash) {
            if ($vnp_ResponseCode == '00' && $vnp_TransactionStatus == '00') {
                // Thanh toán thành công

                // Kiểm tra xem giao dịch có tồn tại và chưa được xử lý không
                if ($transaction && $transaction->trangthai === 'pending') {
                    $user_id = $transaction->user_id;
                    $goi_vip_id = $transaction->goi_vip_id;

                    // Lấy thông tin gói VIP
                    $goiVip = GoiVip::find($goi_vip_id);
                    if (!$goiVip) {
                        // Cập nhật trạng thái giao dịch là lỗi nếu không tìm thấy gói VIP
                        DB::table('user_goi_vip')
                            ->where('transaction_code', $transactionCode)
                            ->update(['trangthai' => 'error', 'updated_at' => now()]);

                        return redirect('http://localhost:5173/zingmp4/nang-cap?status=error&message=Không tìm thấy gói VIP');
                    }

                    // Tính ngày hết hạn mới: cộng dồn vào ngày hết hạn hiện tại nếu có
                    $user = User::find($user_id);
                    $ngayDangKy = now();
                    $ngayHetHan = $user && $user->exp_vip ?
                        (new \DateTime($user->exp_vip))->modify('+' . $goiVip->thoi_han . ' months') :
                        now()->addMonths($goiVip->thoi_han);
                    $ngayHetHan = $ngayHetHan->format('Y-m-d H:i:s'); // Format lại cho phù hợp với DB

                    // Cập nhật bản ghi giao dịch sang trạng thái completed và thêm ngày tháng
                    DB::table('user_goi_vip')
                        ->where('transaction_code', $transactionCode)
                        ->update([
                            'trangthai' => 'completed',
                            'ngay_dang_ky' => $ngayDangKy,
                            'ngay_het_han' => $ngayHetHan,
                            'updated_at' => now()
                        ]);

                    // Cập nhật trạng thái VIP và ngày hết hạn cho user trong bảng users
                    if ($user) {
                        $user->vip = true;
                        $user->exp_vip = $ngayHetHan;
                        $user->save();
                    }

                    return redirect('http://localhost:5173/zingmp4/nang-cap?status=success&message=Thanh toán gói VIP thành công');
                } else if ($transaction && $transaction->trangthai !== 'pending') {
                    // Giao dịch đã được xử lý trước đó
                    return redirect('http://localhost:5173/zingmp4/nang-cap?status=info&message=Giao dịch đã được xử lý');
                } else {
                    // Không tìm thấy giao dịch
                    return redirect('http://localhost:5173/zingmp4/nang-cap?status=error&message=Không tìm thấy giao dịch');
                }
            } else {
                // Thanh toán không thành công
                // Cập nhật trạng thái giao dịch sang failed nếu tìm thấy bản ghi pending
                if ($transaction && $transaction->trangthai === 'pending') {
                    DB::table('user_goi_vip')
                        ->where('transaction_code', $transactionCode)
                        ->update(['trangthai' => 'failed', 'updated_at' => now()]);
                }

                return redirect('http://localhost:5173/zingmp4/nang-cap?status=error&message=Thanh toán không thành công. Mã lỗi VNPay: ' . $vnp_ResponseCode);
            }
        } else {
            // Chữ ký không hợp lệ
            // Cập nhật trạng thái giao dịch sang error nếu tìm thấy bản ghi pending
            if ($transaction && $transaction->trangthai === 'pending') {
                DB::table('user_goi_vip')
                    ->where('transaction_code', $transactionCode)
                    ->update(['trangthai' => 'error', 'updated_at' => now()]);
            }

            return redirect('http://localhost:5173/zingmp4/nang-cap?status=error&message=Chữ ký VNPay không hợp lệ');
        }
    }
}
