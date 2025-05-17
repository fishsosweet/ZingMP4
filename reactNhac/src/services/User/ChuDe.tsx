import axiosInstance from "../../../configs/axios.tsx";

export const getPlaylistLofi = async () => {
    try {
        const res = await axiosInstance.get('/user/getPlaylistLofi');
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}

export const getPlaylistTrung = async () => {
    try {
        const res = await axiosInstance.get('/user/getPlaylistTrung');
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}

export const getPlaylistAuMy = async () => {
    try {
        const res = await axiosInstance.get('/user/getPlaylistAuMy');
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}

export const getPlaylistAll = async () => {
    try {
        const res = await axiosInstance.get('/user/getPlaylistAll');
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}
export const getSongsInPlaylist = async (id: number) => {
    return axiosInstance.get(`/user/getSonginPlaylist/${id}`);
};
