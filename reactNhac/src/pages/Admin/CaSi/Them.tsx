import Sidebar from '../SideBar';
import {SubmitHandler, useForm} from "react-hook-form";
import {postCaSi} from "../../../services/Admin/CaSiService.tsx";
import {useState,useEffect} from "react";

type Inputs = {
    tenCaSi: string,
    gioiTinh:string,
    moTa: string,
    anh: File,
    ngayTao: Date,
};
const CaSi = () => {
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const {register, handleSubmit, reset, formState: {errors},setValue} = useForm<Inputs>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const themCaSi: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await postCaSi(data);
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
        } catch (error) {
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }



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
                <h1 className="mb-4 font-bold text-2xl">Thêm Ca Sĩ</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(themCaSi)}>
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
                                {errors.gioiTinh && (
                                    <span className="text-red-600 text-sm">{errors.gioiTinh.message}</span>
                                )}
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
                                        <img src={previewImage} alt="Preview" className="h-40 object-cover rounded-md"/>
                                    </div>
                                )}
                            </div>

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

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Thêm ca sĩ
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CaSi;
