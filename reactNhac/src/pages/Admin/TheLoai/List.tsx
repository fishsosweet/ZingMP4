import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import Sidebar from '../SideBar';
import { deleteTheLoai, getListTheLoai } from "../../../services/Admin/TheLoaiService.tsx";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';

const ListTheLoai = () => {
    const [list, setList] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const getData = async (page: number) => {
        const res = await getListTheLoai(page, perPage);
        if (res && Array.isArray(res.data)) {
            setList(res.data);
            setPageCount(res.last_page);
        } else {
            setList([]);
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Bạn có chắc chắn muốn xóa thể loại này?");
        if (!confirmDelete) return;
        try {
            await deleteTheLoai(id);
            alert("Đã xóa thành công");
            if (list.length === 1 && currentPage > 1) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
            } else {
                if (list.length === 1)
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
    }, [currentPage, perPage]);

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected + 1);
    };

    const filteredList = list.filter(item =>
        item.ten_theloai.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Danh Sách Thể Loại</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên thể loại..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px]"
                            />
                        </div>
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
                            to="/admin/add-categories"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Thêm Thể Loại Mới
                        </Link>
                    </div>
                </div>

                <table className="text-black w-full text-center border border-black border-collapse">
                    <thead>
                        <tr className="bg-blue-300 border border-black">
                            <th className="w-[50px] border border-black">ID</th>
                            <th className="border border-black">Tên thể loại</th>
                            <th className="border border-black">Trạng thái</th>
                            <th className="border border-black">Cập nhật</th>
                            <th className="border border-black"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredList) && filteredList.length > 0 ? (
                            filteredList.map((item) => (
                                <tr key={item.id}>
                                    <td className="w-[50px] bg-white text-black border border-black">{item.id}</td>
                                    <td className="bg-white text-black border border-black">{item.ten_theloai}</td>
                                    <td className="bg-white text-black text-center border border-black">
                                        {item.trangthai === 1 ? (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">YES</span>
                                        ) : (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NO</span>
                                        )}
                                    </td>
                                    <td className="bg-white text-black border border-black">
                                        {dayjs(item.updated_at).format('DD/MM/YYYY')}
                                    </td>
                                    <td className="p-2 border border-black">
                                        <Link
                                            to={`/admin/categories/edit/${item.id}`}
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="bg-red-100 border border-red-400 text-red-700 text-center">
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
            </div>
        </div>
    );
};

export default ListTheLoai;
