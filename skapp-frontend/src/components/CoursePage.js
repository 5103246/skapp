import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import { MdOutlineReply } from "react-icons/md/index.js";

const CoursePage = (/*{ course_id }*/) => {
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [selectedReviewId, setSelectedReviewId] = useState(null); // 返信対象のReview ID
    const [replies, setReplies] = useState({}); // Review IDごとの返信リスト
    const [newReply, setNewReply] = useState(""); // 新しい返信内容
    const { course_id } = useParams();
  
    // 授業情報を取得
    useEffect(() => {
      const fetchCourseDetails = async () => {
        try {
          const response = await axiosInstance.get(`/courses/${course_id}/`);
          setCourse(response.data.course);
          setReviews(response.data.reviews); // 授業の感想一覧を取得
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching course details:", error);
        }
      };
      fetchCourseDetails();
    }, [course_id]);

    // 返信を取得
    const fetchReplies = async (review_id) => {
        try {
            const response = await axiosInstance.get(`/reviews/{review_id}/replies/`)
            setReplies((prev) => ({ ...prev, [review_id]: response.data }));
        } catch (error) {
            console.error("Error fetching replies:", error);
        }
    };

    // 感想を投稿
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || rating === 0) return;

    try {
      const response = await axiosInstance.post(`/courses/${course_id}/reviews/`, {
        review_text: newReview,
        rating: rating,
      });
      setReviews((prevReviews) => [response.data, ...prevReviews]);
      setNewReview(""); // フォームをリセット
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // 返信投稿
  const handleReplySubmit = async (review_id) => {
    if (!newReply.trim()) return;

    try {
      const response = await axiosInstance.post(`/reviews/${review_id}/replies/`, {
        reply_text: newReply,
      });
      setReplies((prev) => ({
        ...prev,
        [review_id]: [response.data, ...(prev[review_id] || [])],
      }));
      setNewReply("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  // 星評価を表示
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => setRating(index + 1)}
        className={`text-2xl ${
          index < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="p-4">
      {course ? (
        <>
          <h1 className="text-2xl font-bold">{course.course_name}</h1>
          <p>教授: {course.professor_name || "不明"}</p>
          <p>学科: {course.department || "不明"}</p>

          <div className="mt-4">
            <h2 className="text-xl font-semibold">感想と評価一覧</h2>
            <ul className="mt-2">
              {reviews.map((review) => (
                <li key={review.id} className="border p-2 mb-2 rounded">
                  <p>{review.review_text}</p>
                  <div className="flex items-center">
                    <span className="mr-2">評価:</span>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={`text-lg ${
                          index < review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <small>投稿者: {review.author || "匿名"}</small>
                  <button
                    onClick={() => {
                      if (selectedReviewId === review.id) {
                        setSelectedReviewId(null); // 返信セクション非表示
                      } else {
                        setSelectedReviewId(review.id); // 返信セクション表示
                        fetchReplies(review.id);
                      }
                    }}
                    className="text-blue-500 text-sm flex items-center mt-2"
                  >
                    <MdOutlineReply className="mr-1" />
                    返信
                  </button>

                  {selectedReviewId === review.id && (
                    <div className="ml-4 mt-2">
                      <ul className="mb-2">
                        {(replies[review.id] || []).map((reply) => (
                          <li key={reply.id} className="border-b p-2">
                            <p>{reply.content}</p>
                            <small>投稿者: {reply.author || "匿名"}</small>
                          </li>
                        ))}
                      </ul>
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="返信を入力してください..."
                      />
                      <button
                        onClick={() => handleReplySubmit(review.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                      >
                        投稿
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleReviewSubmit} className="mt-4">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="感想を入力してください..."
            />
            <div className="mt-2">{renderStars()}</div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              投稿
            </button>
          </form>
        </>
      ) : (
        <p>授業情報を読み込んでいます...</p>
      )}
    </div>
  );
};

export default CoursePage;