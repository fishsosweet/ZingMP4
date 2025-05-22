import Sidebar from '../Admin/SideBar.tsx';
import { useEffect, useState } from "react";
import axiosInstance from "../../../configs/axios.tsx";
import { FaMusic, FaUsers, FaCrown, FaMoneyBillWave, FaClock, FaCalendarAlt } from 'react-icons/fa';

interface ThongTin {
    BaiHat: number;
    TaiKhoan: number;
    TaiKhoanVip: number;
    DoanhThu: number;
}

const AdminPage = () => {
    const [thongTin, setThongTin] = useState<ThongTin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const getThongTin = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/auth/getThongTin');
            if (res.data.success) {
                setThongTin(res.data.data);
            } else {
                setError('Không thể lấy thông tin');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi lấy thông tin');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getThongTin();
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Trang Quản Lý</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                                <FaClock className="mr-2" />
                                <span>{currentTime.toLocaleTimeString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaCalendarAlt className="mr-2" />
                                <span>{currentTime.toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Tổng Số Nhạc</h3>
                                    <p className="text-2xl font-bold mt-2">{thongTin?.BaiHat || 0}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FaMusic className="text-blue-500 text-2xl" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Tổng số bài hát trong hệ thống</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Tổng Số Tài Khoản</h3>
                                    <p className="text-2xl font-bold mt-2">{thongTin?.TaiKhoan || 0}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <FaUsers className="text-green-500 text-2xl" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Tổng số người dùng đã đăng ký</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Số Tài Khoản VIP</h3>
                                    <p className="text-2xl font-bold mt-2">{thongTin?.TaiKhoanVip || 0}</p>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-full">
                                    <FaCrown className="text-yellow-500 text-2xl" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Số lượng tài khoản VIP hiện tại</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Doanh thu</h3>
                                    <p className="text-2xl font-bold mt-2">
                                        {thongTin?.DoanhThu ? new Intl.NumberFormat('vi-VN').format(thongTin.DoanhThu) : 0} VND
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <FaMoneyBillWave className="text-purple-500 text-2xl" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Tổng doanh thu từ gói VIP</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Thống kê nhanh</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tỷ lệ tài khoản VIP</span>
                                    <span className="font-semibold">
                                        {thongTin?.TaiKhoan ?
                                            ((thongTin.TaiKhoanVip / thongTin.TaiKhoan) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Doanh thu trung bình/VIP</span>
                                    <span className="font-semibold">
                                        {thongTin?.TaiKhoanVip && thongTin?.DoanhThu ?
                                            new Intl.NumberFormat('vi-VN').format(thongTin.DoanhThu / thongTin.TaiKhoanVip) : 0} VND
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Hệ thống</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Trạng thái</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Hoạt động</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Thời gian hoạt động</span>
                                    <span className="font-semibold">24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
