import React, { useState } from 'react';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import { MdOutlineReply } from "react-icons/md";

const ReviewList = ({ reviews, replies, fetchReplyList, onReplySubmit }) => {
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const fetchReplies = (review_id) => {
        console.log(`Fetching replies for review ID: ${review_id}`);
        // 必要に応じて実際のリプライデータを取得するロジックを追加
    };


    return (
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
                                    className={`text-lg ${index < review.rating
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <small>投稿者: {review.author || "匿名"}</small>

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
                                <ReplyList review_id={review.id} replies={replies} fetchReplyList={fetchReplyList} />
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