import React, { useState } from "react";
import axiosInstace from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


const Login = () => {
    const [formData, setFormData] = useState({
        username:"",
        password:"",
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstace.post("/users/token/", formData);
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            login();
            navigate("/home");
            //console.log(localStorage.getItem("access_token"));
            console.log("Logged in!");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button type="submit">Login</button>
          
          <a href="/register" className="hover:underline">
            アカウント登録
          </a>
        </form>
    );
};

export default Login;