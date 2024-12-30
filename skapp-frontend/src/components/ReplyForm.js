import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ReplyForm = ({ review_id, onReplySubmit }) => {
    const [newReply, setNewReply] = useState("");

    // 返信投稿
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            const response = await axiosInstance.post(`/reviews/${review_id}/replies/`, {
                reply_text: newReply,
            });
            /*
            setReplies((prev) => ({
              ...prev,
              [review_id]: [...(prev[review_id] || []), response.data],
            }));
            */
            onReplySubmit(review_id, response.data);
            setNewReply("");
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="返信を入力してください..."
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                返信を投稿
            </button>
        </form>
    );
};

export default ReplyForm;