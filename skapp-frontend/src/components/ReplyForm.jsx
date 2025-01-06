import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

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
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <Textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="返信を入力してください..."
                        required
                    />
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        返信を投稿
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default ReplyForm;