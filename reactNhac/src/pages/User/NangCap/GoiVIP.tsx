import { useEffect, useState } from "react";
import axiosInstance from "../../../../configs/axios.tsx";
import { Link, useSearchParams } from "react-router-dom";

interface VIPPackage {
    id: number;
    gia: number;
    thoi_han: number;
    trangthai: boolean;
    created_at: string;
    updated_at: string;
}

export default function GoiVip() {
    const [dangnhap, setDangNhap] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [vipPackages, setVipPackages] = useState<VIPPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<VIPPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        const userInfo = localStorage.getItem('user_info');

        if (token) {
            if (!userInfo) {
                getUser();
            } else {
                try {
                    const parsedUser = JSON.parse(userInfo);
                    setUser(parsedUser);
                    setDangNhap(true);
                } catch (error) {
                    console.error('Lỗi khi parse user info:', error);
                    getUser();
                }
            }
        } else {
            setDangNhap(false);
            setUser(null);
        }

        fetchVIPPackages();
    }, []);

    const getUser = async () => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                setDangNhap(false);
                setUser(null);
                return;
            }
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await axiosInstance.get('/user/getThongTinUser');

            if (res.data) {
                setUser(res.data);
                setDangNhap(true);
                localStorage.setItem('user_info', JSON.stringify(res.data));
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error);
            setUser(null);
            setDangNhap(false);
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_info');
        }
    }

    const fetchVIPPackages = async () => {
        try {
            const response = await axiosInstance.get('/user/vip');
            if (response.data) {
                setVipPackages(response.data);

                if (response.data.length > 0) {
                    setSelectedPackage(response.data[0]);
                }
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách gói VIP:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    const calculateNextPaymentDate = (duration: number) => {
        const currentDate = new Date();
        const nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + duration);
        return formatDate(nextDate);
    }

    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null) return '0đ';
        return price.toLocaleString('vi-VN') + 'đ';
    }

    const calculateMonthlyPrice = (price: number | undefined | null, duration: number) => {
        if (price === undefined || price === null || duration === 0) return '0đ';
        return formatPrice(Math.round(price / duration));
    }

    const handlePackageSelect = (pkg: VIPPackage) => {
        setSelectedPackage(pkg);
    }

    const handlePayment = async () => {
        if (!selectedPackage || !user) return;

        try {
            setPaymentLoading(true);
            const response = await axiosInstance.post('/user/postVipVNPay', {
                package_id: selectedPackage.id,
                amount: selectedPackage.gia,
                user_id: user.id,
                redirect: true,
                return_url: `${window.location.origin}/zingmp4/payment-result`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data && response.data.data) {
                window.location.href = response.data.data;
            } else {
                alert('Lỗi: Không nhận được URL thanh toán từ server.');
            }
        } catch (error: any) {
            console.error('Lỗi khi tạo thanh toán:', error);

            if (error.response && error.response.data && error.response.data.code === '01') {
                alert(error.response.data.message);
            } else {
                alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại sau.');
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                }
            }
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#160c29] via-[#302b63] to-[#1b1b2f] text-white px-4 py-8">
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-[#0f0c29] bg-opacity-90 backdrop-blur-md shadow-md px-6 py-2 flex items-center justify-between">

                <Link to="/zingmp4">
                    <div className="text-4xl font-bold flex items-center gap-1 pl-3">
                        <span className="text-blue-400 stroke-white">Z</span>
                        <span className="text-pink-400 stroke-white">i</span>
                        <span className="text-yellow-400 stroke-white">n</span>
                        <span className="text-green-400 stroke-white">g</span>
                        <span className="text-white ml-1 text-xl self-end">mp4</span>
                    </div>
                </Link>

                {dangnhap && user ? (
                    <div className="relative">
                        <img
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover cursor-pointer"
                            src={user.image ? `http://127.0.0.1:8000/${user.image}` : `http://127.0.0.1:8000/uploads/2025/05/18/avt.jpg`}
                        />
                    </div>
                ) : (
                    <div>
                        <Link to="/login-user">
                            <img
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                                src="http://127.0.0.1:8000/uploads/2025/05/18/avt.jpg"
                            />
                        </Link>
                    </div>
                )}
            </header>

            <div className="pt-24 max-w-6xl mx-auto">
                <div className="mb-3">
                    <span className="text-[#b682f3] font-semibold text-3xl mr-3">Zing MP4</span>
                    <span className="bg-[#7a4ff2] text-white font-bold px-2 py-1 rounded text-xl">
                        PLUS
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    <div className="bg-[#1e1e2f] p-6 rounded-2xl space-y-4 h-auto">
                        <h1 className="text-3xl font-bold mb-4">Chọn gói nâng cấp</h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : (
                            vipPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    onClick={() => handlePackageSelect(pkg)}
                                    className={`p-4 rounded-xl transition cursor-pointer ${selectedPackage?.id === pkg.id
                                        ? 'border-2 border-purple-500 bg-purple-900/30'
                                        : 'bg-[#121225] hover:border hover:border-gray-600'
                                        }`}
                                >
                                    <p className="text-sm text-gray-300">{pkg.thoi_han} tháng</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold">{formatPrice(pkg.gia)}</p>
                                        {pkg.thoi_han > 1 && (
                                            <span className="text-sm bg-purple-600 px-2 py-1 rounded">
                                                Tiết kiệm {(() => {
                                                    const oneMonthPkg = vipPackages.find(p => p.thoi_han === 1);
                                                    if (!oneMonthPkg) return 0;
                                                    const percent = 1 - (pkg.gia / (oneMonthPkg.gia * pkg.thoi_han));
                                                    return Math.round(percent * 100);
                                                })()}%
                                            </span>
                                        )}
                                    </div>
                                    {pkg.thoi_han > 1 && (
                                        <p className="text-sm text-gray-300">
                                            Chỉ {calculateMonthlyPrice(pkg.gia, pkg.thoi_han)}/tháng
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#1e1e2f] p-6 rounded-2xl space-y-3">
                            <div className="flex justify-between text-sm text-gray-300">
                                <p>Thời điểm nâng cấp</p>
                                <p>{formatDate(new Date())}</p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <p>Hiệu lực đến</p>
                                <p>Khi bạn huỷ</p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <p>Kỳ thanh toán tiếp theo</p>
                                <p>{selectedPackage ? calculateNextPaymentDate(selectedPackage.thoi_han) : '-'}</p>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-white mt-2">
                                <p>Tổng thanh toán:</p>
                                <p className="text-purple-400">
                                    {selectedPackage ? formatPrice(selectedPackage.gia) : '-'}
                                </p>
                            </div>
                            <button
                                className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedPackage || paymentLoading}
                                onClick={handlePayment}
                            >
                                {paymentLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'ĐĂNG KÝ'
                                )}
                            </button>
                        </div>

                        <div className="bg-[#1e1e2f] p-6 rounded-2xl">
                            <h3 className="font-semibold mb-2">Đặc quyền gói PLUS</h3>
                            <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                                <li>Nghe nhạc không quảng cáo</li>
                                <li>Nghe và tải nhạc Lossless</li>
                                <li>Lưu trữ nhạc không giới hạn</li>
                                <li>Tính năng nghe nhạc nâng cao</li>
                                <li>Mở rộng khả năng Upload</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
