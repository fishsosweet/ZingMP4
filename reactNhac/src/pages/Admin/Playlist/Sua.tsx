import Sidebar from '../SideBar';
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getThongTinPlaylist, postSuaPlaylist} from "../../../services/Admin/PlaylistService.tsx";
import Select from "react-select";
import {getDSTheLoai} from "../../../services/Admin/BaiHatService.tsx";

type Inputs = {
    tenPlaylist: string,
    anh: File,
    theloai_id:string,
    trangThai:boolean,
    ngayCapNhat: Date,
};
const SuaPlaylist = () => {
    const [playlist,setPlaylist] =useState<any>(null);
    const { id } = useParams();
    const [theLoai,setTheLoai] =useState<any[]>([]);
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const {register, handleSubmit, reset, formState: {errors},setValue,watch} = useForm<Inputs>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const suaPlayList: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await postSuaPlaylist(data,parseInt(id!));
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
            if (res.success) {
                await getPlaylist();
            }
        } catch (error) {
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }
    const getPlaylist=async ()=>{
        try{
            const res = await getThongTinPlaylist(parseInt(id!));
            if (res) {
                setPlaylist(res);
            }
        }
        catch (error){
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }

    useEffect(() => {
        getPlaylist();
    }, []);

    useEffect(() => {
        if (playlist) {
            setValue('tenPlaylist', playlist.ten_playlist);
            setValue('theloai_id', playlist.theloai_id);
            setValue('trangThai', playlist.trangthai.toString());
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
    const getTheLoai=async ()=>{
        try{
            const res = await getDSTheLoai();
            if (res && Array.isArray(res)) {
                setTheLoai(res);
            }
        }
        catch (error){
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
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
                <h1 className="mb-4 font-bold text-2xl">Cập nhật playlist</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(suaPlayList)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-5">
                                <label htmlFor="tentheloai" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên playlist
                                </label>
                                <input
                                    type="text"
                                    id="tentheloai"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("tenPlaylist", {required: "Vui lòng nhập tên Playlist"})}
                                />
                                {errors.tenPlaylist && (
                                    <span className="text-red-600 text-sm">{errors.tenPlaylist.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="theloai">Chọn thể loại:</label>
                                <input
                                    type="hidden"
                                    name="idTheLoai"
                                />
                                <Select
                                    options={optionsTheLoai}
                                    value={optionsTheLoai.find(option => option.value === watch('theloai_id')) || null}
                                    onChange={(selectedOption) => {
                                        setValue('theloai_id', selectedOption?.value);
                                    }}
                                    placeholder="Nhập tên thể loại..."
                                />
                            </div>
                            <div className=" block mb-5">
                                <label className="form-label">Kích Hoạt</label>
                                <div className="custom-control custom-radio">
                                    <input
                                        className="custom-control-input"
                                        type="radio"

                                        value="1"
                                        {...register("trangThai", {required: "Chọn trạng thái"})}
                                    />
                                    <label htmlFor="active" className="custom-control-label">Có</label>
                                </div>
                                <div className="custom-control custom-radio">
                                    <input
                                        className="custom-control-input"
                                        type="radio"
                                        value="0"
                                        {...register("trangThai", {required: "Chọn trạng thái"})}
                                    />
                                    <label htmlFor="no_active" className="custom-control-label">Không</label>
                                </div>
                                {errors.trangThai &&
                                    <span className="text-red-700 text-base">{errors.trangThai.message}</span>}

                                <div className="mb-5">
                                    <label htmlFor="created_at"
                                           className="block text-sm font-medium text-gray-700 mb-1">
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
                                    <img
                                            src={previewImage.startsWith('data:') ? previewImage : `http://127.0.0.1:8000/${previewImage}`}
                                            alt="Preview" className="h-40 object-cover rounded-md"/>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Cập nhật playlist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuaPlaylist;
