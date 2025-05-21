import { useState, useEffect } from "react";
import { FaHeart, FaPlay, FaCrown } from "react-icons/fa";
import { useMusic } from "../../../contexts/MusicContext";
import { Link, useNavigate } from "react-router-dom";
import { get10NewSongs } from "../../../services/User/NhacMoi.tsx";
import SongContextMenu from "../../../components/User/SongContextMenu.tsx";
import { useLikedSongs } from "../../../contexts/LikedSongsContext";
import axiosInstance from "../../../../configs/axios.tsx";

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

export default function NhacMoi() {
    const navigate = useNavigate();
    const { setCurrentSong, setIsPlaying, setPlaylist } = useMusic();
    const { isLiked, toggleLike, isLoading: isLikedLoading } = useLikedSongs();
    const [songs, setSongs] = useState<Song[]>([]);
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
        const fetchTopSongs = async () => {
            const result = await get10NewSongs();
            if (result && Array.isArray(result)) {
                setSongs(result);
            } else {
                console.error("Lỗi khi load bài hát:", result.error);
            }
        };
        fetchTopSongs();
    }, []);

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

    const handlePlaySong = async (song: Song) => {
        const isRestricted = await handleVipRestriction(song);
        if (isRestricted) return;
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

    return (
        <div className="bg-[#170f23] min-h-screen text-white p-15">
            <h1 className="text-5xl font-bold mb-6 flex items-center gap-4">
                BXH Nhạc Mới
                <button className="w-12 h-12 rounded-full bg-white border-2 border-black text-black hover:bg-gray-100 flex items-center justify-center">
                    <FaPlay className="text-xl" />
                </button>
            </h1>

            <div className="space-y-2">
                {songs.length > 0 ? songs.map((song, index) => (
                    <div key={song.id}>
                        <div
                            className="flex items-center p-3 hover:bg-[#2a2a3e] rounded-lg cursor-pointer"
                        >
                            <span className="w-8 text-center font-bold">{index + 1}</span>
                            <div className="relative group cursor-pointer m-2 w-[60px] h-[60px]">
                                <img
                                    src={`http://127.0.0.1:8000/${song.anh}`}
                                    alt={song.title}
                                    className={`w-full h-full object-cover rounded-md ${song.vip === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                                    onClick={() => handlePlaySong(song)}
                                />
                                <button
                                    className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                    onClick={() => handlePlaySong(song)}
                                >
                                    <FaPlay />
                                </button>
                                {song.vip === 1 && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1">
                                        <FaCrown className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <Link to={`/zingmp4/thong-tin/${song.id}`}>
                                    <div className={`font-semibold hover:text-[#9b4de0] ${song.vip === 1 ? 'text-yellow-400' : ''}`}>{song.title}</div>
                                </Link>
                                <Link to={`/zingmp4/thong-tin-ca-si/${song.casi.id}`} className="inline-block max-w-fit">
                                    <span className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{song.casi.ten_casi}</span>
                                </Link>
                            </div>
                            <button
                                onClick={(e) => handleLikeClick(e, song)}
                                disabled={isLikedLoading}
                                className={`cursor-pointer mr-2 ${isLikedLoading ? 'text-gray-500' : isLiked(song.id) ? 'text-pink-500' : 'text-white hover:text-pink-500'}`}
                            >
                                <FaHeart />
                            </button>
                            <button className="text-white hover:text-gray-400 cursor-pointer"
                                onClick={(e) => handleShowContextMenu(e, song)}
                            >
                                ⋮
                            </button>
                        </div>
                        {index !== songs.length - 1 && (
                            <div className="border-b border-gray-700 opacity-30 mx-3"></div>
                        )}
                    </div>
                )) :
                    Array.from({ length: 10 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 hover:bg-[#2a2a3e] rounded-lg cursor-pointer animate-pulse"
                        >
                            <div className="w-15 h-15 bg-gray-300 rounded mr-4"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="text-white bg-gray-300 w-8 h-8 rounded-full"></div>
                            <div className="ml-4 text-white bg-gray-300 w-8 h-8 rounded-full"></div>
                        </div>
                    ))
                }
            </div>

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
