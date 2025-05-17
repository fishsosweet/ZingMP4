import { FaPlay } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
    getPlaylistAll,
    getPlaylistAuMy,
    getPlaylistLofi,
    getPlaylistTrung,
    getSongsInPlaylist
} from "../../../services/User/ChuDe.tsx";
import { useMusic } from "../../../contexts/MusicContext";
import MusicPlayer from "../BaiHat";

export default function ChuDe() {
    const [playlistLofi, setLocalPlaylistLofi] = useState<any[]>([]);
    const [playlistTrung, setLocalPlaylistTrung] = useState<any[]>([]);
    const [playlistAuMy, setLocalPlaylistAuMy] = useState<any[]>([]);
    const [playlistAll, setLocalPlaylistAll] = useState<any[]>([]);
    const { setCurrentSong, setPlaylist: setGlobalPlaylist, setIsPlaying } = useMusic();

    useEffect(() => {
        getPlaylistlofi();
        getPlaylisttrung();
        getPlaylistaumy();
        getPlaylistall();
    }, []);

    const getPlaylistall = async () => {
        try {
            const res = await getPlaylistAll();
            if (res && !res.error) {
                setLocalPlaylistAll(res);
            }
        } catch (e: any) {
            console.error("Đã có lỗi xảy ra", e);
        }
    }
    const getPlaylistaumy = async () => {
        try {
            const res = await getPlaylistAuMy();
            if (res && !res.error) {
                setLocalPlaylistAuMy(res);
            }
        } catch (e: any) {
            console.error("Đã có lỗi xảy ra", e);
        }
    }


    const getPlaylistlofi = async () => {
        try {
            const res = await getPlaylistLofi();
            if (res && !res.error) {
                setLocalPlaylistLofi(res);
            }
        } catch (e: any) {
            console.error("Đã có lỗi xảy ra", e);
        }
    }

    const getPlaylisttrung = async () => {
        try {
            const res = await getPlaylistTrung();
            if (res && !res.error) {
                setLocalPlaylistTrung(res);
            }
        } catch (e: any) {
            console.error("Đã có lỗi xảy ra", e);
        }
    }

    const handlePlayPlaylist = async (playlistId: number) => {
        try {
            const response = await getSongsInPlaylist(playlistId);
            if (response && response.data) {
                setGlobalPlaylist(response.data);
                setCurrentSong(response.data[0]);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bài hát:", error);
        }
    }

    return (
        <div className="px-15 py-10 bg-[#170f23] text-white">
            <div className="w-full">
                <img src="http://127.0.0.1:8000/uploads/2025/05/11/67e72bd4081888aef9ae16ac7a4a5940.jpg"
                     alt="ảnh bài hát" className="
                w-full h-120 rounded"/>
            </div>
            <section>
                <div className="py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl font-bold">Lofi</h2>

                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {playlistLofi.length > 0 ? playlistLofi.map((playlist, index) => (
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
                                                <FaPlay className="text-white text-2xl ml-1 "/>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 mt-2 font-semibold text-sm">{playlist.ten_playlist}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">{playlist.description}</p>
                                </div>
                            )) :
                            <div className="flex gap-6  pb-4 h-[235px]">
                                {Array.from({length: 5}).map((_, index) => (
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
            <section>
                <div className="py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl font-bold">Âu Mỹ</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {playlistAuMy.length > 0 ? playlistAuMy.map((playlist, index) => (
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
                                                <FaPlay className="text-white text-2xl ml-1 "/>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 mt-2 font-semibold text-sm">{playlist.ten_playlist}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">{playlist.description}</p>
                                </div>
                            )) :
                            <div className="flex gap-6  pb-4 h-[235px]">
                                {Array.from({length: 5}).map((_, index) => (
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

            <section>
                <div className="py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl font-bold">Trung</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {playlistTrung.length > 0 ? playlistTrung.map((playlist, index) => (
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
                                                <FaPlay className="text-white text-2xl ml-1 "/>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 mt-2 font-semibold text-sm">{playlist.ten_playlist}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">{playlist.description}</p>
                                </div>
                            )) :
                            <div className="flex gap-6  pb-4 h-[235px]">
                                {Array.from({length: 5}).map((_, index) => (
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
            <section>
                <div className="py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl font-bold">Tất cả</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {playlistAll.length > 0 ? playlistAll.map((playlist, index) => (
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
                                                <FaPlay className="text-white text-2xl ml-1 "/>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 mt-2 font-semibold text-sm">{playlist.ten_playlist}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">{playlist.description}</p>
                                </div>
                            )) :
                            <div className="flex gap-6  pb-4 h-[235px]">
                                {Array.from({length: 5}).map((_, index) => (
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
            <MusicPlayer song={null}/>
        </div>
    );
}
