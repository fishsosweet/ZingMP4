// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../../configs/axios.tsx';
//
// const HeaderAdmin = () => {
//     const [admin, setAdmin] = useState<any>(null);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const getAdminInfo = async () => {
//             try {
//                 const res = await axiosInstance.get('/admin/getThongTinAdmin');
//                 if (res.data) {
//                     setAdmin(res.data);
//                 }
//             } catch (error) {
//                 console.error('Lỗi khi lấy thông tin admin:', error);
//             }
//         };
//
//         getAdminInfo();
//     }, []);
//
//     const handleLogout = () => {
//         localStorage.removeItem('admin_token');
//         localStorage.removeItem('admin_info');
//         navigate('/login-admin');
//     };
//
//     return (
//         <div className="bg-white shadow-md">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center py-4">
//                     <div className="flex items-center">
//                         <Link to="/admin" className="text-xl font-bold text-gray-800">
//                             Admin Dashboard
//                         </Link>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         {admin ? (
//                             <div className="flex items-center space-x-2">
//                                 <img
//                                     src={admin.image ? `http://127.0.0.1:8000/${admin.image}` : 'https://via.placeholder.com/40'}
//                                     alt="Admin"
//                                     className="w-8 h-8 rounded-full object-cover"
//                                 />
//                                 <span className="text-gray-700">{admin.name}</span>
//                                 <button
//                                     onClick={handleLogout}
//                                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                                 >
//                                     Đăng xuất
//                                 </button>
//                             </div>
//                         ) : (
//                             <Link
//                                 to="/login-admin"
//                                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             >
//                                 Đăng nhập
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default HeaderAdmin;
