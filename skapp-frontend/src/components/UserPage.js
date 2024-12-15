import React, { useEffect, useState } from "react";
import axiosInstace from "../api/axiosInstance";
//import { useAuth } from "../auth/AuthContext";
//import { useNavigate } from "react-router-dom";

const ProtectedPage = () => {
    const [data, setData] = useState("");
    //const { logout } = useAuth();
    //const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstace.get("/protected-route/", {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("access_token")}`,
                    },
                });
                setData(response.data.message);
                //logout();
                //navigate("/login");
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };

        fetchData();
    }, []);

    return <div>{data ? <p>{data.message}</p> : <p>Loading...</p>}</div>;
};

export default ProtectedPage;