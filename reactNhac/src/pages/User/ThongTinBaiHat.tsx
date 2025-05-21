import { Link, useParams, useNavigate } from "react-router-dom";
import { getThongTinBaiHat, getRelatedSongs } from "../../services/User/TrangChuService.tsx";
import { useEffect, useState } from "react";
import { FaHeart, FaPlay, FaCrown } from "react-icons/fa";
import { useMusic } from "../../contexts/MusicContext.tsx";
import { useLikedSongs } from "../../contexts/LikedSongsContext";
import axiosInstance from "../../../configs/axios.tsx";

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
    theloai: {
        ten_theloai: string;
    };
    audio_url: string;
    lyrics: string;
    luotthich: string;
    created_at: string;
    vip: boolean;
}

export default function ThongTinBaiHat() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [baiHat, setBaiHat] = useState<Song>();
    const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
    const { setCurrentSong, setIsPlaying, setPlaylist } = useMusic();
    const { isLiked, toggleLike, isLoading: isLikedLoading } = useLikedSongs();
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

    const thongTinBaiHat = async () => {
        try {
            const res = await getThongTinBaiHat(parseInt(id!));
            setBaiHat(res);
            const relatedRes = await getRelatedSongs(parseInt(id!));
            setRelatedSongs(relatedRes);
        } catch (e: any) {
            console.error("Lỗi khi lấy bài hát:", e);
        }
    };

    useEffect(() => {
        if (id) {
            thongTinBaiHat();
        }
    }, [id]);

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
        setPlaylist([song]);
        setIsPlaying(true);
    };

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!baiHat) return;
        const isRestricted = await handleVipRestriction(baiHat);
        if (isRestricted) return;
        try {
            await toggleLike(baiHat.id);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    if (!baiHat) return <div className="text-white text-center mt-10">Đang tải...</div>;

    return (
        <div className="bg-[#120320] text-white font-sans min-h-screen px-10 py-15">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                    <div className="relative group">
                        <img
                            src={`http://127.0.0.1:8000/${baiHat.anh}`}
                            alt={baiHat.title}
                            className={`rounded-xl w-64 h-64 object-cover ${baiHat.vip === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                        />
                        <button
                            className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => handlePlaySong(baiHat)}
                        >
                            <FaPlay size={40} />
                        </button>
                        {baiHat.vip === 1 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-2">
                                <FaCrown className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    <h2 className={`text-2xl font-bold mt-4 ${baiHat.vip === 1 ? 'text-yellow-400' : ''}`}>{baiHat.title}</h2>
                    <Link to={`/zingmp4/thong-tin-ca-si/${baiHat.casi.id}`} className="inline-block max-w-fit">
                        <span className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{baiHat.casi?.ten_casi}</span>
                    </Link>
                    <p className="text-sm text-gray-400">Trạng thái thích: {isLiked(baiHat.id) ? 'Đã thích' : 'Chưa thích'}</p>
                </div>

                <div className="flex-1">
                    <div
                        key={baiHat.id}
                        className="flex items-center p-3 hover:bg-[#2a2a3e] rounded-lg cursor-pointer"
                    >
                        <div className="relative group">
                            <img
                                src={`http://127.0.0.1:8000/${baiHat.anh}`}
                                alt={baiHat.title}
                                className={`w-15 h-15 rounded mr-4 ${baiHat.vip === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                                onClick={() => handlePlaySong(baiHat)}
                            />
                            <button
                                className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={() => handlePlaySong(baiHat)}
                            >
                                <FaPlay />
                            </button>
                            {baiHat.vip === 1 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1">
                                    <FaCrown className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className={`font-semibold ${baiHat.vip === 1 ? 'text-yellow-400' : ''}`}>{baiHat.title}</div>
                            <Link to={`/zingmp4/thong-tin-ca-si/${baiHat.casi.id}`} className="inline-block max-w-fit">
                                <span className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">
                                    {baiHat.casi.ten_casi}
                                </span>
                            </Link>
                        </div>
                        <button
                            onClick={handleLikeClick}
                            disabled={isLikedLoading}
                            className={`cursor-pointer text-xl transition-colors duration-200 ${isLikedLoading ? 'text-gray-500' : isLiked(baiHat.id) ? 'text-red-500' : 'text-white hover:text-red-500'}`}
                        >
                            <FaHeart />
                        </button>
                        <button
                            className="ml-4 text-white hover:text-purple-700 cursor-pointer"
                            onClick={() => handlePlaySong(baiHat)}
                        >
                            <FaPlay />
                        </button>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Thông Tin</h4>
                        <p><span className="text-gray-400">Thể loại:</span> {baiHat.theloai?.ten_theloai}</p>
                        <p>
                            <span className="text-gray-400">Ngày phát hành:</span>{' '}
                            {new Date(baiHat.created_at).toLocaleDateString('vi-VN')}
                        </p>
                        <p><span className="text-gray-400">Cung cấp bởi:</span> ZingMP4 - Music</p>
                    </div>
                </div>
            </div>

            {relatedSongs.length > 0 && (
                <div className="mt-12 ">
                    <h4 className="font-semibold mb-6 text-xl">
                        {relatedSongs[0].casi.id === baiHat.casi.id
                            ? "Các bài hát khác của ca sĩ"
                            : "Các bài hát cùng thể loại"}
                    </h4>
                    <div className="grid grid-cols-5 gap-6">
                        {relatedSongs.map((song) => (
                            <div
                                key={song.id}
                                className="rounded-lg p-4 hover:bg-[#3a3a4e] transition-colors cursor-pointer"
                            >
                                <div className="relative group" onClick={() => handlePlaySong(song)}>
                                    <img
                                        src={`http://127.0.0.1:8000/${song.anh}`}
                                        alt={song.title}
                                        className={`w-full aspect-square rounded-lg object-cover mb-3 ${song.vip === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                                    />
                                    <button
                                        className="absolute bottom-3 right-3 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlaySong(song);
                                        }}
                                    >
                                        <FaPlay className="text-white" />
                                    </button>
                                    {song.vip === 1 && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1">
                                            <FaCrown className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <Link to={`/zingmp4/thong-tin/${song.id}`}>
                                    <span className={`font-semibold hover:text-[#9b4de0] text-[18px] truncate block max-w-[190px] whitespace-nowrap overflow-hidden ${song.vip === 1 ? 'text-yellow-400' : ''}`}
                                        title={song.title}>
                                        {song.title}
                                    </span>
                                </Link>
                                <Link to={`/zingmp4/thong-tin-ca-si/${song.casi.id}`} className="block">
                                    <p className="text-sm text-gray-400 hover:text-[#9b4de0] truncate">
                                        {song.casi.ten_casi}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
