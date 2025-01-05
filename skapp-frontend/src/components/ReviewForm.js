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
        <section className="container mx-auto my-6">
            <div className="bg-gray-100 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Submit Your Review</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300"
                        placeholder="感想を入力してください..."
                    />
                    <div className="mt-2">{renderStars()}</div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 rounded-md hover:bg-blue-700"
                    >
                        投稿
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ReviewForm;