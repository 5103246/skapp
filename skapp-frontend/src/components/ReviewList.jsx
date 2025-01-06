import React, { useState } from 'react';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FaStar, FaReply, FaEdit, FaTrash } from "react-icons/fa"
import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
import axiosInstance from '../api/axiosInstance';



const ReviewList = ({ reviews, setReviews, replies, setReplies, fetchReplyList, onReplySubmit }) => {
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedReview, setEditedReview] = useState("");
    const [editedRating, setEditedRating] = useState(0);

    const fetchReplies = (review_id) => {
        console.log(`Fetching replies for review ID: ${review_id}`);
        // 必要に応じて実際のリプライデータを取得するロジックを追加
    };

    {/* 返信セクションの表示/非表示切り替えボタン */ }
    const onReply = (review) => {
        if (selectedReviewId === review.id) {
            setSelectedReviewId(null); // 返信セクション非表示
        } else {
            setSelectedReviewId(review.id); // 返信セクション表示
            fetchReplies(review.id);
        }
    }

    // 編集開始
    const startEditing = (review) => {
        setEditingReviewId(review.id);
        setEditedReview(review.review_text);
        setEditedRating(review.rating);
    };

    // 編集キャンセル
    const cancelEditing = () => {
        setEditingReviewId(null);
        setEditedReview("");
        setEditedRating(0);
    };

    // 編集送信
    const handleEditSubmit = async (review_id) => {
        try {
            const response = await axiosInstance.patch(`/reviews/${review_id}/`, {
                review_text: editedReview,
                rating: editedRating,
            });
            console.log(response.data);
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id === review_id ? { ...review, ...response.data } : review
                )
            );
            setEditingReviewId(null);
        } catch (error) {
            console.error("Error editing review:", error);
        }
    };
    // 星評価
    const renderStars = () => {
        return (
            <RadioGroup
                value={editedRating.toString()}
                onValueChange={(value) => setEditedRating(Number(value))}
                className="flex gap-2"
            >
                {Array.from({ length: 5 }, (_, index) => (
                    <Label key={index} htmlFor={`star-${index + 1}`} className="cursor-pointer">
                        <RadioGroupItem
                            id={`star-${index + 1}`}
                            value={(index + 1).toString()}
                            className="hidden" // 視覚的には隠す
                        />
                        <FaStar
                            className={`w-6 h-6 ${index < editedRating ? "text-yellow-500" : "text-gray-300"}`}
                        />
                    </Label>
                ))}
            </RadioGroup>
        );
    };

    // 削除処理 
    const handleDelete = async (review_id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await axiosInstance.delete(`/reviews/${review_id}/`);
                setReviews((prevReviews) =>
                    prevReviews.filter((review) => review.id !== review_id)
                );
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        }
    };

    return (
        <section className="container mx-auto my-6">
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">感想と評価一覧</h2>
                {reviews.map((review) => (
                    <Card key={review.id} className="hover:bg-gray-50 transition duration-200">
                        <CardContent className="p-4">
                            {/* 感想と評価の編集 */}
                            {editingReviewId === review.id ? (
                                <div>
                                    <textarea
                                        value={editedReview}
                                        onChange={(e) => setEditedReview(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <div className="mt-2">{renderStars()}</div>
                                    <Button variant="ghost" size="sm" onClick={() => handleEditSubmit(review.id)}>
                                        <MdOutlineSaveAlt className="mr-2" /> Save
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={cancelEditing}>
                                        <MdOutlineCancel className="mr-2" /> Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-600 font-bold">学</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold">{review.author_name}</span>
                                            <span className="text-gray-500 text-sm">・</span>
                                            <span className="text-gray-500 text-sm">{review.created_at}</span>
                                        </div>
                                        <p className="mt-1">{review.review_text}</p>
                                        <div className="flex items-center mt-2 space-x-1">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={`text-lg ${index < review.rating
                                                        ? "text-yellow-500"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <Button variant="ghost" size="sm" onClick={() => onReply(review)}>
                                                <FaReply className="mr-2" /> 返信
                                            </Button>
                                            <div>
                                                <Button variant="ghost" size="sm" onClick={() => startEditing(review)}>
                                                    <FaEdit className="mr-2" /> 編集
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}>
                                                    <FaTrash className="mr-2" /> 削除
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* 返信セクション */}
                            {selectedReviewId === review.id && (
                                <>
                                    <ReplyForm review_id={review.id} onReplySubmit={onReplySubmit} />
                                    <ReplyList review_id={review.id} replies={replies} setReplies={setReplies} fetchReplyList={fetchReplyList} />
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default ReviewList;