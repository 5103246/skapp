import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FaStar } from "react-icons/fa"

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
        return (
            <RadioGroup
                value={rating.toString()}
                onValueChange={(value) => setRating(Number(value))}
                className="flex gap-2"
            >
                {Array.from({ length: 5 }, (_, index) => (
                    <Label key={index} htmlFor={`star-${index + 1}`} className="cursor-pointer">
                        <RadioGroupItem
                            id={`star-${index + 1}`}
                            value={(index + 1).toString()}
                            className="hidden" // 視覚的には隠す
                            required
                        />
                        <FaStar
                            className={`w-6 h-6 ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                        />
                    </Label>
                ))}
            </RadioGroup>
        );
    };

    return (
        <section className="container mx-auto my-6">
            <div className="bg-gray-100 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Submit Your Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <Textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="感想を入力してください..."
                        required
                    />
                    <div className="mt-2">
                        <Label className="mb-2 block">評価</Label>
                        {renderStars()}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        投稿
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default ReviewForm;