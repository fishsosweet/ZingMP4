
import Sidebar from '../SideBar';
import {SubmitHandler, useForm} from "react-hook-form";
import {getThongTinTheLoai, postSuaTheLoai} from "../../../services/Admin/TheLoaiService.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
type Inputs = {
    tenTheLoai: string,
    trangThai: boolean,
    ngayCapNhat: Date
};
const SuaTheLoai = () => {
    const [theLoai,setTheLoai] =useState<any>(null);
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { register, handleSubmit,reset,setValue, formState: { errors } } = useForm<Inputs>();
    const { id } = useParams();
    const suaTheLoai: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await postSuaTheLoai(data,parseInt(id!));
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
            if (res.success) {
                await getTheLoai();
            }
        }
        catch (error: any){
            console.error("Lỗi cập nhật:", error);
            setThongBao({
                type: 'error',
                message: typeof error === 'string'
                    ? error
                    : (error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.')
            });
        }
    }
    const getTheLoai=async ()=>{
        try{
            const res = await getThongTinTheLoai(parseInt(id!));
            if (res) {
                setTheLoai(res);
            }
        }
        catch (error){
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }
    useEffect(() => {
        getTheLoai();
    }, []);
    useEffect(() => {
        if (theLoai) {
            setValue('tenTheLoai', theLoai.ten_theloai);
            setValue('trangThai', theLoai.trangthai.toString());
        }
    }, [theLoai]);

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
                <h1 className="mb-4 font-bold text-2xl">Cập nhật thể loại</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(suaTheLoai)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="tentheloai" className="form-label block">Tên thể loại</label>
                                <input
                                    type="text"
                                    id="tentheloai"
                                    className="w-2/5 px-4 py-2 border rounded-md block mb-5"
                                    {...register("tenTheLoai", { required: "Vui lòng nhập tên Thể Loại" })}
                                />
                                {errors.tenTheLoai && <span className="text-red-700 text-base">{errors.tenTheLoai.message}</span>}
                            </div>

                            <div className=" block mb-5">
                                <label className="form-label">Kích Hoạt</label>
                                <div className="custom-control custom-radio">
                                    <input
                                        className="custom-control-input"
                                        type="radio"

                                        value="1"
                                        {...register("trangThai", { required: "Chọn trạng thái" })}
                                    />
                                    <label htmlFor="active" className="custom-control-label">Có</label>
                                </div>
                                <div className="custom-control custom-radio">
                                    <input
                                        className="custom-control-input"
                                        type="radio"
                                        value="0"
                                        {...register("trangThai", { required: "Chọn trạng thái" })}
                                    />
                                    <label htmlFor="no_active" className="custom-control-label">Không</label>
                                </div>
                                {errors.trangThai && <span className="text-red-700 text-base">{errors.trangThai.message}</span>}
                                <div className="mb-3 relative top-2 block ">
                                    <label htmlFor="created_at" className="form-label block">Ngày cập nhật</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control w-2/5 px-4 py-2 border rounded-md block "
                                        id="created_at"
                                        {...register("ngayCapNhat", { required: "Vui lòng chọn ngày " })}
                                    />
                                </div>
                                {errors.ngayCapNhat && <span className="text-red-700 text-base m-0">{errors.ngayCapNhat.message}</span>}
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Cập nhật thể loại
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuaTheLoai;
