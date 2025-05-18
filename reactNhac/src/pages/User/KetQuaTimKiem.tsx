import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../configs/axios.tsx";
import { useMusic } from "../../contexts/MusicContext.tsx";
import { FaHeart } from "react-icons/fa";
import SongContextMenu from "../../components/User/SongContextMenu.tsx";
import ToastNotification from "../../components/User/ToastNotification.tsx";

export default function TimKiem() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [songs, setSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const { setCurrentSong, setIsPlaying, setPlaylist } = useMusic();
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (query) {
            setLoading(true);
            axiosInstance.get(`/user/search/${encodeURIComponent(query)}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setSongs(res.data);
                    } else if (Array.isArray(res.data.data)) {
                        setSongs(res.data.data);
                    } else {
                        setSongs([]);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Lỗi tìm kiếm:", err);
                    setSongs([]);
                    setLoading(false);
                });
        }
    }, [query]);

    const handlePlay = (song: any) => {
        setCurrentPlaying(currentPlaying === song.id ? null : song.id);
        setCurrentSong(song);
        setPlaylist(songs);
        setIsPlaying(true);
    };

    const handleShowContextMenu = (event: React.MouseEvent, song: any) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenuPosition({
            x: event.clientX + window.scrollX,
            y: event.clientY + window.scrollY
        });
        setSelectedSong(song);
        setShowContextMenu(true);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
        setSelectedSong(null);
    };

    const showToastNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const hideToastNotification = () => {
        setToastMessage(null);
        setShowToast(false);
    };

    if (loading) {
        return (
            <div className="text-white px-6 py-4 flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="text-white px-6 py-4">
            <h2 className="text-2xl mb-6 font-bold">
                Kết quả tìm kiếm cho <span className="text-purple-400">{query}</span>
            </h2>

            {songs.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-lg">Hông tìm thấy kết quả nào</p>
                </div>
            ) : (
                <>
                    <h3 className="text-xl mt-6 mb-4 font-semibold">Bài Hát</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {songs.map((baihat) => (
                            <div
                                key={baihat.id}
                                className="group hover:bg-[#3b2f4a] rounded-lg p-3 flex items-center justify-between transition-all duration-200"
                            >
                                <div
                                    className="flex items-center gap-4 flex-1 cursor-pointer"
                                    onClick={() => handlePlay(baihat)}
                                >
                                    <img
                                        src={`http://127.0.0.1:8000/${baihat.anh}`}
                                        className="w-14 h-14 rounded-lg object-cover"
                                        alt={baihat.title}
                                    />
                                    <div
                                        className="absolute  right-12  flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="text-white hover:text-pink-500 cursor-pointer">
                                            <FaHeart />
                                        </button>
                                        <button
                                            onClick={(e) => handleShowContextMenu(e, baihat)}
                                            className="text-white hover:text-gray-400 cursor-pointer">
                                            ⋮
                                        </button>
                                    </div>
                                    <div>
                                        <Link to={`/zingmp4/thong-tin/${baihat.id}`}>
                                            <div
                                                className="font-semibold text-lg hover:text-[#9b4de0]">{baihat.title}</div>
                                        </Link>
                                        <Link to={`/zingmp4/thong-tin-ca-si/${baihat.casi.id}`}>
                                            <div
                                                className="text-sm text-gray-400 hover:text-[#9b4de0]">{baihat.casi?.ten_casi || "Hông rõ ca sĩ"}</div>
                                        </Link>

                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                </>
            )}

            {showContextMenu && (
                <SongContextMenu
                    song={selectedSong}
                    position={contextMenuPosition}
                    onClose={handleCloseContextMenu}
                    showToast={showToastNotification}
                />
            )}

            <ToastNotification
                message={toastMessage}
                isVisible={showToast}
                onClose={hideToastNotification}
            />

        </div>
    );
}
