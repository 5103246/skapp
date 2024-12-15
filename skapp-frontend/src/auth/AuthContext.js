import React, { createContext, useContext, useState, useEffect } from "react";
//import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    //const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));

    console.log("AuthProvider initialized:", isAuthenticated);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
    /*
    const refreshAccessToken = async () => {
    try {
        const response = await axiosInstance.post("/api/token/refresh/", {
            refresh: localStorage.getItem("refreshToken"),
        });
        localStorage.setItem("authToken", response.data.access);
    } catch (error) {
        console.error("Failed to refresh access token", error);
        logout(); // トークンリフレッシュが失敗した場合はログアウト処理
    }
};
    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post("/users/token/", {
                username: credentials.username,
                password: credentials.password,
            });
            const token = response.data.access;
            localStorage.setItem("access_token", token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed", error);
        }
    };*/
/*
    const logout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    }:*/

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);