// const recentlyPlayed = [
//     { title: "Ballad Việt Ngày Nay", img: "/path/to/image1.jpg" },
//     { title: "#zingchart", img: "/path/to/image2.jpg" },
//     { title: "Old But Gold", img: "/path/to/image3.jpg" },
//     { title: "Top 100 Nhạc Electronic/Dance", img: "/path/to/image4.jpg" },
//     { title: "Top 100 Pop Âu Mỹ Hay Nhất", img: "/path/to/image5.jpg" },
//     { title: "Hit-Maker: Hứa Kim Tuyền", img: "/path/to/image6.jpg" },
// ];
import { getDSBaiRandom, getDSMoiPhatHanh, getDSPlaylist, getTopSongs, getSongsInPlaylist } from "../../../services/User/TrangChuService.tsx";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaHeart, FaPlay
} from "react-icons/fa";
import dayjs from 'dayjs';
import { XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { useMusic } from "../../../contexts/MusicContext";
import SongContextMenu from "../../../components/User/SongContextMenu.tsx";
import ToastNotification from "../../../components/User/ToastNotification.tsx";

const colors = ['#f87171', '#60a5fa', '#34d399'];

export default function HomeUser() {
    const { setCurrentSong, setPlaylist, setIsPlaying } = useMusic();
    const [baiHatRandom, setBaiHatRandom] = useState<any[]>([]);
    const [playlist, setLocalPlaylist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newReleases, setNewReleases] = useState<any[]>([]);
    const [topSongs, setTopSongs] = useState<any[]>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchTopSongs = async () => {
            try {
                const res = await getTopSongs();
                if (res && !res.error) {
                    const totalViews = res.reduce((sum: number, song: any) => sum + song.luotxem, 0);
                    const songsWithPercent = res.map((song: any) => ({
                        ...song,
                        percent: totalViews > 0 ? ((song.luotxem / totalViews) * 100).toFixed(1) : 0,
                    }));
                    setTopSongs(songsWithPercent);
                    const chartData = songsWithPercent.map((song: any) => ({
                        time: song.title,
                        views: song.luotxem,
                    }));
                    setBarData(chartData);
                }
            } catch (e) {
                console.error("Lỗi khi lấy top 3 bài hát có lượt xem cao nhất", e);
            }
        };
        fetchTopSongs();
    }, []);

    useEffect(() => {
        const fetchNewReleases = async () => {
            try {
                const res = await getDSMoiPhatHanh();
                if (res) {
                    setNewReleases(res.data);
                }
            } catch (e) {
                console.error("Lỗi khi lấy nhạc mới", e);
            }
        };
        fetchNewReleases();
    }, []);

    const getBaiHatRandom = async () => {
        setIsLoading(true);
        try {
            const res = await getDSBaiRandom();
            if (res && !res.error) {
                setBaiHatRandom(res);
            }
        } catch (e: any) {
            console.error("Đã có lỗi xảy ra", e);
        }
        setIsLoading(false);
    }

    const getPlaylist = async () => {
        setIsLoading(true);
        try {
            const res = await getDSPlaylist();
            if (res && !res.error) {
                setLocalPlaylist(res);
            }
        } catch (e: any) {
            console.error("Đã có lỗi xảy ra", e);
        }
    }

    useMemo(() => {
        return topSongs.map((song: any) => ({
            time: song.title,
            views: song.luotxem,
        }));
    }, [topSongs]);

    useEffect(() => {
        if (baiHatRandom.length === 0) {
            getBaiHatRandom();
        }
        if (playlist.length === 0) {
            getPlaylist();
        }
    }, [baiHatRandom, playlist]);

    const handlePlaySong = (song: any) => {
        setCurrentSong(song);
        setPlaylist([song]);
        setIsPlaying(true);
    };

    const handlePlayPlaylist = async (playlistId: number) => {
        try {
            const response = await getSongsInPlaylist(playlistId);
            if (response && Array.isArray(response.data) && response.data.length > 0) {
                setCurrentSong(response.data[0]);
                setPlaylist(response.data);
                setIsPlaying(true);
            }
        } catch (e) {
            console.error("Không thể tải danh sách từ playlist:", e);
        }
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

    return (
        <div className="p-15 bg-[#170f23] text-white">
            {/*<section className="mb-10">*/}
            {/*    <div className="flex justify-between items-center mb-4">*/}
            {/*        <h2 className="text-2xl font-bold">Nghe Gần Đây</h2>*/}
            {/*        <button className="text-sm text-purple-400 hover:underline">Tất Cả {'>'}</button>*/}
            {/*    </div>*/}
            {/*    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">*/}
            {/*        {recentlyPlayed.map((item, index) => (*/}
            {/*            <div key={index} className="flex flex-col items-center">*/}
            {/*                <img*/}
            {/*                    src={item.img}*/}
            {/*                    alt={item.title}*/}
            {/*                    className="rounded-lg w-full h-28 object-cover mb-2"*/}
            {/*                />*/}
            {/*                <span className="text-sm text-center">{item.title}</span>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</section>*/}

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Gợi Ý Cho Bạn</h2>
                    <button
                        onClick={getBaiHatRandom}
                        disabled={isLoading}
                        className={`text-sm px-4 py-1 rounded-full flex items-center gap-2 cursor-pointer
        ${isLoading ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'} text-white transition`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Đang làm mới...
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2">
                                    <path
                                        d="M4 4v5h.582M20 20v-5h-.581M4.582 9A7.5 7.5 0 0112 4.5c2.033 0 3.878.79 5.218 2.082M19.418 15A7.5 7.5 0 0112 19.5c-2.033 0-3.878-.79-5.218-2.082" />
                                </svg>
                                Làm Mới
                            </>
                        )}
                    </button>

                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {baiHatRandom.length > 0 ? (
                        baiHatRandom.map((item) => (
                            <div key={item.id}
                                className="group relative flex items-center gap-5 hover:bg-[#2a213a] rounded-md transition duration-300">

                                <div className="relative group cursor-pointer m-2 w-[60px] h-[60px]">
                                    <img
                                        src={`http://127.0.0.1:8000/${item.anh}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-md "
                                        onClick={() => handlePlaySong(item)}
                                    />
                                    <button
                                        className="absolute inset-0 flex items-center justify-center  text-white bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                        onClick={() => handlePlaySong(item)}
                                    >
                                        <FaPlay />
                                    </button>
                                </div>

                                <div className="flex flex-col overflow-hidden">
                                    <Link to={`/zingmp4/thong-tin/${item.id}`}>
                                        <span className="font-semibold hover:text-[#9b4de0] text-[18px] truncate max-w-[150px]">
                                            {item.title}
                                        </span>
                                    </Link>
                                    <Link to={`/zingmp4/thong-tin-ca-si/${item.casi.id}`}>
                                        <span className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">
                                            {item.casi.ten_casi}
                                        </span>
                                    </Link>
                                </div>

                                <div
                                    className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="text-white hover:text-pink-500 cursor-pointer">
                                        <FaHeart />
                                    </button>
                                    <button
                                        onClick={(e) => handleShowContextMenu(e, item)}
                                        className="text-white hover:text-gray-400 cursor-pointer">
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="grid grid-cols-3 gap-4 w-[1150px]">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="group relative flex items-center gap-4 text-gray-700 rounded-md transition duration-300 animate-pulse h-[82px] px-4"
                                >

                                    <div className="w-[80px] h-[80px] bg-gray-300 rounded-md flex-shrink-0"></div>

                                    <div className="flex flex-col justify-center flex-1">
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section>
                <div className=" py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl font-bold">Playlist nhạc ngày mới</h2>
                        <Link to="/zingmp4/genre" className="text-sm text-gray-400 hover:text-white">
                            TẤT CẢ &gt;
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {playlist.length > 0 ? playlist.map((playlist, index) => (
                            <div key={index} className="cursor-pointer group relative">
                                <div className="w-full h-[210px] bg-gray-500 rounded-lg overflow-hidden relative">
                                    <img
                                        src={`http://127.0.0.1:8000/${playlist.anh}`}
                                        alt={playlist.ten_playlist}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-75"
                                    />
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => handlePlayPlaylist(playlist.id)}
                                            className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors duration-300 cursor-pointer"
                                        >
                                            <FaPlay className="text-white text-2xl ml-1 " />
                                        </button>


                                    </div>
                                </div>
                                <h3 className="text-gray-500 mt-2 font-semibold text-sm">{playlist.ten_playlist}</h3>
                                <p className="text-gray-400 text-xs line-clamp-2">{playlist.description}</p>
                            </div>
                        )) :
                            <div className="flex gap-6  pb-4 h-[235px]">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index}
                                        className="flex-shrink-0 w-[200px] cursor-pointer group animate-pulse">
                                        <div className="w-full h-[180px] bg-gray-300 rounded-lg"></div>
                                        <div className="mt-2 h-4 bg-gray-300 rounded w-[160px]"></div>
                                        <div className="mt-1 h-3 bg-gray-200 rounded w-[180px]"></div>
                                    </div>
                                ))}
                            </div>


                        }

                    </div>
                </div>
            </section>
            <section className="pt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Mới Phát Hành</h2>
                    <Link to="/zingmp4/new-songs" className="text-sm text-gray-400 hover:text-white">
                        TẤT CẢ &gt;
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {newReleases.length > 0 ? newReleases.slice(0, 9).map((item) => (
                        <div key={item.id}
                            className="group relative flex items-center gap-5 hover:bg-[#2a213a] rounded-md transition duration-300">
                            <div className="relative group cursor-pointer m-2 w-[60px] h-[60px]">
                                <img
                                    src={`http://127.0.0.1:8000/${item.anh}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded-md "
                                    onClick={() => handlePlaySong(item)}
                                />
                                <button
                                    className="absolute inset-0 flex items-center justify-center  text-white bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                    onClick={() => handlePlaySong(item)}
                                >
                                    <FaPlay />
                                </button>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <div className="flex flex-col overflow-hidden">
                                    <Link to={`/zingmp4/thong-tin/${item.id}`} className="inline-block max-w-fit">
                                        <span
                                            className="font-semibold hover:text-[#9b4de0] text-[18px] truncate max-w-[150px]">{item.title}</span>
                                    </Link>
                                    <Link to={`/zingmp4/thong-tin-ca-si/${item.casi.id}`} className="inline-block max-w-fit">
                                        <span
                                            className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{item.casi.ten_casi}</span>
                                    </Link>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {
                                        dayjs().diff(dayjs(item.created_at), 'day') === 0 ? 'Hôm nay' : `${dayjs().diff(dayjs(item.created_at), 'day')} ngày trước`
                                    }
                                </span>

                            </div>
                            <div
                                className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="text-white hover:text-pink-500 cursor-pointer">
                                    <FaHeart />
                                </button>
                                <button
                                    onClick={(e) => handleShowContextMenu(e, item)}
                                    className="text-white hover:text-gray-400 cursor-pointer">
                                    ⋮
                                </button>
                            </div>
                        </div>
                    )) :
                        <div className="grid grid-cols-3 gap-4 w-[1150px]">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="group relative flex items-center gap-4 text-gray-700 rounded-md transition duration-300 animate-pulse h-[82px] px-4"
                                >

                                    <div className="w-[80px] h-[80px] bg-gray-300 rounded-md flex-shrink-0"></div>

                                    <div className="flex flex-col justify-center flex-1">
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>}

                </div>
            </section>
            <section>
                <div
                    className="flex bg-gradient-to-br from-purple-950 to-purple-800 text-white p-6 rounded-lg shadow-lg mt-15 bg-[#170f23]">
                    <div className="w-1/3 space-y-4">
                        <h2 className="text-2xl font-bold mb-4">#zingchart</h2>
                        {topSongs.length > 0 ? topSongs.map((song, index) => (
                            <div key={index}
                                className="flex items-center bg-purple-800 p-3 rounded-lg space-x-3 w-[450px] hover:bg-purple-900 cursor-pointer"
                                onClick={() => handlePlaySong(song)}>
                                <div className="text-2xl font-bold text-white">{index + 1}</div>
                                <img src={`http://127.0.0.1:8000/${song.anh}`} alt={song.title}
                                    className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-1">
                                    <Link to={`/zingmp4/thong-tin/${song.id}`}>
                                        <div className="font-semibold">{song.title}</div>
                                    </Link>
                                    <Link to={`/zingmp4/thong-tin-ca-si/${song.casi.id}`} className="inline-block max-w-fit">
                                        <div
                                            className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{song.casi.ten_casi}</div>
                                    </Link>

                                </div>
                                <div className="text-xl font-bold">{song.percent}%</div>

                            </div>
                        )) :
                            <div className="grid grid-cols-1 gap-4 w-[550px]">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="group relative flex items-center gap-4 text-gray-700 rounded-md transition duration-300 animate-pulse h-[70px] px-4"
                                    >
                                        <div className="w-[80px] h-[20px] bg-gray-300 rounded-md flex-shrink-0"></div>

                                        <div className="flex flex-col justify-center flex-1 h-[20px]">
                                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        }

                        <Link to="/zingmp4/zing-chart">
                            <button className="bg-white text-purple-800 font-bold px-4 py-2 rounded-full mt-4 cursor-pointer">
                                Xem thêm
                            </button>
                        </Link>
                    </div>
                    <div className="w-2/3 pl-5 pt-10 ml-10">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} margin={{ top: 10, right: 80, left: 80, bottom: 5 }}>
                                <XAxis dataKey="time" stroke="#888" fontSize={14} />
                                <XAxis dataKey="time" stroke="none" />
                                <Tooltip
                                    isAnimationActive={false}
                                    cursor={false}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        color: '#000',
                                    }}
                                    itemStyle={{
                                        color: '#000'
                                    }}
                                />
                                <Bar dataKey="views" radius={[20, 20, 0, 0]} stroke="none" >
                                    {barData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

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
