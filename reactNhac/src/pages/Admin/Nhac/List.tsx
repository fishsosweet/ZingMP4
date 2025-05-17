import ReactPaginate from "react-paginate";
import {useState, useEffect, SetStateAction} from 'react';
import Sidebar from '../SideBar';
import {getListBaiHat, deleteBaiHat, openPlaylist, addSongToPlaylist} from "../../../services/Admin/BaiHatService";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import YouTubeAudioPlayer from "../../../services/Admin/AudioSong.tsx";
type Playlist = {
    id: number;
    ten_playlist: string;
};
const ListBaiHat = () => {
    const [list, setList] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showPlaylist = async (songId: SetStateAction<number | null>)=>{
        const res=await openPlaylist();
        if(res && Array.isArray(res)){
            // @ts-ignore
            setPlaylists(res);
            setSelectedSongId(songId);
            setShowModal(true);
        }
    }
    const getAddSongtoList = async (playlistId: number) => {
        try {
            await addSongToPlaylist(playlistId, selectedSongId);
            setThongBao({ type: 'success', message: 'Thêm bài hát vào Playlist thành công' });
            setShowModal(false);
        } catch (error) {
            setThongBao({ type: 'error', message: 'Thêm bài hát vào Playlist thất bại' });
        }
    };


    const getData = async (page: number) => {
        const res = await getListBaiHat(page);
        if (res && Array.isArray(res.data)) {
            setList(res.data);
            setPageCount(res.last_page);
        } else {
            setList([]);
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Bạn có chắc chắn muốn xóa bài hát này?");
        if (!confirmDelete) return;
        try {
            await deleteBaiHat(id);
            alert("Đã xóa thành công");
            if (list.length === 1 && currentPage > 1) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
            } else {
                if(list.length===1)
                    window.location.reload();
                else
                    setCurrentPage(currentPage);
            }

            await getData(currentPage);
        } catch (error: any) {
            alert("Xóa thất bại! " + (error.message || "Lỗi không xác định"));
        }
    };

    useEffect(() => {
        getData(currentPage);
    }, [currentPage]);

    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected + 1);
    };
    useEffect(() => {
        if (thongBao) {
            const timer = setTimeout(() => setThongBao(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [thongBao]);

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-10 ">
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
                        <th className="border border-black"></th>
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
                                        <YouTubeAudioPlayer videoUrl={item.audio_url}/>
                                    </div>
                                </td>
                                <td className="bg-white text-black border border-black ">
                                    <img src={`http://127.0.0.1:8000/${item.anh}`}
                                         className="w-[90px] h-[70px] m-auto p-2"
                                         alt="Poster"/>
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
                                    <button className="bg-red-500 px-2 py-1 text-white rounded cursor-pointer"
                                            onClick={() => handleDelete(item.id)}
                                    >
                                        Xóa
                                    </button>

                                        <button
                                            className="bg-green-500 px-2 py-1 text-white rounded text-[14px] cursor-pointer"
                                            onClick={() => showPlaylist(item.id)}
                                        >
                                            Thêm vào Playlist
                                        </button>

                                    {showModal && (
                                        <div
                                            className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <div
                                                className="relative bg-white p-6 rounded-2xl shadow-2xl w-[1000px] border-2 border-purple-500 max-h-[90vh]"
                                                onClick={(e) => e.stopPropagation()}
                                            >

                                                <button
                                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-semibold transition duration-200 text-lg z-10"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    ✖
                                                </button>

                                                <div className="mt-10 overflow-y-auto max-h-[75vh] pr-2">
                                                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                                                        🎶 Chọn Playlist
                                                    </h2>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        {playlists.map((playlist) => (
                                                            <button
                                                                onClick={() => getAddSongtoList(playlist.id)}
                                                                key={playlist.id}
                                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold px-6 py-4 rounded-xl text-lg transition-all duration-300 text-left shadow hover:scale-[1.02]"
                                                            >
                                                                {playlist.ten_playlist}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="bg-red-100 border border-red-400 text-red-700 text-center">
                                {list.length === 0 ? "Không có dữ liệu" : list}
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
                    activeClassName="bg-blue-500 text-white border border-blue-500 w-[42px] h-10 flex items-center justify-center rounded-md" // Đảm bảo trang active có diện tích và căn giữa
                    pageClassName="page-item"
                    pageLinkClassName="page-link px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all"
                    previousClassName="prev-item px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    nextClassName="next-item px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />


            </div>
        </div>
    );
};

export default ListBaiHat;
