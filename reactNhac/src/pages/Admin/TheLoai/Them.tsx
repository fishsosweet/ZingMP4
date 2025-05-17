
import Sidebar from '../SideBar';
import {SubmitHandler, useForm} from "react-hook-form";
import {postTheLoai} from "../../../services/Admin/TheLoaiService.tsx";
import {useEffect, useState} from "react";
type Inputs = {
    tenTheLoai: string,
    trangThai: boolean,
    ngayTao: Date
};
const TheLoai = () => {
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { register, handleSubmit,reset, formState: { errors } } = useForm<Inputs>();
    const themTheLoai: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await postTheLoai(data);
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
        }
        catch (error){
            setThongBao({ type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
        }
    }

    useEffect(() => {
        if (thongBao) {
            const timer = setTimeout(() => setThongBao(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [thongBao]);
    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-10">
                {thongBao && (
                    <div
                        className={`px-4 py-3 rounded relative border
                            ${thongBao.type === 'success'
                            ? 'bg-green-100 border-green-400 text-green-700'
                            : 'bg-red-100 border-red-400 text-red-700'
                        }`}
                        role="alert"
                    >
                        <span className="block sm:inline">{thongBao.message}</span>
                    </div>
                )}
                <h1 className="mb-4 font-bold text-2xl">Thêm Thể Loại</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(themTheLoai)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột trái */}
                        <div>
                            {/* Tên thể loại */}
                            <div className="mb-5">
                                <label htmlFor="tentheloai" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên thể loại
                                </label>
                                <input
                                    type="text"
                                    id="tentheloai"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("tenTheLoai", {required: "Vui lòng nhập tên Thể Loại"})}
                                />
                                {errors.tenTheLoai && (
                                    <span className="text-red-600 text-sm">{errors.tenTheLoai.message}</span>
                                )}
                            </div>

                            {/* Kích hoạt */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kích hoạt</label>
                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="1"
                                            {...register("trangThai", {required: "Chọn trạng thái"})}
                                            className="text-blue-600"
                                        />
                                        <span>Có</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="0"
                                            {...register("trangThai", {required: "Chọn trạng thái"})}
                                            className="text-blue-600"
                                        />
                                        <span>Không</span>
                                    </label>
                                </div>
                                {errors.trangThai && (
                                    <span className="text-red-600 text-sm">{errors.trangThai.message}</span>
                                )}
                            </div>

                            {/* Ngày tạo */}
                            <div className="mb-5">
                                <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày tạo
                                </label>
                                <input
                                    type="datetime-local"
                                    id="created_at"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("ngayTao", {required: "Vui lòng chọn ngày tạo"})}
                                />
                                {errors.ngayTao && (
                                    <span className="text-red-600 text-sm">{errors.ngayTao.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Cột phải - Ảnh bìa */}

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Thêm thể loại
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TheLoai;
