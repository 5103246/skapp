import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from './Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
                {courses.map((course) => (
                    <Card key={course.id}>
                        <CardHeader>
                            <CardTitle>{course.course_name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-2">担当教員：{course.professor_name || "不明"}</p>
                            <div className="flex justify-between items-center">
                                <Button
                                    key={course.id}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    詳細を見る
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CourseList;