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
        <section className="container mx-auto my-6">
            <div className="bg-gray-100 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Submit Your Reply</h2>
                <form onSubmit={handleSubmit} className="mt-2">
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300"
                        placeholder="返信を入力してください..."
                    />
                    <button type="submit" className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        返信を投稿
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ReplyForm;