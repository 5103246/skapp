import React, { useState } from 'react';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import { MdOutlineReply } from "react-icons/md";
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
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                onClick={() => setEditedRating(index + 1)}
                className={`text-2xl ${index < editedRating ? "text-yellow-500" : "text-gray-300"
                    }`}
            >
                ★
            </button>
        ));
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
        <div className="mt-4">
            <h2 className="text-xl font-semibold">感想と評価一覧</h2>
            <ul className="mt-2">
                {reviews.map((review) => (
                    <li key={review.id} className="border p-2 mb-2 rounded">
                        {/* 
                        <p>{review.review_text}</p>
                        <div className="flex items-center">
                            <span className="mr-2">評価:</span>
                            {Array.from({ length: 5 }, (_, index) => (
                                <span
                                    key={index}
                                    className={`text-lg ${index < review.rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <small>投稿者: {review.author_name || "匿名"}</small>*/}
                        {/* 感想と評価の編集 */}
                        {editingReviewId === review.id ? (
                            <div>
                                <textarea
                                    value={editedReview}
                                    onChange={(e) => setEditedReview(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                <div className="mt-2">{renderStars()}</div>
                                {/* 
                                <input
                                    type="number"
                                    value={editedReview.rating}
                                    onChange={(e) =>
                                        setEditedReview((prev) => ({
                                            ...prev,
                                            rating: e.target.value,
                                        }))
                                    }
                                />
                                */}
                                <button onClick={() => handleEditSubmit(review.id)}>Save</button>
                                <button onClick={cancelEditing}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>{review.review_text}</p>
                                <div className="flex items-center">
                                    <span className="mr-2">評価:</span>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span
                                            key={index}
                                            className={`text-lg ${index < review.rating
                                                ? "text-yellow-500"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <small>投稿者: {review.author_name || "匿名"}</small>
                                <button onClick={() => startEditing(review)} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2">編集</button>
                                <button onClick={() => handleDelete(review.id)} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2">削除</button>
                            </div>
                        )}

                        {/* 返信セクションの表示/非表示切り替えボタン */}
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

                        {/* 返信セクション */}
                        {selectedReviewId === review.id && (
                            <>
                                <ReplyList review_id={review.id} replies={replies} setReplies={setReplies} fetchReplyList={fetchReplyList} />
                                <ReplyForm review_id={review.id} onReplySubmit={onReplySubmit} />
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewList;