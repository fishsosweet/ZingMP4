import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PrivateRoute, PrivateRouteUser } from '../src/services/PrivateRoute.tsx';
import TheLoai from '../src/pages/Admin/TheLoai/Them.tsx'
import CaSi from '../src/pages/Admin/CaSi/Them.tsx'
import BaiHat from "./pages/Admin/Nhac/Them.tsx";
import SuaCaSi from '../src/pages/Admin/CaSi/Sua.tsx'
import ListCaSi from '../src/pages/Admin/CaSi/List.tsx'
import ListBaiHat from "./pages/Admin/Nhac/List.tsx";
import SuaBaiHat from "./pages/Admin/Nhac/Sua.tsx";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ListTheLoai from "./pages/Admin/TheLoai/List.tsx";
import LoginPage from "./pages/Admin/LoginPage.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import SuaTheLoai from "./pages/Admin/TheLoai/Sua.tsx";
import UserLayout from "./pages/User/Layout.tsx";
import HomeUser from "./pages/User/KhamPha/UserPage.tsx";
import ZingChat from "./pages/User/ZingChat/ZingChat.tsx";
import { MusicProvider } from './contexts/MusicContext';
import { LikedSongsProvider } from './contexts/LikedSongsContext';
import Playlist from "./pages/Admin/Playlist/Them.tsx";
import ListPlaylist from "./pages/Admin/Playlist/List.tsx";
import SuaPlaylist from "./pages/Admin/Playlist/Sua.tsx";
import NhacMoi from "./pages/User/NhacMoi/NhacMoi.tsx";
import ChuDe from "./pages/User/ChuDe/ChuDe.tsx";
import TimKiem from "./pages/User/KetQuaTimKiem.tsx";
import ThongTinBaiHat from "./pages/User/ThongTinBaiHat.tsx";
import ThongTinCaSi from "./pages/User/ThongTinCaSi.tsx";
import DangNhap from "./pages/User/DangNhap/DangNhap.tsx";
import ThuVien from "./pages/User/ThuVien/ThuVien.tsx";
import DangKy from "./pages/User/DangKy/DangKy.tsx";
import NangCap from "./pages/User/NangCap/NangCap.tsx";
import GoiVip from "./pages/User/NangCap/GoiVIP.tsx";

const router = createBrowserRouter([
    {
        path: "/login-admin",
        element: <LoginPage />,
    },
    {
        path: "/login-user",
        element: <DangNhap />,
    },
    {
        path: "/register-user",
        element: <DangKy />,
    },
    {
        path: "/zingmp4/nang-cap",
        element: <PrivateRouteUser>
            <NangCap />
        </PrivateRouteUser>

    },
    {
        path: "/zingmp4/nang-cap/goi-vip",
        element: <PrivateRouteUser>
            <GoiVip />
        </PrivateRouteUser>
    },
    {
        path: "/zingmp4",
        element: <UserLayout />,
        children: [
            {
                path: "thu-vien",
                element: <PrivateRouteUser>
                    <ThuVien />
                </PrivateRouteUser>
            },
            {
                path: "",
                element: <HomeUser />
            },
            {
                path: "zing-chart",
                element: <ZingChat />
            },
            {
                path: "new-songs",
                element: <NhacMoi />
            },
            {
                path: "genre",
                element: <ChuDe />
            },
            {
                path: "tim-kiem",
                element: <TimKiem />
            },
            {
                path: "thong-tin/:id",
                element: <ThongTinBaiHat />
            },
            {
                path: "thong-tin-ca-si/:id",
                element: <ThongTinCaSi />
            },
        ]
    },
    {
        path: "/admin",
        element: <PrivateRoute>
            <AdminPage />
        </PrivateRoute>
    },
    {
        path: "/admin/add-categories",
        element: <PrivateRoute>
            <TheLoai />
        </PrivateRoute>
    },
    {
        path: "/admin/add-singers",
        element: <PrivateRoute>
            <CaSi />
        </PrivateRoute>
    },
    {
        path: "/admin/add-songs",
        element: <PrivateRoute>
            <BaiHat />
        </PrivateRoute>
    },
    {
        path: "/admin/add-playlists",
        element: <PrivateRoute>
            <Playlist />
        </PrivateRoute>
    },
    {
        path: "/admin/list-categories",
        element: <PrivateRoute>
            <ListTheLoai />
        </PrivateRoute>
    },
    {
        path: "/admin/list-singers",
        element: <PrivateRoute>
            <ListCaSi />
        </PrivateRoute>
    },
    {
        path: "/admin/list-songs",
        element: <PrivateRoute>
            <ListBaiHat />
        </PrivateRoute>
    },
    {
        path: "/admin/list-playlists",
        element: <PrivateRoute>
            <ListPlaylist />
        </PrivateRoute>
    },
    {
        path: "/admin/categories/edit/:id",
        element: <PrivateRoute>
            <SuaTheLoai />
        </PrivateRoute>
    },
    {
        path: "/admin/singers/edit/:id",
        element: <PrivateRoute>
            <SuaCaSi />
        </PrivateRoute>
    },
    {
        path: "/admin/songs/edit/:id",
        element: <PrivateRoute>
            <SuaBaiHat />
        </PrivateRoute>
    },
    {
        path: "/admin/playlists/edit/:id",
        element: <PrivateRoute>
            <SuaPlaylist />
        </PrivateRoute>
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LikedSongsProvider>
            <MusicProvider>
                <RouterProvider router={router} />
            </MusicProvider>
        </LikedSongsProvider>
    </StrictMode>,
)
