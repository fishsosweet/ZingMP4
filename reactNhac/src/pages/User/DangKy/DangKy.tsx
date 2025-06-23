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
        image: '',
        otp: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone: '',
            image: '',
            otp: ''
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
        } else if (name === 'otp') {
            setOtp(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const showNotificationModal = (message: string, type: 'success' | 'error') => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
    };

    const handleSendOtp = async () => {
        try {
            const response = await axiosInstance.post('/user/send-otp', {
                email: formData.email
            });
            if (response.data) {
                setOtpSent(true);
                startCountdown();
                showNotificationModal('Mã OTP đã được gửi đến email của bạn!', 'success');
            }
        } catch (error) {
            showNotificationModal('Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại sau.', 'error');
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

            await handleSendOtp();
            setShowOtpModal(true);
            setIsLoading(false);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                setErrors(prev => ({
                    ...prev,
                    ...serverErrors
                }));
            } else {
                showNotificationModal('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.', 'error');
            }
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setErrors(prev => ({
                ...prev,
                otp: 'Mã OTP phải có đúng 6 ký tự'
            }));
            return;
        }

        setIsLoading(true);
        try {
            const verifyResponse = await axiosInstance.post('/user/verify-otp', {
                email: formData.email,
                otp: otp
            });

            if (verifyResponse.data) {
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('password', formData.password);
                formDataToSend.append('password_confirmation', formData.password_confirmation);
                formDataToSend.append('phone', formData.phone);
                if (formData.image) {
                    formDataToSend.append('image', formData.image);
                }

                const registerResponse = await axiosInstance.post('/user/registerUser', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (registerResponse.data) {
                    showNotificationModal('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
                    setTimeout(() => {
                        navigate('/login-user');
                    }, 2000);
                }
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                const errorMessage = error.response.data.message;
                let translatedMessage = errorMessage;

                switch (errorMessage) {
                    case 'OTP has expired. Please request a new one.':
                        translatedMessage = 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.';
                        break;
                    case 'Invalid OTP. Please try again.':
                        translatedMessage = 'Mã OTP không đúng. Vui lòng thử lại.';
                        break;
                    case 'The otp field must be 6 characters.':
                        translatedMessage = 'Mã OTP phải có đúng 6 ký tự.';
                        break;
                    default:
                        translatedMessage = 'Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại sau.';
                }

                setErrors(prev => ({
                    ...prev,
                    otp: translatedMessage
                }));
            } else {
                showNotificationModal('Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại sau.', 'error');
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
                            className={`bg-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'}`}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>

                {/* Modal xác nhận OTP */}
                {showOtpModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Xác nhận Email</h3>
                            <p className="text-gray-600 mb-4">
                                Vui lòng nhập mã OTP đã được gửi đến email {formData.email}
                            </p>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={handleChange}
                                    maxLength={6}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nhập mã OTP (6 ký tự)"
                                />
                                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={countdown > 0}
                                    className={`text-purple-600 hover:text-purple-800 ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã OTP'}
                                </button>
                                <div className="space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowOtpModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={isLoading}
                                        className={`px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showNotification && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                            <div className={`text-center ${notificationType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                <h3 className="text-xl font-bold mb-4">
                                    {notificationType === 'success' ? 'Thành công!' : 'Lỗi!'}
                                </h3>
                                <p className="text-gray-700 mb-6">{notificationMessage}</p>
                                <button
                                    onClick={() => setShowNotification(false)}
                                    className={`px-4 py-2 rounded-md text-white ${notificationType === 'success'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
