import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaList } from "react-icons/fa"
import { Button } from "@/components/ui/button"

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link to="/home" className="text-xl font-bold text-blue-600">
                            大学授業評価アプリ
                        </Link>
                    </div>
                    <div className="md:flex items-center justify-end md:flex-1 lg:w-0">
                        <Link to="/course" className="text-gray-500 hover:text-gray-700 mr-4">
                            <FaList className="inline-block mr-1" />
                            授業一覧
                        </Link>
                        <Link to="/mypage" className="text-gray-500 hover:text-gray-700 mr-4">
                            <FaUser className="inline-block mr-1" />
                            マイページ
                        </Link>
                        <Button onClick={handleLogout} variant="ghost" className="text-gray-500 hover:text-gray-700">
                            <FaSignOutAlt className="inline-block mr-1" />
                            ログアウト
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;