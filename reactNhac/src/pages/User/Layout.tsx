import { useLocation, Link, Outlet } from "react-router-dom";
import { FaHome, FaChartLine, FaCompactDisc } from "react-icons/fa";
import { RiPlayListAddLine } from "react-icons/ri";
import HeaderUser from "./TimKiem.tsx";
import MusicPlayer from "./BaiHat.tsx";
import { useMusic } from "../../contexts/MusicContext";

export default function UserLayout() {
    const location = useLocation();
    const { currentSong, playlist } = useMusic();

    const menusTop = [
        { name: "Thư Viện", icon: <FaHome />, path: "/thu-vien" },
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

                <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-center">
                    <p className="text-xs mb-2">Đăng nhập để khám phá playlist dành riêng cho bạn</p>
                    <button className="bg-white text-purple-600 font-semibold text-sm px-4 py-1 rounded-full">
                        ĐĂNG NHẬP
                    </button>
                </div>

                <div className="mt-auto">
                    <button className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-[#2f2739] w-full rounded-lg">
                        <RiPlayListAddLine className="text-xl" />
                        Tạo playlist mới
                    </button>
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
                </div>
            </div>
        </div>
    );
}
