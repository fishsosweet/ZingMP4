import axiosInstance from "../../../configs/axios.tsx";

export const getTop10Songs = async () => {
    try {
        const res = await axiosInstance.get('/user/getTop10');
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}



