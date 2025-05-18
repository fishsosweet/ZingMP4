import { useEffect, useState } from 'react';
import axiosInstance from '../../../../configs/axios.tsx';
import { useMusic } from '../../../contexts/MusicContext';



interface Playlist {
    id: number;
    anh: string;
    ten_playlist: string;
}

const ThuVien = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const { setCurrentSong, setPlaylist } = useMusic();

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('user_token');
            if (!token) {
                setPlaylists([]);
                setLoading(false);
                return;
            }

            const userInfo = localStorage.getItem('user_info');
            if (!userInfo) {
                setPlaylists([]);
                setLoading(false);
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
            setLoading(false);
        }
    };

    const handlePlaylistClick = async (playlistId: number) => {
        try {
            const response = await axiosInstance.get(`/user/playlist/${playlistId}/songs`);
            if (response.data && response.data.length > 0) {
                setPlaylist(response.data);
                setCurrentSong(response.data[0]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài hát:', error);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    return (
        <div className="bg-[#150D25] min-h-screen text-white p-15">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Thư viện</h1>
                <a href="#" className="text-sm text-gray-400 hover:text-white">TẤT CẢ {'>'} </a>
            </div>

            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <span className="uppercase">Playlist</span>
                <button className="text-white text-xl font-bold">＋</button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : playlists.length === 0 ? (
                <p className="text-gray-400 italic text-center mt-10">Trống.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-5">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            onClick={() => handlePlaylistClick(playlist.id)}
                            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
                        >
                            <img
                                src={`http://127.0.0.1:8000/${playlist.anh}`}
                                alt={playlist.ten_playlist}
                                className="w-full h-32 object-cover rounded mb-2"
                            />
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">{playlist.ten_playlist}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThuVien;
