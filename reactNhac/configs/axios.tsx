import axios from "axios";//Axios de gui cac Request nhuw GET, POST,...

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.url?.startsWith('/auth/')) {
            const token = localStorage.getItem('admin_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } else if (config.url?.startsWith('/user/')) {
            const token = localStorage.getItem('user_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Chỉ xóa token và chuyển hướng khi token hết hạn hoặc không hợp lệ
        // Không xử lý lỗi đăng nhập ở đây
        if (error.response?.status === 401 &&
            !error.config.url?.includes('/user/login') &&
            !error.config.url?.includes('/auth/login')) {
            if (error.config.url?.startsWith('/auth/')) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_info');
                window.location.href = '/login-admin';
            } else if (error.config.url?.startsWith('/user/')) {
                localStorage.removeItem('user_token');
                localStorage.removeItem('user_info');
                window.location.href = '/login-user';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
