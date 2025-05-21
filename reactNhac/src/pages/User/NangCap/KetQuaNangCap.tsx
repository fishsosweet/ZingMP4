import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../../configs/axios.tsx";

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'info'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const messageParam = searchParams.get('message');

        if (statusParam && messageParam) {
            setStatus(statusParam as 'success' | 'error' | 'info');
            setMessage(messageParam);
        } else {
            // Nếu không có tham số, thử xác minh thanh toán
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');

            if (vnp_ResponseCode && vnp_TransactionNo) {
                verifyPayment(vnp_ResponseCode, vnp_TransactionNo);
            } else {
                setStatus('error');
                setMessage('Không tìm thấy thông tin thanh toán');
            }
        }
    }, [searchParams]);

    const verifyPayment = async (vnp_ResponseCode: string, vnp_TransactionNo: string) => {
        try {
            const response = await axiosInstance.get('/user/verify-payment', {
                params: {
                    vnp_ResponseCode,
                    vnp_TransactionNo
                }
            });

            if (response.data.success) {
                setStatus('success');
                setMessage('Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.');
                // Cập nhật thông tin user trong localStorage
                localStorage.setItem('user_info', JSON.stringify(response.data.user));
            } else {
                setStatus('error');
                setMessage('Thanh toán không thành công. Vui lòng thử lại.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    useEffect(() => {
        if (status !== 'loading') {
            // Chuyển hướng sau 3 giây
            const timer = setTimeout(() => {
                navigate('/zingmp4');
                window.location.reload();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center">
            <div className="bg-[#1e1e2f] p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'loading' ? (
                    <div className="space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-lg">Đang xử lý thanh toán...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className={`text-6xl mb-4 ${status === 'success' ? 'text-green-500' :
                                status === 'info' ? 'text-blue-500' :
                                    'text-red-500'
                            }`}>
                            {status === 'success' ? '✓' :
                                status === 'info' ? 'ℹ' :
                                    '✕'}
                        </div>
                        <h2 className="text-2xl font-bold">
                            {status === 'success' ? 'Thanh toán thành công!' :
                                status === 'info' ? 'Thông tin giao dịch' :
                                    'Thanh toán không thành công'}
                        </h2>
                        <p className="text-gray-300">{message}</p>
                        <p className="text-sm text-gray-400">Tự động chuyển hướng sau 3 giây...</p>
                    </div>
                )}
            </div>
        </div>
    );
} 