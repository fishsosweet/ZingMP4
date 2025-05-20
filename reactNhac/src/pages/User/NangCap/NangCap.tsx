import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../../../../configs/axios.tsx";


export default function NangCap() {

    const [dangnhap, setDangNhap] = useState(false);
    const [user, setUser] = useState<any>(null);

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
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0c29] bg-opacity-90 backdrop-blur-md shadow-md px-6 py-2 flex items-center justify-between">

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

            <div className="pt-20 px-6 py-10 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Âm nhạc không giới hạn</h1>
                    <p className="text-lg md:text-xl text-gray-300">
                        Nâng cấp tài khoản để trải nghiệm các tính năng và nội dung cao cấp
                    </p>
                </div>

                <div className="bg-[#2e1a47] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Zing MP3 <span className="bg-white text-purple-700 px-2 py-1 rounded ml-1 text-sm">PLUS</span>
                    </h2>
                    <p className="text-gray-300 text-sm mb-2">Nghe nhạc với chất lượng cao nhất, không quảng cáo</p>
                    <p className="text-3xl font-bold text-white mb-6">Chỉ từ 13.000đ/tháng</p>
                    <Link to="/zingmp4/nang-cap/goi-vip">
                    <button className="bg-[#c273ed] hover:bg-[#a758dc] text-white font-semibold px-6 py-2 rounded-full transition mb-6 cursor-pointer">
                        ĐĂNG KÝ GÓI
                    </button>
                    </Link>
                    <hr className="border-t border-gray-600 mb-4" />

                    <div className="text-left text-sm">
                        <h3 className="font-bold text-white mb-2">Đặc quyền đặc biệt:</h3>
                        <ul className="space-y-2">
                            {[
                                "Nghe nhạc không quảng cáo",
                                "Nghe và tải nhạc Lossless",
                                "Lưu trữ nhạc không giới hạn",
                                "Tính năng nghe nhạc nâng cao",
                                "Mở rộng khả năng Upload",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-purple-400 mr-2 mt-[2px]">✔</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
