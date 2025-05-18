import { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaCog, FaSignOutAlt } from "react-icons/fa";
import axiosInstance from "../../../configs/axios.tsx";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function HeaderUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
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

    useEffect(() => {
        if (location.pathname === "/zingmp4") {
            setQuery("");
            setSuggestions([]);
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim() === "") {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axiosInstance.get(`/user/search?query=${encodeURIComponent(query)}`);
                setSuggestions(res.data);
            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/zingmp4/tim-kiem?query=${encodeURIComponent(query)}`);
            setSuggestions([]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
        setDangNhap(false);
        setUser(null);
        navigate('/zingmp4');
    };

    return (
        <div className="relative flex items-center justify-between px-4 py-2 bg-[#1a152b] h-[65px] backdrop-blur-md">
            <div className="flex-1 mx-4 relative">
                <div className="flex items-center bg-[#2f2739] rounded-full px-4 ">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Tìm kiếm bài hát..."
                        className="w-full px-4 py-2 rounded-full text-white focus:outline-none "
                    />
                </div>

                {suggestions.length > 0 && (
                    <div
                        className="absolute z-10 w-full mt-1 bg-[#2f2739] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="px-4 py-2 hover:bg-[#3b2f4a] text-white cursor-pointer text-sm"
                                onClick={() => {
                                    navigate(`/zingmp4/tim-kiem?query=${encodeURIComponent(item.title)}`);
                                    setQuery(item.title);
                                    setSuggestions([]);
                                }}
                            >
                                {item.title} {item.casi?.ten_casi && `- ${item.casi.ten_casi}`}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Nâng cấp tài khoản
                </button>
                <button className="flex items-center bg-[#2f2739] hover:bg-[#3b2f4a] text-purple-400 text-sm font-semibold px-4 py-2 rounded-full">
                    <FaDownload className="mr-2" />
                    Tải bản Windows
                </button>
                <button className="bg-[#2f2739] p-2 rounded-full">
                    <FaCog className="text-white" />
                </button>

                {dangnhap && user ? (
                    <div className="relative">
                        <img
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover cursor-pointer"
                            src={user.image ? `http://127.0.0.1:8000/${user.image}` : `http://127.0.0.1:8000/uploads/2025/05/18/avt.jpg`}
                            onClick={() => setShowDropdown(!showDropdown)}
                        />

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-64 bg-[#2f2739] rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-700">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={user.image ? `http://127.0.0.1:8000/${user.image}` : `http://127.0.0.1:8000/uploads/2025/05/18/avt.jpg`}
                                            alt="avatar"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-white font-semibold">{user.name}</p>
                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-2">
                                    <p className="text-gray-400 text-sm">Số điện thoại: {user.phone || 'Chưa cập nhật'}</p>
                                </div>

                                <div className="px-4 py-2 border-t border-gray-700">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2 text-red-400 hover:text-red-300 py-2 cursor-pointer"
                                    >
                                        <FaSignOutAlt />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login-user">
                        <img
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                            src="http://127.0.0.1:8000/uploads/2025/05/18/avt.jpg"
                        />
                    </Link>
                )}
            </div>
        </div>
    );
}
