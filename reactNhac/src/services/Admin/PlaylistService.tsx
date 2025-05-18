import axiosInstance from "../../../configs/axios.tsx";

type post = {
    tenPlaylist: string,
    trangThai: string,
    anh: File,
    theloai_id: string,
    ngayTao?: string,
    ngayCapNhat?: string,
}
const postPlaylist = async (playList: post) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('tenPlaylist', playList.tenPlaylist);
        formData.append('trangThai', playList.trangThai.toString());
        formData.append('theloai_id', playList.theloai_id);
        formData.append('anh', playList.anh);
        // @ts-ignore
        formData.append('ngayTao', playList.ngayTao);

        const response = await axiosInstance.post('/auth/postPlaylist', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        });
        return { success: true, message: response.data.success };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return { success: false, message: errorMessage };
    }
}

const getThongTinPlaylist = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/auth/thongTinPlaylist/${id}`);
        return res.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return { success: false, message: errorMessage };
    }
}
const postSuaPlaylist = async (playlist: post, id: number) => {
    try {
        const formData = new FormData();
        formData.append('tenPlaylist', playlist.tenPlaylist);
        formData.append('theloai_id', playlist.theloai_id);
        formData.append('trangThai', playlist.trangThai);
        if (playlist.anh) {
            formData.append('anh', playlist.anh);
        }
        if (playlist.ngayCapNhat) {
            formData.append('ngayCapNhat', playlist.ngayCapNhat);
        }
        const response = await axiosInstance.post(`/auth/postSuaPlaylist/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return { success: true, message: response.data.success };
    } catch (error: any) {
        throw error.response?.data?.error
    }
}

const getListPlaylist = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/auth/getListPlaylist?page=${page}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || 'Đã xảy ra lỗi!';
    }
}
const deletePlaylist = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/auth/deletePlaylist/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

const deleteBaiHatOfPlaylist = async (playlistId: number, songId: number) => {
    try {
        const response = await axiosInstance.delete(`/auth/playlist/${playlistId}/songs/${songId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};
const getBaiHatOfPlaylist = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/auth/playlists/${id}`);;
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || 'Đã xảy ra lỗi!';
    }
};


export { postPlaylist, getListPlaylist, postSuaPlaylist, deletePlaylist, getThongTinPlaylist, getBaiHatOfPlaylist, deleteBaiHatOfPlaylist };
