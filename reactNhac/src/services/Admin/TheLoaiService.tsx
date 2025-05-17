import axiosInstance from "../../../configs/axios.tsx";

type post = {
    tenTheLoai: string,
    trangThai: boolean,
    ngayTao?: Date,
    ngayCapNhat?: Date,
}
const postTheLoai = async (theLoai: post) => {
    try {
        const response = await axiosInstance.post('/auth/postTheLoai', {
            tenTheLoai: theLoai.tenTheLoai,
            trangThai: theLoai.trangThai,
            ngayTao: theLoai.ngayTao
        })
        return {success: true, message: response.data.success};
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
}

const getThongTinTheLoai = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/auth/thongTinTheLoai/${id}`);
        return res.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
}
const postSuaTheLoai = async (theLoai: post,id: number) => {
    try {
        const response = await axiosInstance.post(`/auth/postSuaTheLoai/${id}`, {
            tenTheLoai: theLoai.tenTheLoai,
            trangThai: theLoai.trangThai,
            ngayCapNhat: theLoai.ngayCapNhat
        })
        return {success: true, message: response.data.success};
    } catch (error: any) {
        throw error.response?.data?.error
    }
}

const getListTheLoai = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/auth/getListTheLoai?page=${page}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || 'Đã xảy ra lỗi!';
    }
}
const deleteTheLoai = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/auth/deleteTheLoai/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export {postTheLoai, getListTheLoai,postSuaTheLoai,deleteTheLoai,getThongTinTheLoai};
