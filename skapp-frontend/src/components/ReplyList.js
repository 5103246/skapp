import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const ReplyList = ({ review_id, replies, setReplies, fetchReplyList }) => {
    //const [replies, setReplies] = useState([]);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editedReply, setEditedReply] = useState("");
    useEffect(() => {
        fetchReplyList(review_id);
    }, [review_id, fetchReplyList]);
    /*
    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await axiosInstance.get(`/reviews/${review_id}/replies/`)
                setReplies((prev) => ({ ...prev, [review_id]: response.data }));
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching replies:", error);
            }
        };

        fetchReplies();
    }, [review_id]);
    */

    // 編集開始
    const startEditing = (reply) => {
        setEditingReplyId(reply.id);
        setEditedReply(reply.reply_text);
    };

    // 編集キャンセル
    const cancelEditing = () => {
        setEditingReplyId(null);
        setEditedReply("");
    };

    // 編集送信
    const handleEditSubmit = async (reply_id) => {
        try {
            const response = await axiosInstance.patch(`/replies/${reply_id}/`, {
                reply_text: editedReply,
            });
            console.log(response.data);
            setReplies((prevReplies) => ({
                ...prevReplies,
                [review_id]: prevReplies[review_id].map((reply) =>
                    reply.id === reply_id ? { ...reply, ...response.data } : reply
                ),
            })
                /*
                prevReplies.map((reply) =>
                    reply.id === reply_id ? { ...reply, ...response.data } : reply
                )*/
            );
            setEditingReplyId(null);
        } catch (error) {
            console.error("Error editing reply:", error);
        }
    };

    // 削除処理
    const handleDelete = async (reply_id) => {
        if (window.confirm("Are you sure you want to delete this reply?")) {
            try {
                await axiosInstance.delete(`/replies/${reply_id}/`);
                setReplies((prevReplies) => ({
                    ...prevReplies,
                    [review_id]: prevReplies[review_id].filter((reply) => reply.id !== reply_id),
                }));
            } catch (error) {
                console.error("Error deleting reply:", error);
            }
        }
    };
    return (
        <section className="container mx-auto my-6">
            <h2 className="text-xl font-bold mb-4">Replies</h2>
            <div className="space-y-4">
                <ul className="mb-2">
                    {(replies[`${review_id}`] || []).map((reply) => (
                        <li key={reply.id} className="border-b p-2">
                            {editingReplyId === reply.id ? (
                                <div>
                                    <textarea
                                        value={editedReply}
                                        onChange={(e) => setEditedReply(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <button onClick={() => handleEditSubmit(reply.id)} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2">Save</button>
                                    <button onClick={cancelEditing} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2">Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center">
                                        <small className="text-lg font-semibold">投稿者: {reply.author_name || "匿名"}</small>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => startEditing(reply)} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2">Edit</button>
                                            <button onClick={() => handleDelete(reply.id)} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2">Delete</button>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-700">{reply.reply_text}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section >
    );
};

export default ReplyList;