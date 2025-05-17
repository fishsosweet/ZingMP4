
import Sidebar from '../Admin/SideBar.tsx';

const AdminPage = () => {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Trang Quản Lý</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Tổng Số Phim</h3>
                        <p className="text-2xl font-bold mt-2">11</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Tổng Số Tài Khoản</h3>
                        <p className="text-2xl font-bold mt-2">2</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Số Tài Khoản VIP</h3>
                        <p className="text-2xl font-bold mt-2">2</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Doanh thu</h3>
                        <p className="text-2xl font-bold mt-2">579.000 VND</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
