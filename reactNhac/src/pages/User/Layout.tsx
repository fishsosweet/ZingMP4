import { useLocation, Link, Outlet } from "react-router-dom";
import { FaHome, FaChartLine, FaCompactDisc } from "react-icons/fa";
import { RiPlayListAddLine } from "react-icons/ri";
import HeaderUser from "./TimKiem.tsx";
import MusicPlayer from "./BaiHat.tsx";
import { useMusic } from "../../contexts/MusicContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../../configs/axios.tsx";
import SongContextMenu from "../../components/User/SongContextMenu.tsx";

export default function UserLayout() {
    const [dangnhap, setDangNhap] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const location = useLocation();
    const { currentSong, playlist } = useMusic();
    const [user, setUser] = useState<any>(null);

    const postPlaylist = async () => {
        try {
            if (!playlistName.trim()) {
                alert('Vui lòng nhập tên playlist');
                return;
            }
            const token = localStorage.getItem('user_token');
            if (!token || !user) {
                alert('Vui lòng đăng nhập để tạo playlist');
                return;
            }

            const response = await axiosInstance.post('/user/playlist/create', {
                name: playlistName,
                user_id: user.id
            });

            if (response.data) {
                setShowModal(false);
                setPlaylistName('');
            }
        } catch (error) {
            console.error('Lỗi khi tạo playlist:', error);
            alert('Có lỗi xảy ra khi tạo playlist');
        }
    }

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

        if (token && userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
                setDangNhap(true);
            } catch (error) {
                console.error('Lỗi khi parse user info:', error);
                localStorage.removeItem('user_info');
                setDangNhap(false);
                setUser(null);
            }
        } else {
            setDangNhap(false);
            setUser(null);
        }
    }, []);

    const menusTop = [
        { name: "Thư Viện", icon: <FaHome />, path: "/zingmp4/thu-vien" },
        { name: "Khám Phá", icon: <FaCompactDisc />, path: "/zingmp4" },
        { name: "#zingchart", icon: <FaChartLine />, path: "/zingmp4/zing-chart" },
    ];

    const menusBottom = [
        { name: "BXH Nhạc Mới", icon: <FaChartLine />, path: "/zingmp4/new-songs" },
        { name: "Chủ Đề & Thể Loại", icon: <FaCompactDisc />, path: "/zingmp4/genre" },
    ];
    const isActive = (path: string) => location.pathname === path;


    return (
        <div className="flex h-screen">
            <div className="w-64 bg-[#251b39] text-white flex flex-col fixed top-0 left-0 bottom-0 p-4">
                <Link to="/zingmp4" onClick={() => {
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchInput) {
                        searchInput.value = '';
                    }
                }}>
                    <div className="text-4xl font-bold mb-8 flex items-center gap-1 pl-3">
                        <span className="text-blue-400 stroke-white">Z</span>
                        <span className="text-pink-400 stroke-white">i</span>
                        <span className="text-yellow-400 stroke-white">n</span>
                        <span className="text-green-400 stroke-white">g</span>
                        <span className="text-white ml-1 text-xl self-end">mp4</span>
                    </div>
                </Link>
                <div className="flex flex-col gap-2">
                    {menusTop.map((menu) => (
                        <Link
                            key={menu.name}
                            to={menu.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#2f2739] ${isActive(menu.path) ? "bg-[#2f2739]" : ""
                                }`}
                        >
                            <span className="text-xl">{menu.icon}</span>
                            <span className="text-sm font-semibold">{menu.name}</span>
                        </Link>
                    ))}
                </div>

                <hr className="my-4 border-[#2f2739]" />

                <div className="flex flex-col gap-2">
                    {menusBottom.map((menu) => (
                        <Link
                            key={menu.name}
                            to={menu.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#2f2739] ${isActive(menu.path) ? "bg-[#2f2739]" : ""
                                }`}
                        >
                            <span className="text-xl">{menu.icon}</span>
                            <span className="text-sm font-semibold">{menu.name}</span>
                        </Link>
                    ))}
                </div>
                {dangnhap ? null : (
                    <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-center">
                        <p className="text-xs mb-2">Đăng nhập để khám phá playlist dành riêng cho bạn</p>
                        <Link to="/login-user">
                            <button className="bg-white text-purple-600 font-semibold text-sm px-4 py-1 rounded-full cursor-pointer">
                                ĐĂNG NHẬP
                            </button>
                        </Link>
                    </div>
                )}

                <div className="mt-auto">
                    {dangnhap ? (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-[#2f2739] w-full rounded-lg cursor-pointer">
                            <RiPlayListAddLine className="text-xl" />
                            Tạo playlist mới
                        </button>
                    ) : (
                        <Link to="/login-user">
                            <button
                                className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-[#2f2739] w-full rounded-lg cursor-pointer">
                                <RiPlayListAddLine className="text-xl" />
                                Tạo playlist mới
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col ml-64">
                <div className="flex-1 flex flex-col bg-[#2a1a40]">
                    <div className="fixed left-64 right-0 top-0 z-40 bg-[#2a1a40]">
                        <HeaderUser />
                    </div>

                    <div className="flex-1 mt-[65px] overflow-y-auto bg-[#170f23] pb-24">
                        <Outlet />
                    </div>

                    {currentSong && (
                        <div className="fixed left-64 right-0 bottom-0 z-50">
                            <MusicPlayer song={currentSong} playlist={playlist} />
                        </div>
                    )}

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-[#2a1a40] p-6 rounded-lg w-96">
                                <h2 className="text-xl font-bold text-white mb-4">Tạo playlist mới</h2>
                                <input
                                    type="text"
                                    value={playlistName}
                                    onChange={(e) => setPlaylistName(e.target.value)}
                                    placeholder="Nhập tên playlist"
                                    className="w-full p-2 rounded bg-[#170f23] text-white border border-gray-600 mb-4"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setPlaylistName('');
                                        }}
                                        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={postPlaylist}
                                        className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
