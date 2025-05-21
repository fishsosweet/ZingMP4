import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../configs/axios.tsx";
import { useMusic } from "../../contexts/MusicContext.tsx";
import { FaHeart, FaPlay, FaCrown } from "react-icons/fa";
import SongContextMenu from "../../components/User/SongContextMenu.tsx";
import { useLikedSongs } from "../../contexts/LikedSongsContext";

interface Song {
    id: number;
    title: string;
    artist: string;
    img: string;
    duration: string;
    views: number;
    anh: string;
    casi: {
        id: number;
        ten_casi: string;
    };
    audio_url: string;
    lyrics: string;
    vip: boolean;
}

export default function TimKiem() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const { setCurrentSong, setIsPlaying, setPlaylist } = useMusic();
    const { isLiked, toggleLike, isLoading: isLikedLoading } = useLikedSongs();
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [isUserVip, setIsUserVip] = useState(false);

    const refreshUserData = async () => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                setIsUserVip(false);
                return;
            }
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await axiosInstance.get('/user/getThongTinUser');
            if (res.data) {
                localStorage.setItem('user_info', JSON.stringify(res.data));
                setIsUserVip(Boolean(res.data.vip));
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    useEffect(() => {
        refreshUserData();
        const interval = setInterval(refreshUserData, 30000);
        return () => clearInterval(interval);
    }, []);

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

    const handleVipRestriction = async (song: any) => {
        if (song.vip === 1) {
            await refreshUserData();
            if (!isUserVip) {
                navigate('/zingmp4/nang-cap');
                return true;
            }
        }
        return false;
    };

    const handlePlay = async (song: any) => {
        const isRestricted = await handleVipRestriction(song);
        if (isRestricted) return;
        setCurrentPlaying(currentPlaying === song.id ? null : song.id);
        setCurrentSong(song);
        setPlaylist(songs);
        setIsPlaying(true);
    };

    const handleShowContextMenu = async (event: React.MouseEvent, song: any) => {
        event.preventDefault();
        event.stopPropagation();
        const isRestricted = await handleVipRestriction(song);
        if (isRestricted) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const menuWidth = 200;
        const menuHeight = 150;
        let x = rect.left - menuWidth;
        let y = rect.top + rect.height / 2 - menuHeight / 2;

        if (x < 0) {
            x = rect.right + 10;
        }

        if (y < 0) {
            y = 10;
        }

        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight - 10;
        }

        setContextMenuPosition({ x, y });
        setSelectedSong(song);
        setShowContextMenu(true);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
        setSelectedSong(null);
    };

    const handleLikeClick = async (e: React.MouseEvent, song: any) => {
        e.preventDefault();
        e.stopPropagation();
        const isRestricted = await handleVipRestriction(song);
        if (isRestricted) return;

        const userToken = localStorage.getItem('user_token');
        if (!userToken) {
            window.location.href = '/login-user';
            return;
        }

        try {
            await toggleLike(song.id);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
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
                                    <div className="relative group cursor-pointer">
                                        <img
                                            src={`http://127.0.0.1:8000/${baihat.anh}`}
                                            className={`w-14 h-14 rounded-lg object-cover ${baihat.vip === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                                            alt={baihat.title}
                                        />
                                        <button
                                            className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlay(baihat);
                                            }}
                                        >
                                            <FaPlay />
                                        </button>
                                        {baihat.vip === 1 && (
                                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1">
                                                <FaCrown className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="absolute right-12 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => handleLikeClick(e, baihat)}
                                            disabled={isLikedLoading}
                                            className={`cursor-pointer ${isLikedLoading ? 'text-gray-500' : isLiked(baihat.id) ? 'text-pink-500' : 'text-white hover:text-pink-500'}`}
                                        >
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
                                            <div className={`font-semibold text-lg hover:text-[#9b4de0] ${baihat.vip === 1 ? 'text-yellow-400' : ''}`}>{baihat.title}</div>
                                        </Link>
                                        <Link to={`/zingmp4/thong-tin-ca-si/${baihat.casi.id}`}>
                                            <div className="text-sm text-gray-400 hover:text-[#9b4de0]">{baihat.casi?.ten_casi || "Hông rõ ca sĩ"}</div>
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
                />
            )}
        </div>
    );
}
