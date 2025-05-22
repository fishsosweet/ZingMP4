import axiosInstance from "../../../configs/axios.tsx";

const getDSBaiRandom = async () => {
    try {
        const res = await axiosInstance.get('/user/getRandomSongs');
        return res.data
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}
const getDSPlaylist = async () => {
    try {
        const res = await axiosInstance.get('/user/getPlaylist');
        return res.data
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
}
const getDSPhat = async (excludeIds: number[] = []) => {
    try {
        const token = localStorage.getItem('user_token');
        const userInfo = localStorage.getItem('user_info');
        let isVip = false;

        if (token && userInfo) {
            try {
                const user = JSON.parse(userInfo);
                isVip = user.vip === 1;
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
        if (token && isVip) {
            return await axiosInstance.post("/user/nextSongs", {exclude: excludeIds});
        } else {
            return await axiosInstance.post("/user/nextSongsNonVip", {exclude: excludeIds});
        }
    } catch (error) {
        console.error('Error fetching next songs:', error);
        return { error: true };
    }
};


const getSongsInPlaylist = async (id: number) => {
    return axiosInstance.get(`/user/getSonginPlaylist/${id}`);
};
const getDSMoiPhatHanh = async () => {
    return axiosInstance.get(`/user/getNewSongs`);
};
const tangLuotXem = async (id: number) => {
    return axiosInstance.post(`/user/BaiHat/${id}/tangLuotXem`);
};
const getSong = async () => {
    return axiosInstance.get(`/user/getSong`);
};

export const getThongTinBaiHat = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/user/getThongTinBaiHat/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        return [];
    }
};


export const getThongTinCaSi = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/user/getThongTinCaSi/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        return [];
    }
};

export const getTopSongs = async () => {
    try {
        const response = await axiosInstance.get("/user/getTopBaiHat");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy top bài hát:", error);
        return [];
    }
};

const getRelatedSongs = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/user/getRelatedSongs/${id}`);
        return res.data;
    } catch (error: any) {
        return { error: "Load thất bại!" };
    }
};

export { getDSBaiRandom, getDSPhat, getDSPlaylist, getSongsInPlaylist, getDSMoiPhatHanh, tangLuotXem, getSong, getRelatedSongs }
