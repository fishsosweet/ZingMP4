import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getDSBaiRandom } from '../services/User/TrangChuService';

interface Song {
    id: number;
    title: string;
    anh: string;
    casi: {
        ten_casi: string;
    };
    audio_url: string;
    lyrics: string;
}

interface MusicContextType {
    currentSong: Song | null;
    playlist: Song[];
    isPlaying: boolean;
    currentTime: number;
    setCurrentSong: (song: Song | null) => void;
    setPlaylist: (playlist: Song[]) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTime: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const fetchRandomSong = async () => {
            if (!currentSong && !isInitialized) {
                try {
                    const res = await getDSBaiRandom();
                    if (res && !res.error && res.length > 0) {
                        const randomSong = res[Math.floor(Math.random() * res.length)];
                        setCurrentSong(randomSong);
                        setPlaylist([randomSong]);
                        setIsPlaying(false);
                        setIsInitialized(true);
                    }
                } catch (error) {
                    console.error('Load thất bại', error);
                }
            }
        };

        fetchRandomSong();
    }, [currentSong, isInitialized]);

    useEffect(() => {
        if (currentSong) {
            setCurrentTime(0);
        }
    }, [currentSong?.id]);

    return (
        <MusicContext.Provider value={{
            currentSong,
            playlist,
            isPlaying,
            currentTime,
            setCurrentSong,
            setPlaylist,
            setIsPlaying,
            setCurrentTime
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("Lỗi");
    }
    return context;
}
