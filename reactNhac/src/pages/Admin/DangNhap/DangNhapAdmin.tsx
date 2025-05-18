import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../../configs/axios.tsx";

const LoginAdmin = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Chỉ xóa token admin
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_info');

            const response = await axiosInstance.post('/admin/login', formData);
            if (response.data.access_token) {
                localStorage.setItem('admin_token', response.data.access_token);

                try {
                    const adminInfo = await axiosInstance.get('/admin/getThongTinAdmin');
                    if (adminInfo.data) {
                        const adminData = {
                            id: adminInfo.data.id,
                            name: adminInfo.data.name,
                            email: adminInfo.data.email,
                            level: adminInfo.data.level,
                            image: adminInfo.data.image || null
                        };
                        localStorage.setItem('admin_info', JSON.stringify(adminData));
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin admin:', error);
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_info');
                    setLoginError('Không thể lấy thông tin admin');
                    return;
                }

                navigate('/admin', { replace: true });
            }
        } catch (error: any) {
            console.error('Lỗi đăng nhập:', error);
            setLoginError(error.response?.data?.error || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3d155f] to-[#120320]">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập Admin</h2>
                {loginError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{loginError}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin; 