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
        // Chỉ xử lý lỗi 401 khi người dùng đã đăng nhập
        if (error.response?.status === 401) {
            const isAdminRoute = error.config.url?.startsWith('/auth/');
            const isUserRoute = error.config.url?.startsWith('/user/');
            const isLoginRoute = error.config.url?.includes('/login');

            // Chỉ xử lý khi không phải route đăng nhập
            if (!isLoginRoute) {
                if (isAdminRoute && localStorage.getItem('admin_token')) {
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_info');
                    window.location.href = '/login-admin';
                } else if (isUserRoute && localStorage.getItem('user_token')) {
                    localStorage.removeItem('user_token');
                    localStorage.removeItem('user_info');
                    window.location.href = '/login-user';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
