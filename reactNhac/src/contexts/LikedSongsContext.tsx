import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../../configs/axios.tsx';

interface LikedSongsContextType {
    likedSongs: number[];
    toggleLike: (songId: number) => Promise<void>;
    isLiked: (songId: number) => boolean;
    isLoading: boolean;
    clearLikedSongs: () => void;
}

const LikedSongsContext = createContext<LikedSongsContextType | undefined>(undefined);

export const LikedSongsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [likedSongs, setLikedSongs] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const clearLikedSongs = () => {
        setLikedSongs([]);
    };

    useEffect(() => {
        const loadLikedSongs = async () => {
            const userInfo = localStorage.getItem('user_info');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                try {
                    const response = await axiosInstance.get(`/user/check-like/${user.id}`);
                    if (response.data && Array.isArray(response.data)) {
                        const songIds = response.data.map((song: any) => song.id);
                        setLikedSongs(songIds);
                    }
                } catch (error) {
                    console.error('Error loading liked songs:', error);
                    setLikedSongs([]);
                }
            } else {
                setLikedSongs([]);
            }
            setIsLoading(false);
        };

        loadLikedSongs();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user_info' && !e.newValue) {
                setLikedSongs([]);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleLike = async (songId: number) => {
        const userInfo = localStorage.getItem('user_info');
        if (!userInfo) return;

        const user = JSON.parse(userInfo);
        const isCurrentlyLiked = likedSongs.includes(songId);

        try {
            if (isCurrentlyLiked) {
                await axiosInstance.delete(`/user/remove-like/${user.id}/${songId}`);
                setLikedSongs(prev => prev.filter(id => id !== songId));
            } else {
                await axiosInstance.post('/user/add-like', {
                    user_id: user.id,
                    song_id: songId
                });
                setLikedSongs(prev => [...prev, songId]);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    };

    const isLiked = (songId: number) => likedSongs.includes(songId);

    return (
        <LikedSongsContext.Provider value={{ likedSongs, toggleLike, isLiked, isLoading, clearLikedSongs }}>
            {children}
        </LikedSongsContext.Provider>
    );
};

export const useLikedSongs = () => {
    const context = useContext(LikedSongsContext);
    if (context === undefined) {
        throw new Error('useLikedSongs must be used within a LikedSongsProvider');
    }
    return context;
};
