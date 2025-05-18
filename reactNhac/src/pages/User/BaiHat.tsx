// MusicPlayer.tsx
import { useEffect, useRef, useState } from "react";
import {
    FaHeart, FaStepBackward, FaPlay, FaPause,
    FaStepForward, FaVolumeUp
} from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdOutlineLyrics, MdOutlinePlaylistPlay } from "react-icons/md";
import { loadYouTubeAPI } from "../../services/Admin/APIAudioSong.tsx";
import { getDSPhat, tangLuotXem } from "../../services/User/TrangChuService.tsx";
import { useMusic } from "../../contexts/MusicContext";
import { Link } from "react-router-dom";

interface Song {
    id: number;
    title: string;
    anh: string;
    casi: {
        id: number;
        ten_casi: string
    };
    audio_url: string;
    lyrics: string;
}

interface MusicPlayerProps {
    song: Song | null;
    playlist?: Song[];
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: typeof YT;
    }
}

export default function MusicPlayer({ song, playlist: playlistProp }: MusicPlayerProps) {
    const MAX_HISTORY = 100;
    const [volume, setVolume] = useState(1);
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isLyrics, setLyrics] = useState(false);
    const [duration, setDuration] = useState(0);
    const [showVolume, setShowVolume] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

    const { isPlaying, setIsPlaying, currentTime, setCurrentTime } = useMusic();

    const playerRef = useRef<YT.Player | null>(null);
    const playerContainerRef = useRef<HTMLDivElement | null>(null);
    const volumeRef = useRef<HTMLDivElement | null>(null);

    const currentSong = queue[currentIndex];

    useEffect(() => {
        if (!song) return;

        if (playlistProp && playlistProp.length > 0) {
            const filtered = playlistProp.filter((s, i, arr) =>
                arr.findIndex(x => x.id === s.id) === i
            );

            const isDifferent = filtered.some((s, i) => s.id !== queue[i]?.id);
            if (isDifferent || queue.length !== filtered.length) {
                setQueue(filtered.slice(0, MAX_HISTORY));
                const index = filtered.findIndex(s => s.id === song.id);
                setCurrentIndex(index !== -1 ? index : 0);
                setCurrentTime(0);
                return;
            }
        }

        if (song.id !== currentSong?.id) {
            insertSongToQueue(song);
            setCurrentTime(0);
        }
    }, [song, playlistProp]);

    const insertSongToQueue = (newSong: Song) => {
        setQueue(prev => {
            const withoutNewSong = prev.filter(s => s.id !== newSong.id);
            const insertPos = currentIndex + 1;
            const newQueue = [
                ...withoutNewSong.slice(0, insertPos),
                newSong,
                ...withoutNewSong.slice(insertPos)
            ].slice(-MAX_HISTORY);

            const newIndex = newQueue.findIndex(s => s.id === newSong.id);
            setCurrentIndex(newIndex);

            return newQueue;
        });
    };

    useEffect(() => {
        if (currentSong) {
            tangLuotXem(currentSong.id);
        }
    }, [currentSong?.id]);

    const extractVideoId = (url: string): string | null => {
        const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const initPlayer = async () => {
            const videoId = extractVideoId(currentSong?.audio_url || "");
            if (!videoId) return;

            try {
                await loadYouTubeAPI();
                if (!playerContainerRef.current) return;

                if (playerRef.current) {
                    playerRef.current.destroy();
                    playerRef.current = null;
                }

                playerRef.current = new window.YT.Player(playerContainerRef.current, {
                    height: '0',
                    width: '0',
                    videoId,
                    playerVars: {
                        controls: 0,
                        autoplay: isPlaying ? 1 : 0,
                        modestbranding: 1,
                        disablekb: 1,
                        origin: window.location.origin
                    },
                    events: {
                        onReady: (event) => {
                            const player = event.target;
                            playerRef.current = player;
                            setDuration(player.getDuration());
                            setIsReady(true);
                            player.setVolume(volume * 100);
                            if (isPlaying) {
                                player.playVideo();
                            }
                        },
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.ENDED) {
                                handleSongEnd();
                            } else if (event.data === window.YT.PlayerState.PLAYING) {
                                setIsPlaying(true);
                            } else if (event.data === window.YT.PlayerState.PAUSED) {
                                setIsPlaying(false);
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error initializing player:', error);
                setIsReady(false);
            }
        };

        if (currentSong) {
            setIsReady(false);
            initPlayer();
        }

        return () => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                try {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                } catch (error) {
                    console.error('Error getting current time:', error);
                }
            }
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [currentSong?.audio_url]);

    useEffect(() => {
        if (playerRef.current && isReady) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying, isReady]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current?.getCurrentTime) {
                const time = playerRef.current.getCurrentTime();
                setCurrentTime(time);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [isReady]);

    useEffect(() => {
        if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(volume * 100);
        }
    }, [volume]);

    const handleSongEnd = async () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            try {
                const excludeIds = queue.map(s => s.id);
                const res = await getDSPhat(excludeIds);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    const nextSong = res.data[0];
                    setQueue(prev => [...prev, nextSong].slice(-MAX_HISTORY));
                    setCurrentIndex(prev => prev + 1);
                }
            } catch (err) {
                console.error("Lỗi tải bài mới:", err);
            }
        }
    };

    const togglePlay = async () => {
        if (!playerRef.current || !isReady) {
            const videoId = extractVideoId(currentSong?.audio_url || "");
            if (!videoId || !playerContainerRef.current) return;

            try {
                await loadYouTubeAPI();
                playerRef.current = new window.YT.Player(playerContainerRef.current, {
                    height: '0',
                    width: '0',
                    videoId,
                    playerVars: {
                        controls: 0,
                        autoplay: 1,
                        modestbranding: 1,
                        disablekb: 1,
                        origin: window.location.origin
                    },
                    events: {
                        onReady: (event) => {
                            const player = event.target;
                            playerRef.current = player;
                            setIsReady(true);
                            player.setVolume(volume * 100);
                            player.playVideo();
                            setIsPlaying(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error initializing player:', error);
            }
            return;
        }

        try {
            if (isPlaying) {
                const currentTime = playerRef.current.getCurrentTime();
                playerRef.current.pauseVideo();
                setCurrentTime(currentTime);
            } else {
                playerRef.current.playVideo();
            }
        } catch (error) {
            console.error('Error toggling play state:', error);
        }
    };

    const handleNext = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSongEnd();
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(0);
            if (playerRef.current) {
                playerRef.current.seekTo(0, true);
                playerRef.current.playVideo();
            }
        }
    };

    const formatTime = (time: number): string => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    const showLyrics = () => setLyrics(true);

    if (!currentSong) return null;

    return (
        <div className="bg-[#120f19] p-4 flex items-center justify-between rounded-2xl shadow-lg relative">
            <div ref={playerContainerRef} style={{ display: 'none' }} />

            <div className="flex items-center gap-5 w-[300px] pl-10">
                <img
                    src={`http://127.0.0.1:8000/${currentSong.anh}`}
                    className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex flex-col">
                    <Link to={`/zingmp4/thong-tin/${currentSong.id}`}>
                        <h3 className="text-white font-semibold truncate max-w-[150px] hover:text-[#9b4de0]">{currentSong.title}</h3>
                    </Link>

                    <Link to={`/zingmp4/thong-tin-ca-si/${currentSong.casi.id}`}>
                        <p className="text-sm text-gray-400 truncate max-w-[150px] hover:text-[#9b4de0]">{currentSong.casi.ten_casi}</p>
                    </Link>

                </div>
                <button className="text-white text-xl ml-2 hover:text-pink-500 transition-colors cursor-pointer">
                    <FaHeart />
                </button>
                <button className="text-white text-xl hover:text-gray-400 transition-colors  cursor-pointer">
                    <FiMoreHorizontal />
                </button>
            </div>

            <div className="flex flex-col items-center flex-1 px-8 pr-20">
                <div className="flex items-center gap-5 mb-2">

                    <button
                        className="text-white hover:text-gray-400 transition-colors cursor-pointer"
                        onClick={handleBack}
                    >
                        <FaStepBackward />
                    </button>
                    <button
                        onClick={togglePlay}
                        disabled={!isReady}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer transition-colors
                            ${isReady
                                ? "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                                : "border-gray-500 text-gray-500"}`}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                        className="text-white hover:text-gray-400 transition-colors cursor-pointer"
                        onClick={handleNext}
                    >
                        <FaStepForward />
                    </button>

                </div>
                <div className="flex items-center w-[520px] gap-3">
                    <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
                    <div
                        className="flex-1 h-1 bg-gray-700 rounded relative cursor-pointer overflow-hidden group"
                        onClick={(e) => {
                            if (!isReady || !playerRef.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const newTime = (clickX / rect.width) * duration;
                            playerRef.current.seekTo(newTime, true);
                        }}
                    >
                        <div
                            className="h-full bg-white rounded transition-all duration-300 group-hover:bg-purple-500"
                            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                        />
                    </div>
                    <span className="text-sm text-gray-400">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center gap-5 pr-10">

                <button
                    className="text-white hover:text-gray-400 transition-colors  cursor-pointer"
                    onClick={showLyrics}
                >
                    <MdOutlineLyrics size={20} />
                </button>
                <button
                    className="text-white hover:text-gray-400 transition-colors  cursor-pointer"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                >
                    <MdOutlinePlaylistPlay size={20} />
                </button>

                <div className="relative" ref={volumeRef}>
                    <button
                        className="text-white hover:text-gray-400 transition-colors  cursor-pointer"
                        onClick={() => setShowVolume(!showVolume)}
                    >
                        <FaVolumeUp />
                    </button>
                    {showVolume && (
                        <div className="absolute bottom-full right-0 mb-2 bg-[#2a213a] p-2 rounded-lg shadow-lg">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-24 h-1 accent-purple-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {isLyrics && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e1b29] text-white rounded-lg p-6 w-[90%] max-w-lg max-h-[80vh] overflow-y-auto shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl cursor-pointer"
                            onClick={() => setLyrics(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center">Lời bài hát</h2>
                        <div className="whitespace-pre-line leading-relaxed text-sm">
                            {currentSong.lyrics || "Chưa có lời bài hát"}
                        </div>
                    </div>
                </div>
            )}

            {showPlaylist && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e1b29] text-white rounded-lg p-6 w-[90%] max-w-lg max-h-[80vh] overflow-y-auto shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl cursor-pointer"
                            onClick={() => setShowPlaylist(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Danh sách phát</h2>
                        <div className="space-y-2">
                            {queue.map((song, index) => (
                                <div
                                    key={song.id}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#2a213a] transition-colors
                                        ${index === currentIndex ? 'bg-[#2a213a]' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={`http://127.0.0.1:8000/${song.anh}`}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium truncate">{song.title}</h3>
                                        {song.casi && song.casi.id ? (
                                            <p className="text-sm text-gray-400 truncate">{song.casi.ten_casi}</p>
                                        ) : (
                                            <p className="text-sm text-gray-400 truncate">Không rõ ca sĩ</p>
                                        )}
                                    </div>
                                    {index === currentIndex && isPlaying && (
                                        <FaPlay className="text-purple-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
