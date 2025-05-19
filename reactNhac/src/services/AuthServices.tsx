import axiosInstance from "../../configs/axios.tsx";
import { useLikedSongs } from "../contexts/LikedSongsContext";

type LoginAdmin = {
    email: string,
    password: string,
}

const loginAdmin = async (loginAdmin: LoginAdmin) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: loginAdmin.email,
            password: loginAdmin.password
        });

        if (response.data && response.data.access_token) {
            const token = response.data.access_token;
            localStorage.setItem("admin_token", token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data;
        }
        throw new Error('Không nhận được token từ server');
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        throw error;
    }
}

const logout = () => {
    // Xóa tất cả thông tin người dùng
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token_expiry");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_info");
    delete axiosInstance.defaults.headers.common['Authorization'];

    // Kích hoạt sự kiện storage để xóa danh sách bài hát đã like
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'user_info',
        newValue: null,
        oldValue: localStorage.getItem('user_info'),
        storageArea: localStorage
    }));

    window.location.href = '/login-user';
}

export { loginAdmin, logout };

