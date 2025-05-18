import { useForm, SubmitHandler } from "react-hook-form";
import { loginAdmin } from "/laragon/www/laravelReactNhac2/reactNhac/src/services/AuthServices";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../configs/axios.tsx";
import { useState } from "react";

type Inputs = {
    email: string,
    password: string,
};


const LoginPage = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate(); //Chuyen trang
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const login: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await loginAdmin(data);
            if (res && res.access_token) {
                localStorage.setItem("admin_token", res.access_token);
                const expiresIn = res.expires_in * 1000;
                const expirationTime = new Date().getTime() + expiresIn;
                localStorage.setItem("admin_token_expiry", expirationTime.toString());
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.access_token}`;
                navigate("/admin", { replace: true });
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setLoginError("Tài khoản hoặc mật khẩu không đúng");
            } else if (error.response && error.response.status === 403) {
                setLoginError(error.response.data.error || "Tài khoản không có quyền truy cập vào trang admin");
            } else {
                setLoginError("Có lỗi xảy ra, vui lòng thử lại sau");
            }
        }
    };
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-2/5 max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-amber-950">
                    Đăng nhập hệ thống
                </h2>
                {loginError && (
                    <div className="text-red-700 text-base relative bottom-2.5 flex justify-center items-center">
                        {loginError}
                    </div>
                )}
                <form onSubmit={handleSubmit(login)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Nhập email của bạn"
                            className="w-full px-4 py-2 bg-blue-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("email", {
                                required: 'Vui lòng nhập Email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Email không hợp lệ"
                                }
                            })}
                        />
                        {errors.email && <span className="text-red-700 text-base">{errors.email.message}</span>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            className="w-full px-4 py-2 bg-blue-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("password", { required: true })}
                        />
                        {errors.password && <span className="text-red-700 text-base">Vui lòng nhập mật khẩu</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
