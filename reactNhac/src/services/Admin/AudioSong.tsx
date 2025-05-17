import React, { useEffect, useRef, useState } from 'react';
import {loadYouTubeAPI} from './APIAudioSong.tsx';

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: typeof YT;
    }
}

interface YouTubeAudioPlayerProps {
    videoUrl: string;
}

const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({ videoUrl }) => {
    const playerContainerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<YT.Player | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const extractVideoId = (url: string): string | null => {
        const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return match ? match[1] : null;
    };

    const videoId = extractVideoId(videoUrl);

    // Theo dõi thời gian bài hát
    useEffect(() => {
        const interval = setInterval(() => {
            if (
                playerRef.current &&
                typeof playerRef.current.getCurrentTime === 'function'
            ) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 500);
        return () => clearInterval(interval);
    }, [isReady]);

    useEffect(() => {

        const initPlayer = async () => {
            await loadYouTubeAPI();

            if (!playerContainerRef.current || !videoId) return;

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
                    autoplay: 0,
                    modestbranding: 1,
                    disablekb: 1,
                },
                events: {
                    onReady: (event) => {
                        const player = event.target;
                        setTimeout(() => {
                            setDuration(player.getDuration());
                            setIsReady(true);
                        }, 500);
                    },
                },
            });
        };

        setIsReady(false);
        initPlayer();

        return () => {
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId]);

    const togglePlay = () => {
        const player = playerRef.current;
        if (!player || !isReady) {
            return;
        }

        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (playerRef.current?.seekTo) {
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number): string => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    return (
        <div style={{ marginBottom: '20px', fontFamily: 'sans-serif' }}>
            <div ref={playerContainerRef} style={{ display: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ width: '50px' }}>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    step="0.1"
                    onChange={handleSeek}
                    style={{
                        flex: 1,
                        accentColor: '#3b82f6',
                        height: '6px',
                        cursor: 'pointer',
                    }}
                    disabled={!isReady}
                />
                <span style={{ width: '50px' }}>{formatTime(duration)}</span>
            </div>

            <button
                onClick={togglePlay}
                disabled={!isReady}
                style={{
                    backgroundColor: isReady ? '#3b82f6' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: isReady ? 'pointer' : 'not-allowed',
                }}
            >
                {isReady ? (isPlaying ? '⏸ Tạm dừng' : '▶️ Phát') : '⏳ Đang tải...'}
            </button>
        </div>
    );
};

export default YouTubeAudioPlayer;
