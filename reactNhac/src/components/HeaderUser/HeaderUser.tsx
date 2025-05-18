// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../configs/axios';
//
// const HeaderUser = () => {
//     const navigate = useNavigate();
//
//     const handleLogout = () => {
//         localStorage.removeItem('user_token');
//         localStorage.removeItem('user_info');
//         delete axiosInstance.defaults.headers.common['Authorization'];
//         navigate('/login-user');
//     };
//
//     // Lấy thông tin user từ localStorage và parse JSON
//     const userInfo = localStorage.getItem('user_info');
//     const user = userInfo ? JSON.parse(userInfo) : null;
//
//     // Kiểm tra nếu không có thông tin user
//     if (!user) {
//         return null;
//     }
//
//     return (
//         <div className="header-user">
//             <div className="user-info">
//                 <img
//                     src={user.image || 'https://via.placeholder.com/40'}
//                     alt="User avatar"
//                     className="user-avatar"
//                 />
//                 <span className="user-name">{user.name || 'User'}</span>
//             </div>
//             <button onClick={handleLogout} className="logout-button">
//                 Đăng xuất
//             </button>
//         </div>
//     );
// };
//
// export default HeaderUser;
