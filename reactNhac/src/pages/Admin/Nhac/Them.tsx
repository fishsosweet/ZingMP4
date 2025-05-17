import Sidebar from '../SideBar';
import {SubmitHandler, useForm} from "react-hook-form";

import {postBaiHat} from "../../../services/Admin/BaiHatService.tsx";
import {useState,useEffect} from "react";
import {getDSTheLoai,getDSCaSi} from "../../../services/Admin/BaiHatService.tsx";
import Select from 'react-select';
type Inputs = {
    tenBaiHat: string,
    idCaSi:string,
    idTheLoai: string,
    audio_URL: string,
    anh:File,
    loiBaiHat: string,
    thoiLuong:number,
    trangThai:boolean,
    vip:boolean,
    ngayTao: Date,
};


const BaiHat = () => {
    const [thongBao, setThongBao] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const {register, handleSubmit, reset, formState: {errors},setValue} = useForm<Inputs>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [theLoai,setTheLoai] =useState<any[]>([]);
    const [casi,setCaSi] =useState<any[]>([]);
    const [audioURL, setAudioURL] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const isValidYouTubeUrl = (url: string) => {
        const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtube\.com)\/(watch\?v=|embed\/)([a-zA-Z0-9_-]{11})/;
        return youtubeRegex.test(url);
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setAudioURL(url);
        setValue('audio_URL', url);
        if (isValidYouTubeUrl(url)) {
            setIsValid(true);
        } else {
            setIsValid(false);
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
    const getCaSi=async ()=>{
        try{
            const res = await getDSCaSi();
            if (res && Array.isArray(res)) {
                setCaSi(res);
            }
        }
        catch (error){
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }
    const themBaiHat: SubmitHandler<Inputs> = async (data) => {
        try {

            const res = await postBaiHat(data);
            setThongBao({
                type: res.success ? 'success' : 'error',
                message: res.message
            });
            reset();
        } catch (error) {
            setThongBao({type: 'error', message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'});
        }
    }
    useEffect(() => {
        getTheLoai();
        getCaSi();
    }, []);


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


    const optionsTheLoai = theLoai.map((tl) => ({
        value: tl.id,
        label: tl.ten_theloai,
    }));
    const optionsCaSi = casi.map((tl) => ({
        value: tl.id,
        label: tl.ten_casi,
    }));


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
                <h1 className="mb-4 font-bold text-2xl">Thêm Bài Hát</h1>
                <form encType="multipart/form-data" onSubmit={handleSubmit(themBaiHat)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-5">
                                <label htmlFor="tentheloai" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên bài hát
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("tenBaiHat", {required: "Vui lòng nhập tên Bài Hát"})}
                                />
                                {errors.tenBaiHat && (
                                    <span className="text-red-600 text-sm">{errors.tenBaiHat.message}</span>
                                )}
                            </div>
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
                            <div className="mb-5">
                                <label htmlFor="theloai">Chọn thể loại:</label>
                                <input
                                    type="hidden"
                                    {...register("idTheLoai", {required: "Vui lòng chọn thể loại"})}
                                />
                                <Select
                                    options={optionsTheLoai}
                                    onChange={(selectedOption) => {
                                        // @ts-ignore
                                        setValue('idTheLoai', selectedOption?.value);
                                    }}
                                    placeholder="Nhập tên thể loại..."
                                />
                                {errors.idTheLoai && (
                                    <span className="text-red-600 text-sm">{errors.idTheLoai.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="theloai">Chọn ca sĩ:</label>
                                <input
                                    type="hidden"
                                    {...register("idCaSi", {required: "Vui lòng chọn ca sĩ"})}
                                />
                                <Select
                                    options={optionsCaSi}
                                    onChange={(selectedOption) => {
                                        // @ts-ignore
                                        setValue('idCaSi', selectedOption?.value);
                                    }}
                                    placeholder="Nhập tên thể loại..."
                                />
                                {errors.idCaSi && (
                                    <span className="text-red-600 text-sm">{errors.idCaSi.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vip</label>
                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="1"
                                            {...register("vip", {required: "Chọn trạng thái"})}
                                            className="text-blue-600"
                                        />
                                        <span>Có</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="0"
                                            {...register("vip", {required: "Chọn trạng thái"})}
                                            className="text-blue-600"
                                        />
                                        <span>Không</span>
                                    </label>

                                </div>
                                {errors.vip && (
                                    <span className="text-red-600 text-sm">{errors.vip.message}</span>
                                )}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="loiBaiHat" className="block text-sm font-medium text-gray-700 mb-1">
                                    Lyrics
                                </label>
                                <textarea
                                    id="loiBaiHat"

                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("loiBaiHat", {required: "Vui lòng nhập lyrics"})}
                                />
                                {errors.loiBaiHat && (
                                    <span className="text-red-600 text-sm">{errors.loiBaiHat.message}</span>
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
                                <label htmlFor="audioURL" className="block text-sm font-medium text-gray-700 mb-1">
                                    Link nhạc từ YouTube
                                </label>
                                <input
                                    type="text"
                                    id="audioURL"
                                    value={audioURL}
                                    {...register("audio_URL", {required: "Vui lòng nhập link YouTube" })}
                                    onChange={handleAudioChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập link YouTube"

                                />

                                {!isValid &&(
                                    <span className="text-red-600 text-sm">Vui lòng nhập link hợp lệ YouTube</span>
                                )}
                                {errors.audio_URL && (
                                    <><br></br><span
                                        className="text-red-600 text-sm">{errors.audio_URL.message}</span></>
                                )}
                            </div>
                            {isValid && audioURL && (
                                <div className="mt-4">
                                    <iframe
                                        width="300"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${audioURL.split('v=')[1]}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                            <div className="mb-5">
                                <label htmlFor="thoiluong" className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời lượng (phút)
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    {...register("thoiLuong", {
                                        required: "Vui lòng nhập thời lượng bài hát",
                                        min: {
                                            value: 1,
                                            message: "Thời lượng tối thiểu là 1 phút"
                                        },
                                        max: {
                                            value: 60,
                                            message: "Thời lượng tối đa là 60 phút"
                                        }
                                    })}
                                />
                                {errors.thoiLuong && (
                                    <span className="text-red-600 text-sm">{errors.thoiLuong.message}</span>
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
                        Thêm bài hát
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BaiHat;
