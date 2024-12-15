import React from "react";

const HomePage = () => {
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
        </div>
    );
};
export default HomePage;