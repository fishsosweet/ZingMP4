import { FaPlay, FaCrown } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getThongTinCaSi } from "../../services/User/TrangChuService.tsx";
import { useMusic } from "../../contexts/MusicContext";
import axiosInstance from "../../../configs/axios.tsx";

interface Song {
    id: number;
    title: string;
    anh: string;
    audio_url: string;
    lyrics: string;
    luotthich: string;
    vip: boolean;
}

interface Singer {
    id: number;
    ten_casi: string;
    gioitinh: string;
    mota: string;
    anh: string;
    baihats: Song[];
    created_at: string;
}

export default function ThongTinCaSi() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [casi, setCaSi] = useState<Singer>();
    const { setCurrentSong, setPlaylist, setIsPlaying } = useMusic();
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
        const fetchCaSi = async () => {
            try {
                const res = await getThongTinCaSi(parseInt(id!));
                setCaSi(res);
            } catch (e) {
                console.error("Lỗi khi lấy thông tin ca sĩ:", e);
            }
        };
        fetchCaSi();
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

    const handlePlayAll = async () => {
        if (casi && casi.baihats && casi.baihats.length > 0) {
            const songs = casi.baihats.map(song => ({
                id: song.id,
                title: song.title,
                anh: song.anh,
                audio_url: song.audio_url,
                lyrics: song.lyrics,
                vip: song.vip,
                casi: {
                    id: casi.id,
                    ten_casi: casi.ten_casi,
                    gioitinh: casi.gioitinh,
                    mota: casi.mota,
                    anh: casi.anh
                }
            }));
            const isRestricted = await handleVipRestriction(songs[0]);
            if (isRestricted) return;
            setPlaylist(songs);
            setCurrentSong(songs[0]);
            setIsPlaying(true);
        }
    };

    const handlePlaySong = async (song: Song) => {
        const isRestricted = await handleVipRestriction(song);
        if (isRestricted) return;

        if (casi) {
            const formattedSong = {
                id: song.id,
                title: song.title,
                anh: song.anh,
                audio_url: song.audio_url,
                lyrics: song.lyrics,
                vip: song.vip,
                casi: {
                    id: casi.id,
                    ten_casi: casi.ten_casi,
                    gioitinh: casi.gioitinh,
                    mota: casi.mota,
                    anh: casi.anh
                }
            };
            setPlaylist(casi.baihats.map(s => ({
                id: s.id,
                title: s.title,
                anh: s.anh,
                audio_url: s.audio_url,
                lyrics: s.lyrics,
                vip: s.vip,
                casi: {
                    id: casi.id,
                    ten_casi: casi.ten_casi,
                    gioitinh: casi.gioitinh,
                    mota: casi.mota,
                    anh: casi.anh
                }
            })));
            setCurrentSong(formattedSong);
            setIsPlaying(true);
        }
    };

    if (!casi) {
        return <div className="text-white text-center mt-10">Đang tải thông tin ca sĩ...</div>;
    }

    return (
        <div className="bg-gradient-to-b from-[#3d155f] to-[#120320] text-white min-h-screen font-sans">
            <div className="max-w-6xl mx-auto px-0 py-10">
                <div className="flex items-center gap-6">
                    <img
                        src={`http://127.0.0.1:8000/${casi.anh}`}
                        alt={casi.ten_casi}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="flex-1">
                        <h1 className="text-5xl font-extrabold">{casi.ten_casi}</h1>
                    </div>
                    <div className="flex-1 flex-col text-sm text-gray-300 mt-1 border-l border-gray-500 pl-6">
                        <p><span className="font-semibold text-white">Giới tính:</span> {casi.gioitinh}</p>
                        <p><span className="font-semibold text-white">Mô tả:</span> {casi.mota}</p>
                        <p><span
                            className="font-semibold text-white">Ngày tham gia:</span> {new Date(casi.created_at).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                    <button
                        onClick={handlePlayAll}
                        className="bg-white text-purple-600 p-4 rounded-full hover:bg-purple-100 transition cursor-pointer"
                    >
                        <FaPlay size={20} />
                    </button>
                </div>
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Bài Hát Nổi Bật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.isArray(casi.baihats) && casi.baihats.map((song) => (
                            <div key={song.id}>
                                <div
                                    className="flex items-center justify-between hover:bg-[#2a2a3e] p-4 rounded-lg cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative group">
                                            <img
                                                src={`http://127.0.0.1:8000/${song.anh}`}
                                                alt={song.title}
                                                className={`w-14 h-14 rounded object-cover ${song.vip === 1 ? 'ring-2 ring-yellow-400' : ''}`}
                                                onClick={() => handlePlaySong(song)}
                                            />
                                            <button
                                                className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                                        <div>
                                            <Link to={`/zingmp4/thong-tin/${song.id}`}>
                                                <span className={`font-semibold hover:text-[#9b4de0] text-[18px] truncate max-w-[150px] ${song.vip === 1 ? 'text-yellow-400' : ''}`}>
                                                    {song.title}
                                                </span>
                                            </Link>
                                            <p className="text-sm text-gray-400">{casi.ten_casi}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
