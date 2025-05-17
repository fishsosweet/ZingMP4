import axiosInstance from "../../../configs/axios.tsx";

export const get10NewSongs = async () => {
    try {
        const res = await axiosInstance.get('/user/get10NewSongs');
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}



