import Sidebar from '../SideBar';
import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postGoiVip } from "../../../services/Admin/GoiVipService";

type Inputs = {
    gia: number;
    thoi_han: number;
    trang_thai: number;
    ngayTao: Date;
};

const ThemGoiVip = () => {
    const navigate = useNavigate();
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Inputs>();

    useEffect(() => {
        // Set default value for ngayTao when component mounts
        setValue('ngayTao', new Date());
    }, []);

    const themGoiVip: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await postGoiVip(data);

            if (response.success) {
                setThongBao({
                    type: 'success',
                    message: response.message
                });
                reset();
                setTimeout(() => {
                    navigate('/admin/list-goi-vip');
                }, 2000);
            } else {
                setThongBao({
                    type: 'error',
                    message: response.message
                });
            }
        } catch (error: any) {
            setThongBao({
                type: 'error',
                message: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
            });
        }
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
                <h1 className="mb-4 font-bold text-2xl">Thêm Gói VIP</h1>
                <form onSubmit={handleSubmit(themGoiVip)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            {/* Giá */}
                            <div className="mb-5">
                                <label htmlFor="gia" className="block text-sm font-medium text-gray-700 mb-1">
                                    Giá (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    id="gia"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("gia", {
                                        required: "Vui lòng nhập giá gói VIP",
                                        min: { value: 0, message: "Giá không được âm" }
                                    })}
                                />
                                {errors.gia && (
                                    <span className="text-red-600 text-sm">{errors.gia.message}</span>
                                )}
                            </div>

                            <div className="mb-5">
                                <label htmlFor="thoi_han" className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời Hạn (Tháng)
                                </label>
                                <input
                                    type="number"
                                    id="thoi_han"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("thoi_han", {
                                        required: "Vui lòng nhập thời hạn",
                                        min: { value: 1, message: "Thời hạn phải lớn hơn 0" }
                                    })}
                                />
                                {errors.thoi_han && (
                                    <span className="text-red-600 text-sm">{errors.thoi_han.message}</span>
                                )}
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kích hoạt</label>
                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value={1}
                                            {...register("trang_thai", { required: "Chọn trạng thái" })}
                                            className="text-blue-600"
                                        />
                                        <span>Có</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value={0}
                                            {...register("trang_thai", { required: "Chọn trạng thái" })}
                                            className="text-blue-600"
                                        />
                                        <span>Không</span>
                                    </label>
                                </div>
                                {errors.trang_thai && (
                                    <span className="text-red-600 text-sm">{errors.trang_thai.message}</span>
                                )}
                            </div>

                            <div className="mb-5">
                                <label htmlFor="ngayTao" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày tạo
                                </label>
                                <input
                                    type="datetime-local"
                                    id="ngayTao"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("ngayTao", { required: "Vui lòng chọn ngày tạo" })}
                                />
                                {errors.ngayTao && (
                                    <span className="text-red-600 text-sm">{errors.ngayTao.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 mt-6"
                    >
                        Thêm Gói VIP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ThemGoiVip;
