import axiosInstance from "../../configs/axios.tsx";


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

const logoutAdmin = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token_expiry");
    delete axiosInstance.defaults.headers.common['Authorization'];
    window.location.href = '/login-admin';
}

export { loginAdmin, logoutAdmin };

