import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get("/courses/");
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
        <div>
          <h1>授業一覧</h1>
          <ul>
            {courses.map((course) => (
              <li key={course.id}>
                <h3>{course.course_name}</h3>
                <p>教授: {course.professor_name || "不明"}</p>
                <p>学科: {course.department || "不明"}</p>
              </li>
            ))}
          </ul>
        </div>
      );
};

export default CourseList;