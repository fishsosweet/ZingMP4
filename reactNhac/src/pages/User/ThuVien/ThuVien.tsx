import { useEffect, useState } from 'react';
import axiosInstance from '../../../../configs/axios.tsx';
import { useMusic } from '../../../contexts/MusicContext';
import { useLikedSongs } from '../../../contexts/LikedSongsContext';
import { FaPlay, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';



interface Playlist {
    id: number;
    anh: string;
    ten_playlist: string;
}

interface Song {
    id: number;
    title: string;
    anh: string;
    casi: {
        id: number;
        ten_casi: string;
    };
    audio_url: string;
    lyrics: string;
}

const ThuVien = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [likedSongsDetails, setLikedSongsDetails] = useState<Song[]>([]);
    const [loadingLikedSongsDetails, setLoadingLikedSongsDetails] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [playlistName, setPlaylistName] = useState('');

    const { setCurrentSong, setPlaylist, setIsPlaying } = useMusic();
    const { likedSongs, isLoading: isLoadingLikedSongs } = useLikedSongs();

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                setPlaylists([]);
                return;
            }

            const userInfo = localStorage.getItem('user_info');
            if (!userInfo) {
                setPlaylists([]);
                return;
            }

            const user = JSON.parse(userInfo);
            const response = await axiosInstance.get(`/user/getplaylist/${user.id}`);

            if (response.data) {
                setPlaylists(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách playlist:', error);
        } finally {
            setLoadingPlaylists(false);
        }
    };

    const fetchLikedSongsDetails = async () => {
        if (likedSongs.length === 0) {
            setLikedSongsDetails([]);
            setLoadingLikedSongsDetails(false);
            return;
        }
        setLoadingLikedSongsDetails(true);
        try {
            const response = await axiosInstance.post('/user/getLikeSongsofUser', { song_ids: likedSongs });

            if (response.data && Array.isArray(response.data)) {
                const sortedSongs = likedSongs.map(id => response.data.find((song: Song) => song.id === id)).filter((song: Song | undefined) => song !== undefined) as Song[];
                setLikedSongsDetails(sortedSongs);
            } else {
                setLikedSongsDetails([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết bài hát đã thích:', error);
            setLikedSongsDetails([]);
        } finally {
            setLoadingLikedSongsDetails(false);
        }
    };

    const handlePlaylistClick = async (playlistId: number) => {
        try {
            const response = await axiosInstance.get(`/user/playlist/${playlistId}/songs`);
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setPlaylist(response.data);
                setCurrentSong(response.data[0]);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài hát:', error);
        }
    };

    const handlePlayLikedSong = (song: Song) => {
        setCurrentSong(song);
        setPlaylist(likedSongsDetails);
        setIsPlaying(true);
    };

    const postPlaylist = async () => {
        try {
            if (!playlistName.trim()) {
                alert('Vui lòng nhập tên playlist');
                return;
            }
            const token = localStorage.getItem('user_token');
            if (!token) {
                window.location.href = '/login-user';
                return;
            }

            const userInfo = localStorage.getItem('user_info');
            if (!userInfo) {
                window.location.href = '/login-user';
                return;
            }

            const user = JSON.parse(userInfo);
            const response = await axiosInstance.post('/user/playlist/create', {
                name: playlistName,
                user_id: user.id
            });

            if (response.data) {
                setShowModal(false);
                setPlaylistName('');
                await fetchPlaylists();
            }
        } catch (error) {
            console.error('Lỗi khi tạo playlist:', error);
            alert('Có lỗi xảy ra khi tạo playlist');
        }
    };

    const handleDeletePlaylist = async (playlistId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Bạn có chắc chắn muốn xóa playlist này?')) {
            return;
        }

        try {
            const response = await axiosInstance.delete(`/user/deletePlaylist/${playlistId}`);
            if (response.data) {
                await fetchPlaylists();
            }
        } catch (error) {
            console.error('Lỗi khi xóa playlist:', error);
            alert('Có lỗi xảy ra khi xóa playlist');
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    useEffect(() => {
        if (!isLoadingLikedSongs) {
            fetchLikedSongsDetails();
        }
    }, [likedSongs, isLoadingLikedSongs]);

    const overallLoading = loadingPlaylists || loadingLikedSongsDetails || isLoadingLikedSongs;

    return (
        <div className="bg-[#150D25] min-h-screen text-white p-15">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Thư viện</h1>

            </div>

            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2 mt-8">
                <span className="uppercase">Playlist</span>
                <button
                    onClick={() => setShowModal(true)}
                    className="text-white text-xl font-bold hover:text-purple-500 transition-colors cursor-pointer"
                >
                    ＋
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2a1a40] p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Tạo playlist mới</h2>
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            placeholder="Nhập tên playlist"
                            className="w-full p-2 rounded bg-[#170f23] text-white border border-gray-600 mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setPlaylistName('');
                                }}
                                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={postPlaylist}
                                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                            >
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {overallLoading ? (
                <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : playlists.length === 0 ? (
                <p className="text-gray-400 italic text-center mt-5">Trống.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-5">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            onClick={() => handlePlaylistClick(playlist.id)}
                            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer group relative"
                        >
                            <img
                                src={`http://127.0.0.1:8000/${playlist.anh}`}
                                alt={playlist.ten_playlist}
                                className="w-full h-32 object-cover rounded mb-2"
                            />
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">{playlist.ten_playlist}</h3>
                                <button
                                    onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2 mt-8">
                <span className="uppercase">Bài hát đã thích</span>
            </div>

            {overallLoading ? (
                <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : likedSongsDetails.length === 0 ? (
                <p className="text-gray-400 italic text-center mt-5">Chưa có bài hát nào được thích.</p>
            ) : (
                <div className="w-full mt-5 divide-y divide-gray-800">
                    {likedSongsDetails.map((song) => (
                        <div
                            key={song.id}
                            className="flex items-center justify-between p-3 hover:bg-white/10 transition"
                        >
                            <div className="flex items-center gap-4 w-1/2">
                                <img
                                    src={`http://127.0.0.1:8000/${song.anh}`}
                                    alt={song.title}
                                    className="w-12 h-12 object-cover rounded cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayLikedSong(song);
                                    }}
                                />
                                <div>
                                    <Link to={`/zingmp4/thong-tin/${song.id}`}>
                                        <h3 className="text-sm font-semibold hover:text-[#9b4de0] truncate max-w-[200px]">{song.title}</h3>
                                    </Link>
                                    {song.casi && song.casi.id ? (
                                        <Link to={`/zingmp4/thong-tin-ca-si/${song.casi.id}`}>
                                            <p className="text-xs text-gray-400 hover:text-[#9b4de0] truncate max-w-[180px]">{song.casi.ten_casi}</p>
                                        </Link>
                                    ) : (
                                        <p className="text-xs text-gray-400">Hông rõ ca sĩ</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-1/6 justify-end">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayLikedSong(song);
                                    }}
                                    className="w-8 h-8 rounded-full border-2 border-purple-500 text-white flex items-center justify-center hover:bg-purple-600 cursor-pointer"
                                >
                                    <FaPlay size={14} className="ml-[1px]" />
                                </button>

                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default ThuVien;
