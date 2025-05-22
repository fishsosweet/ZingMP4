import Sidebar from '../SideBar';
import { SubmitHandler, useForm } from "react-hook-form";
import { getThongTinGoiVip, postSuaGoiVip } from "../../../services/Admin/GoiVipService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Inputs = {
    gia: number;
    thoi_han: number;
    trangthai: number;
    ngayCapNhat: Date;
};

const SuaGoiVip = () => {
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Inputs>();
    const { id } = useParams();
    const trangthai = watch('trangthai');

    const suaGoiVip: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await postSuaGoiVip(data, parseInt(id!));
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
            if (res.success) {
                await getGoiVip();
            }
        } catch (error: any) {
            console.error("Lỗi cập nhật:", error);
            setThongBao({
                type: 'error',
                message: typeof error === 'string'
                    ? error
                    : (error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.')
            });
        }
    };

    const getGoiVip = async () => {
        try {
            const res = await getThongTinGoiVip(parseInt(id!));
            if (res) {
                setValue('gia', res.gia);
                setValue('thoi_han', res.thoi_han);
                setValue('trangthai', Number(res.trangthai));
                setValue('ngayCapNhat', new Date());
            }
        } catch (error) {
            setThongBao({ type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
        }
    };

    useEffect(() => {
        getGoiVip();
    }, []);

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
                <h1 className="mb-4 font-bold text-2xl">Cập nhật gói VIP</h1>
                <form onSubmit={handleSubmit(suaGoiVip)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="gia" className="form-label block">Giá (VNĐ)</label>
                                <input
                                    type="number"
                                    id="gia"
                                    className="w-2/5 px-4 py-2 border rounded-md block mb-5"
                                    {...register("gia", {
                                        required: "Vui lòng nhập giá",
                                        min: { value: 0, message: "Giá không được âm" }
                                    })}
                                />
                                {errors.gia && <span className="text-red-700 text-base">{errors.gia.message}</span>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="thoi_han" className="form-label block">Thời hạn (Tháng)</label>
                                <input
                                    type="number"
                                    id="thoi_han"
                                    className="w-2/5 px-4 py-2 border rounded-md block mb-5"
                                    {...register("thoi_han", {
                                        required: "Vui lòng nhập thời hạn",
                                        min: { value: 1, message: "Thời hạn phải lớn hơn 0" }
                                    })}
                                />
                                {errors.thoi_han && <span className="text-red-700 text-base">{errors.thoi_han.message}</span>}
                            </div>

                            <div className="block mb-5">
                                <label className="form-label">Trạng Thái</label>
                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value={1}
                                            checked={trangthai === 1}
                                            {...register("trangthai", { required: "Chọn trạng thái" })}
                                            className="text-blue-600"
                                        />
                                        <span>Hoạt động</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value={0}
                                            checked={trangthai === 0}
                                            {...register("trangthai", { required: "Chọn trạng thái" })}
                                            className="text-blue-600"
                                        />
                                        <span>Không hoạt động</span>
                                    </label>
                                </div>
                                {errors.trangthai && <span className="text-red-700 text-base">{errors.trangthai.message}</span>}
                            </div>

                            <div className="mb-3 relative top-2 block">
                                <label htmlFor="ngayCapNhat" className="form-label block">Ngày cập nhật</label>
                                <input
                                    type="datetime-local"
                                    className="form-control w-2/5 px-4 py-2 border rounded-md block"
                                    id="ngayCapNhat"
                                    {...register("ngayCapNhat", { required: "Vui lòng chọn ngày" })}
                                />
                                {errors.ngayCapNhat && <span className="text-red-700 text-base m-0">{errors.ngayCapNhat.message}</span>}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
                    >
                        Cập nhật gói VIP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuaGoiVip;
