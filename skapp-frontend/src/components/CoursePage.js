import React, { useState, useEffect, useCallback, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import AuthContext from "../auth/AuthContext"
import { useParams } from "react-router-dom";


const CoursePage = () => {
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { course_id } = useParams();
    const [replies, setReplies] = useState([]); // Review IDごとの返信リスト
    const [hasReviewed, setHasReviewed] = useState(false); // reviewがすでにあるか確認 追加
    const { currentUser } = useContext(AuthContext);

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
        <div className="p-4">
            {course ? (
                <>
                    <h1 className="text-2xl font-bold">{course.course_name}</h1>
                    <p>教授: {course.professor_name || "不明"}</p>
                    <p>学科: {course.department || "不明"}</p>

                    {!hasReviewed ? (
                        <ReviewForm course_id={course_id} onReviewSubmit={handleReviewSubmit} />
                    ) : (
                        <p>この授業への感想と評価は既に投稿済みです。</p>
                    )}
                    <ReviewList reviews={reviews} replies={replies} fetchReplyList={fetchReplyList} onReplySubmit={handleReplySubmit} />
                </>
            ) : (
                <p>授業情報を読み込んでいます...</p>
            )}
        </div>
    );
};

export default CoursePage;