import { useState } from 'react';
import { FaHome, FaStar, FaUsers, FaSignOutAlt,FaMusic,FaMicrophone } from 'react-icons/fa';
import {MdOutlineWorkspacePremium, MdQueueMusic} from 'react-icons/md';
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {logout} from '../../services/AuthServices'
const SideBar = () => {
    const [isCategoriesOpen, setCategoriesOpen] = useState(false);
    const [isSliderOpen, setSliderOpen] = useState(false);
    const [isSingerOpen, setSingerOpen] = useState(false);
    const [isUsersOpen, setUsersOpen] = useState(false);
    const [isPlaylistOpen, setPlaylistOpen] = useState(false);
    const [isVipOpen, setVipOpen] = useState(false);
    const navigate=useNavigate();
    const logOut=()=>{
        logout();
        navigate('/login-admin');
    }
    const closeAll = () => {
        setCategoriesOpen(false);
        setSingerOpen(false);
        setSliderOpen(false);
        setUsersOpen(false);
        setVipOpen(false);
        setPlaylistOpen(false);
    };

    return (
        <div className="w-86 min-h-screen bg-gray-800 text-white p-4">
            <h2 className="text-center text-3xl font-bold py-4">Admin</h2>
            <ul className="space-y-5">
                <li>
                    <div className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
                        <FaHome/>
                        <Link to="/admin" className="block p-2 rounded"><span>Trang chính</span></Link>
                    </div>
                </li>
                <li>
                    <button
                        onClick={() => {
                            const next = !isCategoriesOpen;
                            closeAll();
                            setCategoriesOpen(next);
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <FaStar/>
                        <span>Thể loại</span>
                    </button>
                    {isCategoriesOpen && (
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg mt-1 pl-4 py-2">
                            <ul className="space-y-1 pr-3">
                                <li><Link to="/admin/add-categories" className="block p-2 hover:bg-gray-600 rounded">Thêm
                                    thể loại</Link></li>
                                <li><Link to="/admin/list-categories" className="block p-2 hover:bg-gray-600 rounded">Danh
                                    sách các thể loại</Link></li>
                            </ul>
                        </div>
                    )}

                </li>
                <li>
                    <button
                        onClick={() => {
                            const next = !isSingerOpen;
                            closeAll();
                            setSingerOpen(next);
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <FaMicrophone/>
                        <span>Ca sĩ</span>
                    </button>
                    {isSingerOpen && (
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg mt-1 pl-4 py-2">
                            <ul className="space-y-1 pr-3">
                                <li><Link to="/admin/add-singers" className="block p-2 hover:bg-gray-600 rounded">Thêm
                                    ca sĩ</Link></li>
                                <li><Link to="/admin/list-singers" className="block p-2 hover:bg-gray-600 rounded">Danh
                                    sách các ca sĩ </Link></li>
                            </ul>
                        </div>
                    )}
                </li>
                <li>
                    <button
                        onClick={() => {
                            const next = !isSliderOpen;
                            closeAll();
                            setSliderOpen(next);
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <FaMusic/>
                        <span>Bài hát</span>
                    </button>
                    {isSliderOpen && (
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg mt-1 pl-4 py-2">
                            <ul className="space-y-1 pr-3">
                                <li><Link to="/admin/add-songs" className="block p-2 hover:bg-gray-600 rounded">Thêm bài
                                    hát</Link></li>
                                <li><Link to="/admin/list-songs" className="block p-2 hover:bg-gray-600 rounded">Danh
                                    sách bài hát</Link>
                                </li>
                            </ul>
                        </div>
                    )}

                </li>
                <li>
                    <button
                        onClick={() => {
                            const next = !isPlaylistOpen;
                            closeAll();
                            setPlaylistOpen(next);
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <MdQueueMusic/>
                        <span>Playlist</span>
                    </button>
                    {isPlaylistOpen && (
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg mt-1 pl-4 py-2">
                            <ul className="space-y-1 pr-3">
                                <li><Link to="/admin/add-playlists" className="block p-2 hover:bg-gray-600 rounded">Thêm
                                    Playlist</Link></li>
                                <li><Link to="/admin/list-playlists" className="block p-2 hover:bg-gray-600 rounded">Danh
                                    sách các Playlist</Link></li>
                            </ul>
                        </div>
                    )}

                </li>
                <li>
                    <button
                        onClick={() => {
                            const next = !isUsersOpen;
                            closeAll();
                            setUsersOpen(next);
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <FaUsers/>
                        <span>Quản lý người dùng</span>
                    </button>
                    {isUsersOpen && (
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg mt-1 pl-4 py-2">
                            <ul className="space-y-1 pr-3">
                                <li><a href="#" className="block p-2 hover:bg-gray-600 rounded">Danh sách accounts</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
                <li>
                    <button
                        onClick={() => {
                            const next = !isVipOpen;
                            closeAll();
                            setVipOpen(next);
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <MdOutlineWorkspacePremium/>
                        <span>Gói VIP</span>
                    </button>
                    {isVipOpen && (
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg mt-1 pl-4 py-2">
                            <ul className="space-y-1 pr-3">
                                <li><a href="#" className="block p-2 hover:bg-gray-600 rounded">Danh sách gói VIP</a>
                                </li>
                                <li><a href="#" className="block p-2 hover:bg-gray-600 rounded">Thêm gói VIP</a></li>
                            </ul>
                        </div>
                    )}
                </li>
                <li>
                    <button
                        onClick={() => {
                            logOut();
                        }}
                        className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded"
                    >
                        <FaSignOutAlt/>
                        <span>Đăng xuất</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
