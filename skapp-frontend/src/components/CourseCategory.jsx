import React from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';

const CourseCategory = () => {
    const navigate = useNavigate();
    const departments = ["science", "Arts", "Engineering", "law", "informatics"];
      return (
          <div className="min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <Header/>
            <h1 className="text-2xl font-bold mb-4">学部選択</h1>
              <div className="grid grid-cols-2 gap-4">
                  {departments.map((department) => (
                      <button
                          key={department}
                          onClick={() => navigate(`/course/department/${department}`)}
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                          {department}
                      </button>
                  ))}
              </div>
          </div>
      );
  };
  export default CourseCategory;