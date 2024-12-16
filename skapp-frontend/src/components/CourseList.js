import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const { isAuthenticated } = useAuth();
    const { department_name } = useParams();

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
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">{department_name} の授業</h1>
          <ul>
            {courses.map((course) => (
              <li key={course.id} className="mb-4 border p-2 rounded">
                <h3 className="text-xl font-semibold">{course.course_name}</h3>
                <p>教授: {course.professor_name || "不明"}</p>
                <p>学科: {course.department || "不明"}</p>
              </li>
            ))}
          </ul>
        </div>
      );
};

export default CourseList;