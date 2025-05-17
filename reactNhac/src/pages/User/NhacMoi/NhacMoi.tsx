import { useState, useEffect } from "react";
import {FaHeart, FaPlay} from "react-icons/fa";
import { useMusic } from "../../../contexts/MusicContext";
import {Link} from "react-router-dom";
import {get10NewSongs} from "../../../services/User/NhacMoi.tsx";

interface Song {
    id: number;
    title: string;
    artist: string;
    img: string;
    duration: string;
    views: number;
    anh: string;
    casi: {
        id: String;
        ten_casi: string;
    };
    audio_url: string;
    lyrics: string;
}

export default function NhacMoi() {
    const { setCurrentSong, setIsPlaying, setPlaylist } = useMusic();
    const [songs, setSongs] = useState<Song[]>([]);

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


    const handlePlaySong = (song: Song) => {
        setCurrentSong(song);
        setPlaylist(songs);
        setIsPlaying(true);
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
                {songs.length >0 ? songs.map((song, index) => (
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
                                <Link  to={`/zingmp4/thong-tin/${song.id}`}>
                                    <div className="font-semibold hover:text-[#9b4de0]">{song.title}</div>
                                </Link>
                                <Link to={`/zingmp4/thong-tin-ca-si/${song.casi.id}`} className="inline-block max-w-fit">
                                        <span
                                            className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{song.casi.ten_casi}</span>
                                </Link>
                            </div>
                            <button className="text-white hover:text-pink-500 cursor-pointer">
                                <FaHeart/>
                            </button>
                            <button
                                className="ml-4 text-white hover:text-purple-700 cursor-pointer"
                                onClick={() => handlePlaySong(song)}
                            >
                                <FaPlay/>
                            </button>
                        </div>
                    {index !== songs.length - 1 && (
                        <div className="border-b border-gray-700 opacity-30 mx-3"></div>
                    )}
                    </div>
                    )):
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
        </div>
    );
}
