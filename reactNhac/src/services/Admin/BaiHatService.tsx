import axiosInstance from "../../../configs/axios.tsx";

type post = {
    tenBaiHat: string,
    idCaSi:string,
    idTheLoai: string,
    audio_URL: string,
    anh:File,
    thoiLuong:number,
    trangThai:boolean,
    loiBaiHat:string,
    vip:boolean,
    ngayTao?: Date,
    ngayCapNhat?:Date
};

const getDSTheLoai =async ()=>{
    try{
        const res=await axiosInstance.get('/auth/dsTheLoai');
        return res.data
    }catch (error: any){
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
}
const getDSCaSi =async ()=>{
    try{
        const res=await axiosInstance.get('/auth/dsCaSi');
        return res.data
    }catch (error: any){
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
}

const getThongTinBaiHat = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/auth/thongTinBaiHat/${id}`);
        return res.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
}

const postBaiHat = async (baihat: post) => {
    try {
        const formData = new FormData();
        formData.append('tenBaiHat', baihat.tenBaiHat);
        formData.append('idCaSi', baihat.idCaSi);
        formData.append('idTheLoai', baihat.idTheLoai);
        formData.append('audio_URL', baihat.audio_URL);
        formData.append('trangThai', baihat.trangThai.toString());
        formData.append('vip', baihat.vip.toString());
        formData.append('loiBaiHat', baihat.loiBaiHat);
        formData.append('thoiLuong', baihat.thoiLuong.toString());
        formData.append('anh', baihat.anh);
        // @ts-ignore
        formData.append('ngayTao', baihat.ngayTao);

        const response = await axiosInstance.post('/auth/postBaiHat', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return {success: true, message: response.data.success};
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
};

const postSuaBaiHat = async (baihat: post,id: number) => {
    try {
        const formData = new FormData();
        formData.append('tenBaiHat', baihat.tenBaiHat);
        formData.append('idCaSi', baihat.idCaSi);
        formData.append('idTheLoai', baihat.idTheLoai);
        formData.append('audio_URL', baihat.audio_URL);
        formData.append('trangThai', baihat.trangThai.toString());
        formData.append('loiBaiHat', baihat.loiBaiHat);
        formData.append('vip', baihat.vip.toString());
        formData.append('thoiLuong', baihat.thoiLuong.toString());
        formData.append('anh', baihat.anh);
        // @ts-ignore
        formData.append('ngayCapNhat', baihat.ngayCapNhat);
        const response = await axiosInstance.post(`/auth/postSuaBaiHat/${id}`,  formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return {success: true, message: response.data.success};
    } catch (error: any) {
        throw error.response?.data?.error
    }
}



const getListBaiHat = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/auth/getListBaiHat?page=${page}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || 'Đã xảy ra lỗi!';
    }
}

const deleteBaiHat = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/auth/deleteBaiHat/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};
const openPlaylist = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/auth/choosePlaylists', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data
    } catch (error) {
        alert("Không thể lấy danh sách playlist.");
    }
};

const addSongToPlaylist = async (playlistId: number, selectedSongId: number | null) => {
    try {
        const response = await axiosInstance.post('/auth/addBaiHatList', {
            playlist_id: playlistId,
            song_id: selectedSongId,
        });
        return response.data
    } catch (error) {
        alert('Lỗi khi thêm bài hát');
    }
};

export {postBaiHat,getListBaiHat,deleteBaiHat,postSuaBaiHat,getDSTheLoai,getDSCaSi,getThongTinBaiHat,openPlaylist,addSongToPlaylist};
