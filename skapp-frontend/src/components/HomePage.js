import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    //const departments = ["Science", "Arts", "Engineering", "Law"];
    return (
        <div className="min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <h1 className="bg-indigo-500 text-xl font-bold">大学授業評価アプリ</h1>
                    <nav>
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
                        </ul>
                    </nav>
                </div>
            </header>
            <h1 className="text-2xl font-bold mb-4">機能</h1>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => navigate(`/course/`)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    授業
                </button>
            </div>
        </div>
    );
};
export default HomePage;