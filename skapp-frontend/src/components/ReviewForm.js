import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ReviewForm = ({ course_id, onReviewSubmit }) => {
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.trim() || rating === 0) return;

        try {
            const response = await axiosInstance.post(`/courses/${course_id}/reviews/`, {
                review_text: newReview,
                rating: rating,
            });
            console.log(response.data);
            /*
            setReviews((prevReviews) => [...prevReviews, response.data]);
            */
            onReviewSubmit(response.data);
            setNewReview(""); // フォームをリセット
            setRating(0);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                onClick={() => setRating(index + 1)}
                className={`text-2xl ${index < rating ? "text-yellow-500" : "text-gray-300"
                    }`}
            >
                ★
            </button>
        ));
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
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
    );
};

export default ReviewForm;