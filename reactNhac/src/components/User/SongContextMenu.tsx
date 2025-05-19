import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../configs/axios.tsx';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLikedSongs } from '../../contexts/LikedSongsContext';

interface Song {
    id: number;
    title: string;
    audio_url: string;
    anh: string;
    casi: {
        id: number;
        ten_casi: string;
    };
}

interface Playlist {
    id: number;
    ten_playlist: string;
}

interface SongContextMenuProps {
    song: Song | null;
    position: { x: number; y: number };
    onClose: () => void;
}

const SongContextMenu: React.FC<SongContextMenuProps> = ({
    song,
    position,
    onClose,
}) => {
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);
    const [showPlaylistSubMenu, setShowPlaylistSubMenu] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(false);
    const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);
    const { isLiked, toggleLike, isLoading } = useLikedSongs();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const fetchUserPlaylists = async () => {
        setLoadingPlaylists(true);
        setErrorPlaylists(null);
        try {
            const token = localStorage.getItem('user_token');
            const userInfo = localStorage.getItem('user_info');

            if (!token || !userInfo) {
                setErrorPlaylists('Vui lòng đăng nhập để xem playlist.');
                setLoadingPlaylists(false);
                return;
            }

            const user = JSON.parse(userInfo);
            const response = await axiosInstance.get(`/user/getplaylist/${user.id}`);

            if (response.data) {
                setUserPlaylists(response.data);
            } else {
                setUserPlaylists([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách playlist:', error);
            setErrorPlaylists('Không thể tải danh sách playlist.');
        } finally {
            setLoadingPlaylists(false);
        }
    };

    const handleAddToPlaylist = async (playlistId: number) => {
        if (!song) return;

        try {
            const response = await axiosInstance.post('/auth/addBaiHatList', {
                playlist_id: playlistId,
                song_id: song.id,
            });

            if (response.data.status === 'error') {
                alert('Bài hát đã nằm trong playlist');
            } else {
                alert('Thêm bài hát vào playlist thành công');
            }

        } catch (error: any) {
            alert('Bài hát đã nằm trong playlist');
        } finally {
            onClose();
        }
    };

    const handlePlaylistMenuClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!showPlaylistSubMenu) {
            fetchUserPlaylists();
        }
        setShowPlaylistSubMenu(!showPlaylistSubMenu);
    };

    const handleLikeClick = async (event: React.MouseEvent) => {
        event.stopPropagation();

        const token = localStorage.getItem('user_token');
        const userInfo = localStorage.getItem('user_info');

        if (!token || !userInfo) {
            navigate('/login-user');
            onClose();
            return;
        }

        if (!song) return;

        try {
            await toggleLike(song.id);
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Có lỗi xảy ra khi thực hiện thao tác');
        }
    };

    if (!song) {
        return null;
    }

    const style: React.CSSProperties = {
        position: 'fixed',
        top: position.y,
        left: position.x - 350,
        backgroundColor: '#2a1a40',
        border: '1px solid #3f2c5a',
        borderRadius: '8px',
        padding: '8px 0',
        zIndex: 1000,
        color: 'white',
        fontSize: '14px',
        minWidth: '200px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div ref={menuRef} style={style}>
            <div className="flex items-center gap-3 px-4 py-2 border-b border-[#3f2c5a]">
                <img
                    src={`http://127.0.0.1:8000/${song.anh}`}
                    alt={song.title}
                    className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1 overflow-hidden">
                    <div className="font-semibold text-sm truncate">{song.title}</div>
                    <div className="text-xs text-gray-400 truncate">{song.casi.ten_casi}</div>
                </div>
                <button
                    onClick={handleLikeClick}
                    className={`text-lg cursor-pointer transition-colors duration-200 ${isLoading ? 'text-gray-500' : isLiked(song.id) ? 'text-red-500' : 'text-white hover:text-red-500'
                        }`}
                    disabled={isLoading}
                >
                    <FaHeart />
                </button>
            </div>

            <div
                className="px-4 py-2 hover:bg-[#3f2c5a] cursor-pointer flex justify-between items-center"
                onClick={handlePlaylistMenuClick}
            >
                Thêm vào playlist
                <span>{'>'}</span>
            </div>

            {showPlaylistSubMenu && (
                <div className="relative left-full -top-1 w-full bg-[#2a1a40] border border-[#3f2c5a] rounded-r-lg">
                    {loadingPlaylists ? (
                        <div className="px-4 py-2 text-gray-400">Đang tải...</div>
                    ) : errorPlaylists ? (
                        <div className="px-4 py-2 text-red-400">{errorPlaylists}</div>
                    ) : userPlaylists.length > 0 ? (
                        userPlaylists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="px-4 py-2 hover:bg-[#3f2c5a] cursor-pointer"
                                onClick={() => handleAddToPlaylist(playlist.id)}
                            >
                                {playlist.ten_playlist}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400">Chưa có playlist nào</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SongContextMenu;
