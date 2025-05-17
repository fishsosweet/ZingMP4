import Sidebar from '../SideBar';
import {SubmitHandler, useForm} from "react-hook-form";
import {getThongTinCaSi, postSuaCaSi} from "../../../services/Admin/CaSiService.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

type Inputs = {
    tenCaSi: string,
    gioiTinh:string,
    moTa: string,
    anh: File,
    ngayCapNhat: Date,
};
const SuaCaSi = () => {
    const [caSi,setCaSi] =useState<any>(null);
    const { id } = useParams();
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const {register, handleSubmit, reset, formState: {errors},setValue} = useForm<Inputs>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const suaCaSi: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await postSuaCaSi(data,parseInt(id!));
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
            if (res.success) {
                await getCaSi();
            }
        } catch (error) {
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }
    const getCaSi=async ()=>{
        try{
            const res = await getThongTinCaSi(parseInt(id!));
            if (res) {
                setCaSi(res);
            }
        }
        catch (error){
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }
    useEffect(() => {
        getCaSi();
    }, []);
    useEffect(() => {
        if (caSi) {
            setValue('tenCaSi', caSi.ten_casi);
            setValue('gioiTinh', caSi.gioitinh);
            setValue('moTa', caSi.mota);
            setPreviewImage(caSi.anh);
        }
    }, [caSi]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setValue('anh', file);
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
                <h1 className="mb-4 font-bold text-2xl">Cập nhật ca sĩ</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(suaCaSi)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-5">
                                <label htmlFor="tentheloai" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên ca sĩ
                                </label>
                                <input
                                    type="text"
                                    id="tentheloai"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("tenCaSi", {required: "Vui lòng nhập tên Ca Sĩ"})}
                                />
                                {errors.tenCaSi && (
                                    <span className="text-red-600 text-sm">{errors.tenCaSi.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="Nam"
                                            {...register("gioiTinh", {required: "Chọn giới tính"})}
                                            className="text-blue-600"
                                        />
                                        <span>Nam</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="Nữ"
                                            {...register("gioiTinh", {required: "Chọn giới tính"})}
                                            className="text-blue-600"
                                        />
                                        <span>Nữ</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="moTaCaSi" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả ca sĩ
                                </label>
                                <textarea
                                    id="moTaCaSi"

                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("moTa", {required: "Vui lòng nhập mô tả ca sĩ"})}
                                />
                                {errors.moTa && (
                                    <span className="text-red-600 text-sm">{errors.moTa.message}</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="mb-5">
                                <label htmlFor="anh" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh bìa
                                </label>
                                <input
                                    type="file"
                                    id="anh"
                                    name="anh"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"

                                />
                                {previewImage && (
                                    <div id="image_show" className="mt-2">
                                        <img src={previewImage.startsWith('data:') ? previewImage : `http://127.0.0.1:8000/${previewImage}`} alt="Preview" className="h-40 object-cover rounded-md"/>
                                    </div>
                                )}
                            </div>

                            <div className="mb-5">
                                <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày cập nhật
                                </label>
                                <input
                                    type="datetime-local"
                                    id="created_at"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("ngayCapNhat", {required: "Vui lòng chọn ngày"})}
                                />
                                {errors.ngayCapNhat && (
                                    <span className="text-red-600 text-sm">{errors.ngayCapNhat.message}</span>
                                )}
                            </div>
                        </div>

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                       Cập nhật ca sĩ
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuaCaSi;
