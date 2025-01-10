import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaEdit, FaTrash } from "react-icons/fa"
import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";

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
        <div className="space-y-4">
            {(replies[`${review_id}`] || []).map((reply) => (
                <Card key={reply.id} className="hover:bg-gray-50 transition duration-200">
                    <CardContent className="p-4">
                        {editingReplyId === reply.id ? (
                            <div>
                                <textarea
                                    value={editedReply}
                                    onChange={(e) => setEditedReply(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                <Button variant="ghost" size="sm" onClick={() => handleEditSubmit(reply.id)}>
                                    <MdOutlineSaveAlt className="mr-2" /> Save
                                </Button>
                                <Button variant="ghost" size="sm" onClick={cancelEditing}>
                                    <MdOutlineCancel className="mr-2" /> Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 font-bold text-sm">学</span>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold">{reply.author_name || "匿名"}</span>
                                        <span className="text-gray-500 text-sm">・</span>
                                        <span className="text-gray-500 text-sm">{reply.created_at}</span>
                                    </div>
                                    <p className="mt-1">{reply.reply_text}</p>
                                    <div className="flex items-center justify-end mt-3">
                                        <Button variant="ghost" size="sm" onClick={() => startEditing(reply)}>
                                            <FaEdit className="mr-2" /> 編集
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(reply.id)}>
                                            <FaTrash className="mr-2" /> 削除
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ReplyList;