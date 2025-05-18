import Sidebar from '../SideBar';
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThongTinPlaylist, postSuaPlaylist } from "../../../services/Admin/PlaylistService.tsx";
import Select from "react-select";
import { getDSTheLoai } from "../../../services/Admin/BaiHatService.tsx";

type Inputs = {
    tenPlaylist: string,
    anh: File | null,
    theloai_id: string,
    trangThai: string,
    ngayCapNhat: string,
};

const SuaPlaylist = () => {
    const [playlist, setPlaylist] = useState<any>(null);
    const { id } = useParams();
    const [theLoai, setTheLoai] = useState<any[]>([]);
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<Inputs>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const suaPlayList: SubmitHandler<Inputs> = async (data) => {
        try {
            // Kiểm tra dữ liệu trước khi gửi
            if (!data.tenPlaylist || !data.theloai_id || !data.trangThai || !data.ngayCapNhat) {
                setThongBao({
                    type: 'error',
                    message: 'Vui lòng điền đầy đủ thông tin'
                });
                return;
            }

            const playlistData = {
                tenPlaylist: data.tenPlaylist,
                theloai_id: data.theloai_id,
                trangThai: data.trangThai,
                ngayCapNhat: data.ngayCapNhat,
                anh: data.anh || null
            };

            const res = await postSuaPlaylist(playlistData, parseInt(id!));
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });

            if (res.success) {
                await getPlaylist();
                reset();
            }
        } catch (error: any) {
            console.error('Lỗi khi cập nhật playlist:', error);
            setThongBao({
                type: 'error',
                message: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
            });
        }
    }

    const getPlaylist = async () => {
        try {
            const res = await getThongTinPlaylist(parseInt(id!));
            if (res) {
                setPlaylist(res);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin playlist:', error);
            setThongBao({
                type: 'error',
                message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
            });
        }
    }

    useEffect(() => {
        getPlaylist();
    }, []);

    useEffect(() => {
        if (playlist) {
            setValue('tenPlaylist', playlist.ten_playlist);
            setValue('theloai_id', playlist.theloai_id);
            setValue('trangThai', playlist.trangthai ? "1" : "0");
            setValue('ngayCapNhat', new Date().toISOString().slice(0, 16));
            setPreviewImage(playlist.anh);
        }
    }, [playlist]);

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

    const getTheLoai = async () => {
        try {
            const res = await getDSTheLoai();
            if (res && Array.isArray(res)) {
                setTheLoai(res);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thể loại:', error);
            setThongBao({
                type: 'error',
                message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
            });
        }
    }

    const optionsTheLoai = theLoai.map((tl) => ({
        value: tl.id,
        label: tl.ten_theloai,
    }));

    useEffect(() => {
        getTheLoai();
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
                <h1 className="mb-4 font-bold text-2xl">Cập nhật playlist</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(suaPlayList)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-5">
                                <label htmlFor="tenPlaylist" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên playlist
                                </label>
                                <input
                                    type="text"
                                    id="tenPlaylist"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("tenPlaylist", { required: "Vui lòng nhập tên Playlist" })}
                                />
                                {errors.tenPlaylist && (
                                    <span className="text-red-600 text-sm">{errors.tenPlaylist.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="theloai" className="block text-sm font-medium text-gray-700 mb-1">
                                    Chọn thể loại
                                </label>
                                <Select
                                    options={optionsTheLoai}
                                    value={optionsTheLoai.find(option => option.value === watch('theloai_id')) || null}
                                    onChange={(selectedOption) => {
                                        setValue('theloai_id', selectedOption?.value);
                                    }}
                                    placeholder="Chọn thể loại..."
                                />
                                {!watch('theloai_id') && (
                                    <span className="text-red-600 text-sm">Vui lòng chọn thể loại</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            {...register("trangThai", { required: "Vui lòng chọn trạng thái" })}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Kích hoạt</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            {...register("trangThai", { required: "Vui lòng chọn trạng thái" })}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Không kích hoạt</span>
                                    </label>
                                </div>
                                {errors.trangThai && (
                                    <span className="text-red-600 text-sm">{errors.trangThai.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="ngayCapNhat" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày cập nhật
                                </label>
                                <input
                                    type="datetime-local"
                                    id="ngayCapNhat"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("ngayCapNhat", { required: "Vui lòng chọn ngày cập nhật" })}
                                />
                                {errors.ngayCapNhat && (
                                    <span className="text-red-600 text-sm">{errors.ngayCapNhat.message}</span>
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
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                                {previewImage && (
                                    <div className="mt-2">
                                        <img
                                            src={previewImage.startsWith('data:') ? previewImage : `http://127.0.0.1:8000/${previewImage}`}
                                            alt="Preview"
                                            className="h-40 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
                    >
                        Cập nhật playlist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuaPlaylist;
