import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../../configs/axios.tsx";
import { useState } from "react";

type Inputs = {
    email: string,
    password: string,
};

const Login = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoginError(null);
        try {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_info');

            const response = await axiosInstance.post('/user/login', data);
            if (response.data.access_token) {
                localStorage.setItem('user_token', response.data.access_token);

                try {
                    const userInfo = await axiosInstance.get('/user/getThongTinUser');
                    if (userInfo.data) {
                        const userData = {
                            id: userInfo.data.id,
                            name: userInfo.data.name,
                            email: userInfo.data.email,
                            level: userInfo.data.level,
                            image: userInfo.data.image || null
                        };
                        localStorage.setItem('user_info', JSON.stringify(userData));
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin user:', error);
                    localStorage.removeItem('user_token');
                    localStorage.removeItem('user_info');
                    setLoginError('Không thể lấy thông tin người dùng');
                    return;
                }

                navigate('/zingmp4', { replace: true });
            }
        } catch (error: any) {
            console.error('Lỗi đăng nhập:', error);
            if (error.response?.status === 401) {
                setLoginError('Email hoặc mật khẩu không đúng');
            } else if (error.response?.status === 403) {
                setLoginError('Tài khoản không có quyền truy cập');
            } else {
                setLoginError(error.response?.data?.error || 'Đăng nhập thất bại, vui lòng thử lại sau');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3d155f] to-[#120320]">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập</h2>
                {loginError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{loginError}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            {...register("email", {
                                required: 'Vui lòng nhập Email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Email không hợp lệ"
                                }
                            })}
                        />
                        {errors.email && <span className="text-red-700 text-sm">{errors.email.message}</span>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            {...register("password", {
                                required: 'Vui lòng nhập mật khẩu',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                }
                            })}
                        />
                        {errors.password && <span className="text-red-700 text-sm">{errors.password.message}</span>}
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

export default Login;
