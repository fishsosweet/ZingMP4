import axiosInstance from "../../../configs/axios.tsx";

type post = {
    gia: number,
    thoi_han: number,
    trangthai: number,
    ngayTao?: Date,
    ngayCapNhat?: Date,
}

const postGoiVip = async (goiVip: post) => {
    try {
        const response = await axiosInstance.post('/auth/postGoiVip', {
            gia: goiVip.gia,
            thoi_han: goiVip.thoi_han,
            trang_thai: goiVip.trangthai,
            ngayTao: goiVip.ngayTao
        })
        return { success: true, message: response.data.success };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return { success: false, message: errorMessage };
    }
}

const getThongTinGoiVip = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/auth/thongTinGoiVip/${id}`);
        return res.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return { success: false, message: errorMessage };
    }
}

const postSuaGoiVip = async (goiVip: post, id: number) => {
    try {
        const response = await axiosInstance.post(`/auth/postSuaGoiVip/${id}`, {
            gia: goiVip.gia,
            thoi_han: goiVip.thoi_han,
            trang_thai: goiVip.trangthai,
            ngayCapNhat: goiVip.ngayCapNhat
        })
        return { success: true, message: response.data.success };
    } catch (error: any) {
        throw error.response?.data?.error
    }
}

const getListGoiVip = async (page: number, per_page: number = 10) => {
    try {
        const response = await axiosInstance.get(`/auth/getListGoiVip?page=${page}&per_page=${per_page}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || 'Đã xảy ra lỗi!';
    }
}

const deleteGoiVip = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/auth/deleteGoiVip/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export { postGoiVip, getListGoiVip, postSuaGoiVip, deleteGoiVip, getThongTinGoiVip };
