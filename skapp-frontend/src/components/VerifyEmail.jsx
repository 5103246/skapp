import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axiosInstance.get(`/verify-email/${token}/`);
                setMessage("メールアドレスが確認されました。ログインしてください。");
                setTimeout(() => navigate("/login"), 3000); // 3秒後にログイン画面へ
                console.log(response)
            } catch (err) {
                setError("トークンが無効または期限切れです。");
                console.error("Verification error:", err.response?.data);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">メール確認</h2>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default VerifyEmail;