import React, { useEffect } from 'react';
//import axiosInstance from '../api/axiosInstance';

const ReplyList = ({ review_id, replies, fetchReplyList }) => {
    //const [replies, setReplies] = useState([]);
    useEffect(() =>{
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
    return (
        <ul className="mb-2">
            {(replies[`${review_id}`] || []).map((reply) => (
                <li key={reply.id} className="border-b p-2">
                    <p>{reply.reply_text}</p>
                    <small>投稿者: {reply.author || "匿名"}</small>
                </li>
            ))}
        </ul>
    );
};

export default ReplyList;