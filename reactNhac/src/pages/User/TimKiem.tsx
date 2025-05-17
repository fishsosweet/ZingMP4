import { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaCog } from "react-icons/fa";
import axiosInstance from "../../../configs/axios.tsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [suggestions, setSuggestions] = useState([]);

    // Clear search when navigating to home page
    useEffect(() => {
        if (location.pathname === "/zingmp4") {
            setQuery("");
            setSuggestions([]);
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim() === "") {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axiosInstance.get(`/user/search?query=${encodeURIComponent(query)}`);
                setSuggestions(res.data);
            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/zingmp4/tim-kiem?query=${encodeURIComponent(query)}`);
            setSuggestions([]);
        }
    };

    return (
        <div className="relative flex items-center justify-between px-4 py-2 bg-[#1a152b] h-[65px] backdrop-blur-md">
            <div className="flex-1 mx-4 relative">
                <div className="flex items-center bg-[#2f2739] rounded-full px-4 ">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Tìm kiếm bài hát..."
                        className="w-full px-4 py-2 rounded-full text-white focus:outline-none "
                    />
                </div>

                {suggestions.length > 0 && (
                    <div
                        className="absolute z-10 w-full mt-1 bg-[#2f2739] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="px-4 py-2 hover:bg-[#3b2f4a] text-white cursor-pointer text-sm"
                                onClick={() => {
                                    navigate(`/zingmp4/tim-kiem?query=${encodeURIComponent(item.title)}`);
                                    setQuery(item.title);
                                    setSuggestions([]);
                                }}

                            >
                                {item.title} {item.casi?.ten_casi && `- ${item.casi.ten_casi}`}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Nâng cấp tài khoản
                </button>
                <button className="flex items-center bg-[#2f2739] hover:bg-[#3b2f4a] text-purple-400 text-sm font-semibold px-4 py-2 rounded-full">
                    <FaDownload className="mr-2" />
                    Tải bản Windows
                </button>
                <button className="bg-[#2f2739] p-2 rounded-full">
                    <FaCog className="text-white" />
                </button>
                <img
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    src="/path-to-avatar.jpg"
                />
            </div>
        </div>
    );
}
