import axiosInstance from "../../../configs/axios.tsx";

type post = {
    tenCaSi: string,
    gioiTinh: string,
    moTa: string,
    anh:File,
    ngayTao?: Date,
    ngayCapNhat?: Date,
}

const postCaSi = async (casi: post) => {
    try {
        const formData = new FormData();
        formData.append('tenCaSi', casi.tenCaSi);
        formData.append('gioiTinh', casi.gioiTinh);
        formData.append('moTa', casi.moTa);
        formData.append('anh', casi.anh);
        // @ts-ignore
        formData.append('ngayTao', casi.ngayTao);

        const response = await axiosInstance.post('/auth/postCaSi', formData, {
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

const getThongTinCaSi = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/auth/thongTinCaSi/${id}`);
        return res.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Đã có lỗi xảy ra";
        return {success: false, message: errorMessage};
    }
}
const postSuaCaSi = async (casi: post,id: number) => {
    try {
        const formData = new FormData();
        formData.append('tenCaSi', casi.tenCaSi);
        formData.append('gioiTinh', casi.gioiTinh);
        formData.append('moTa', casi.moTa);
        formData.append('anh', casi.anh);
        // @ts-ignore
        formData.append('ngayCapNhat', casi.ngayCapNhat);
        const response = await axiosInstance.post(`/auth/postSuaCaSi/${id}`,  formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return {success: true, message: response.data.success};
    } catch (error: any) {
        throw error.response?.data?.error
    }
}

const getListCaSi = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/auth/getListCaSi?page=${page}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || 'Đã xảy ra lỗi!';
    }
}

const deleteCaSi = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/auth/deleteCaSi/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};


export {postCaSi,getListCaSi,deleteCaSi,postSuaCaSi,getThongTinCaSi};
