import React, { useState, useEffect, useCallback, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaGraduationCap, FaUniversity } from "react-icons/fa"
import axiosInstance from "../api/axiosInstance";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import AuthContext from "../auth/AuthContext"
import { useParams } from "react-router-dom";
import Header from './Header';


const CoursePage = () => {
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { course_id } = useParams();
    const [replies, setReplies] = useState([]); // Review IDごとの返信リスト
    const [hasReviewed, setHasReviewed] = useState(false); // reviewがすでにあるか確認 追加
    const { currentUser } = useContext(AuthContext);
    console.log(course);

    // 授業情報を取得
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${course_id}/`);
                console.log(currentUser);
                const userReview = response.data.reviews.find(review => review.author_id === currentUser.id); // 追加
                setHasReviewed(!!userReview) // 投稿済みかを確認
                setCourse(response.data.course);
                setReviews(response.data.reviews); // 授業の感想一覧を取得
                console.log(response.data);
                console.log(response.data.reviews);
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };
        fetchCourse();
    }, [course_id, currentUser]);


    const fetchReplyList = useCallback(async (review_id) => {
        if (!replies[review_id]) {
            try {
                const response = await axiosInstance.get(`/reviews/${review_id}/replies/`)
                setReplies((prev) => ({ ...prev, [review_id]: response.data }));
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching replies:", error);
            }
        }
    }, [replies]);

    const handleReviewSubmit = (newReview) => {
        setReviews((prevReviews) => [...prevReviews, newReview]);
    };

    const handleReplySubmit = (review_id, newReply) => {
        setReplies((prev) => ({
            ...prev,
            [review_id]: [...(prev[review_id] || []), newReply],
        }));
    };

    return (
        <div className="min-h-screen">
            <Header />
            <div className="p-4">
                {course ? (
                    <>
                        <Card className="mb-6">
                            <CardHeader className="bg-blue-500 h-32"></CardHeader>
                            <CardContent className="relative pt-16 pb-4">
                                <div className="absolute -top-16 left-4 w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                                    <FaGraduationCap className="w-16 h-16 text-gray-700" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{course.course_name}</CardTitle>
                                <p className="text-gray-600">教授: {course.professor_name || "不明"}</p>
                                <div className="flex items-center mt-2 text-gray-600">
                                    <FaUniversity className="mr-2" />
                                    <span>{course.department || "不明"}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {!hasReviewed ? (
                            <ReviewForm course_id={course_id} onReviewSubmit={handleReviewSubmit} />
                        ) : (
                            <Card className="mb-4">
                                <CardContent className="flex items-center justify-center">
                                    <p>この授業への感想と評価は既に投稿済みです。</p>
                                </CardContent>
                            </Card>
                        )}
                        <ReviewList reviews={reviews} setReviews={setReviews} replies={replies} setReplies={setReplies} fetchReplyList={fetchReplyList} onReplySubmit={handleReplySubmit} />
                    </>
                ) : (
                    <Card className="mb-4">
                        <CardContent>
                            <p>授業情報を読み込んでいます...</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CoursePage;