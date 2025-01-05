import React from "react";
//import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="bg-indigo-500 text-xl font-bold">大学授業評価アプリ</h1>
                {/* Navigation Links */}
                <nav className="space-x-4">
                    <ul className="flex space-x-4">
                        <li>
                            <a href="/course" className="hover:underline">
                                授業一覧
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard" className="hover:underline">
                                マイページ
                            </a>
                        </li>
                        <li>
                            <a
                                href="/logout"
                                onClick={() => console.log("Logout")}
                                className="hover:underline"
                            >
                                ログアウト
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;