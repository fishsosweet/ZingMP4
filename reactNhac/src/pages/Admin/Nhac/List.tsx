import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import Sidebar from '../SideBar';
import { getListBaiHat, deleteBaiHat, openPlaylist, addSongToPlaylist } from "../../../services/Admin/BaiHatService";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import YouTubeAudioPlayer from "../../../services/Admin/AudioSong.tsx";
import { useForm } from 'react-hook-form';

interface Playlist {
    id: number;
    ten_playlist: string;
}

interface BaiHat {
    id: number;
    title: string;
    casi: {
        ten_casi: string;
    };
    theloai: {
        ten_theloai: string;
    };
    audio_url: string;
    anh: string;
    thoiluong: number;
    vip: number;
    trangthai: number;
    updated_at: string;
}

const ListBaiHat = () => {
    const [list, setList] = useState<BaiHat[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [showModal, setShowModal] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { watch, setValue } = useForm<Inputs>();
    const trangthai = watch('trangthai');

    const showPlaylist = async (songId: number) => {
        try {
            const res = await openPlaylist();
            if (res && Array.isArray(res)) {
                setPlaylists(res);
                setSelectedSongId(songId);
                setShowModal(true);
            }
        } catch (error) {
            setThongBao({ type: 'error', message: 'Không thể lấy danh sách playlist' });
        }
    }

    const getAddSongtoList = async (playlistId: number) => {
        if (!selectedSongId) return;

        try {
            await addSongToPlaylist(playlistId, selectedSongId);
            setThongBao({ type: 'success', message: 'Thêm bài hát vào Playlist thành công' });
            setShowModal(false);
        } catch (error) {
            setThongBao({ type: 'error', message: 'Thêm bài hát vào Playlist thất bại' });
        }
    };

    const getData = async (page: number) => {
        try {
            const res = await getListBaiHat(page, perPage);
            if (res && Array.isArray(res.data)) {
                setList(res.data);
                setPageCount(res.last_page);
                setValue('trangthai', Number(res.data[0].trangthai));
            } else {
                setList([]);
            }
        } catch (error) {
            setThongBao({ type: 'error', message: 'Không thể lấy danh sách bài hát' });
            setList([]);
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài hát này?");
        if (!confirmDelete) return;

        try {
            await deleteBaiHat(id);
            setThongBao({ type: 'success', message: 'Xóa bài hát thành công' });

            if (list.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                await getData(currentPage);
            }
        } catch (error: any) {
            setThongBao({
                type: 'error',
                message: `Xóa thất bại! ${error.message || "Lỗi không xác định"}`
            });
        }
    };

    useEffect(() => {
        getData(currentPage);
    }, [currentPage, perPage]);

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected + 1);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    useEffect(() => {
        if (thongBao) {
            const timer = setTimeout(() => setThongBao(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [thongBao]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Danh Sách Bài Hát</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="perPage" className="text-sm font-medium text-gray-700">
                                Hiển thị:
                            </label>
                            <select
                                id="perPage"
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            >
                                <option value="1">1</option>
                                <option value="5">5</option>
                                <option value="8">8</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <Link
                            to="/admin/add-songs"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Thêm Bài Hát Mới
                        </Link>
                    </div>
                </div>

                {thongBao && (
                    <div
                        className={`px-4 py-3 rounded relative border mb-4
                            ${thongBao.type === 'success'
                                ? 'bg-green-100 border-green-400 text-green-700'
                                : 'bg-red-100 border-red-400 text-red-700'
                            }`}
                        role="alert"
                    >
                        <span className="block sm:inline">{thongBao.message}</span>
                    </div>
                )}

                <table className="text-black w-full text-center border border-black border-collapse">
                    <thead>
                        <tr className="bg-blue-300 border border-black">
                            <th className="w-[50px] border border-black">ID</th>
                            <th className="border border-black">Tên bài hát</th>
                            <th className="border border-black">Ca sĩ</th>
                            <th className="border border-black">Thể loại</th>
                            <th className="border border-black">Bài hát</th>
                            <th className="border border-black">Ảnh</th>
                            <th className="border border-black">Thời lượng</th>
                            <th className="border border-black">VIP</th>
                            <th className="border border-black">Trạng thái</th>
                            <th className="border border-black">Cập nhật</th>
                            <th className="border border-black">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(list) && list.length > 0 ? (
                            list.map((item) => (
                                <tr key={item.id}>
                                    <td className="w-[50px] bg-white text-black border border-black">{item.id}</td>
                                    <td className="bg-white text-black border border-black">{item.title}</td>
                                    <td className="bg-white text-black border border-black">
                                        {item.casi.ten_casi}
                                    </td>
                                    <td className="bg-white text-black border border-black">
                                        {item.theloai.ten_theloai}
                                    </td>
                                    <td className="bg-white text-black border border-black p-2">
                                        <div className="justify-center items-center flex">
                                            <YouTubeAudioPlayer videoUrl={item.audio_url} />
                                        </div>
                                    </td>
                                    <td className="bg-white text-black border border-black">
                                        <img
                                            src={`http://127.0.0.1:8000/${item.anh}`}
                                            className="w-[90px] h-[70px] m-auto p-2 object-cover"
                                            alt="Poster"
                                        />
                                    </td>
                                    <td className="bg-white text-black border border-black">
                                        {item.thoiluong} phút
                                    </td>
                                    <td className="bg-white text-black text-center border border-black p-5">
                                        {item.vip === 1 ? (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">YES</span>
                                        ) : (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NO</span>
                                        )}
                                    </td>
                                    <td className="bg-white text-black text-center border border-black">
                                        {item.trangthai === 1 ? (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">YES</span>
                                        ) : (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NO</span>
                                        )}
                                    </td>
                                    <td className="bg-white text-black border border-black p-2">
                                        {dayjs(item.updated_at).format('DD/MM/YYYY')}
                                    </td>
                                    <td className="p-2 border border-black">
                                        <Link
                                            to={`/admin/songs/edit/${item.id}`}
                                            className="bg-blue-500 px-2 py-1 text-white rounded m-1 inline-block"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            className="bg-red-500 px-2 py-1 text-white rounded m-1 cursor-pointer"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className="bg-green-500 px-2 py-1 text-white rounded m-1 cursor-pointer"
                                            onClick={() => showPlaylist(item.id)}
                                        >
                                            Thêm vào Playlist
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="bg-red-100 border border-red-400 text-red-700 text-center">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName="flex justify-center items-center space-x-2 mt-4"
                    activeClassName="bg-blue-500 text-white border border-blue-500 w-[42px] h-10 flex items-center justify-center rounded-md"
                    pageClassName="page-item"
                    pageLinkClassName="page-link px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all"
                    previousClassName="prev-item px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    nextClassName="next-item px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Chọn Playlist</h2>
                            <div className="max-h-60 overflow-y-auto">
                                {playlists.map((playlist) => (
                                    <div
                                        key={playlist.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => getAddSongtoList(playlist.id)}
                                    >
                                        {playlist.ten_playlist}
                                    </div>
                                ))}
                            </div>
                            <button
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListBaiHat;