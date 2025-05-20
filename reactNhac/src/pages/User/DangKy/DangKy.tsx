import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../configs/axios.tsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        image: null as File | null
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        image: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone: '',
            image: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'Vui lòng nhập lại mật khẩu';
            isValid = false;
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Mật khẩu không khớp';
            isValid = false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        if (!formData.image) {
            newErrors.image = 'Vui lòng chọn ảnh đại diện';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const checkEmailResponse = await axiosInstance.post('/user/check-email', {
                email: formData.email
            });

            if (checkEmailResponse.data) {
                setErrors(prev => ({
                    ...prev,
                    email: 'Email này đã được sử dụng'
                }));
                setIsLoading(false);
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('password_confirmation', formData.password_confirmation);
            formDataToSend.append('phone', formData.phone);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axiosInstance.post('/user/registerUser', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login-user');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                setErrors(prev => ({
                    ...prev,
                    ...serverErrors
                }));
            } else {
                alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3d155f] to-[#120320]">
            <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng ký tài khoản</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập họ và tên"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập lại mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Ảnh đại diện
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <label
                                htmlFor="image"
                                className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                            >
                                Chọn ảnh
                            </label>
                        </div>
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Link to="/login-user" className="text-sm text-purple-600 hover:text-purple-800">
                            Đã có tài khoản? Đăng nhập
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'
                                }`}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
