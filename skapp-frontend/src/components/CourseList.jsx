import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from './Header';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const { isAuthenticated } = useAuth();
    const { department_name } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(`/courses/department/${department_name}/`);
                setCourses(response.data.result);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                //setCourses([]);
            }
        };

        if (isAuthenticated) {
            fetchCourses();
        }
    }, [isAuthenticated, department_name]);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">{department_name} の授業</h1>
                <ul>
                    {courses.map((course) => (
                        <li key={course.id} className="mb-4 border p-2 rounded">
                            <button
                                key={course.id}
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                <h3 className="text-xl font-semibold">{course.course_name}</h3>
                                <p>教授: {course.professor_name || "不明"}</p>
                                <p>学科: {course.department || "不明"}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseList;