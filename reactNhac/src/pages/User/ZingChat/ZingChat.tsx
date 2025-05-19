import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useMusic } from "../../../contexts/MusicContext";
import { getTop10Songs } from "../../../services/User/Zingchart";
import { Link } from "react-router-dom";
import SongContextMenu from "../../../components/User/SongContextMenu.tsx";
import { useLikedSongs } from "../../../contexts/LikedSongsContext";


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
}

export default function ZingChart() {
    const { setCurrentSong, setIsPlaying, setPlaylist } = useMusic();
    const { isLiked, toggleLike, isLoading: isLikedLoading } = useLikedSongs();
    const [songs, setSongs] = useState<Song[]>([]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedSong, setSelectedSong] = useState<any>(null);


    useEffect(() => {
        const fetchTopSongs = async () => {
            const result = await getTop10Songs();
            if (result && Array.isArray(result)) {
                setSongs(result);
            } else {
                console.error("Lỗi khi load bài hát:", result.error);
            }
        };
        fetchTopSongs();
    }, []);


    const handlePlaySong = (song: Song) => {
        setCurrentSong(song);
        setPlaylist(songs);
        setIsPlaying(true);
    };

    const handleShowContextMenu = (event: React.MouseEvent, song: any) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const menuWidth = 200;
        const menuHeight = 150;

        // Tính toán vị trí để menu xuất hiện gần nút trái tim (bên trái nút ba chấm)
        // Căn cạnh phải của menu với cạnh trái của nút ba chấm, căn giữa theo chiều cao nút
        let x = rect.left - menuWidth;
        let y = rect.top + rect.height / 2 - menuHeight / 2;

        // Điều chỉnh vị trí nếu menu bị tràn ra ngoài màn hình
        if (x < 0) {
            x = rect.right + 10; // Nếu tràn trái thì đặt bên phải nút ba chấm
        }

        if (y < 0) {
            y = 10; // Nếu tràn trên thì đặt ở sát đỉnh màn hình
        }

        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight - 10; // Nếu tràn dưới thì điều chỉnh lên trên
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
        try {
            await toggleLike(song.id);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="bg-[#170f23] min-h-screen text-white p-15">
            <h1
                style={{
                    display: "inline-block",
                    background: "linear-gradient(to right, #fb923c, #ec4899, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    overflow: "visible",
                    lineHeight: "1.5",
                }}
                className="text-5xl font-bold mb-6"
            >
                #zingchart
            </h1>

            <div className="space-y-2">
                {songs.length > 0 ? songs.map((song, index) => (
                    <div>
                        <div
                            key={song.id}
                            className="flex items-center p-3 hover:bg-[#2a2a3e] rounded-lg cursor-pointer"
                        >
                            <span className="w-8 text-center font-bold">{index + 1}</span>
                            <img
                                src={`http://127.0.0.1:8000/${song.anh}`}
                                alt={song.title}
                                className="w-15 h-15 rounded mr-4"
                                onClick={() => handlePlaySong(song)}
                            />
                            <div className="flex-1">
                                <Link to={`/zingmp4/thong-tin/${song.id}`}>
                                    <div className="font-semibold hover:text-[#9b4de0]">{song.title}</div>
                                </Link>
                                <Link to={`/zingmp4/thong-tin-ca-si/${song.casi.id}`} className="inline-block max-w-fit">
                                    <span
                                        className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{song.casi.ten_casi}</span>
                                </Link>
                            </div>
                            <button
                                onClick={(e) => handleLikeClick(e, song)}
                                disabled={isLikedLoading}
                                className={`cursor-pointer mr-2 ${isLikedLoading ? 'text-gray-500' : isLiked(song.id) ? 'text-pink-500' : 'text-white hover:text-pink-500'}`}
                            >
                                <FaHeart />
                            </button>
                            <button
                                onClick={(e) => handleShowContextMenu(e, song)}
                                className="text-white hover:text-gray-400 cursor-pointer">
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
