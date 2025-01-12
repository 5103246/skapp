import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
    const [currentUser, setCurrentUser] = useState(null);

    console.log("AuthProvider initialized:", isAuthenticated);
    const login = () => setIsAuthenticated(true);
    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token")
        setIsAuthenticated(false);
        setCurrentUser(null);
    }, []);

    const refreshToken = useCallback(async () => {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) return false;

        try {
            const response = await axiosInstance.post('/users/token/refresh/', {
                refresh: refresh,
            });

            const newAccessToken = response.data.access;
            localStorage.setItem("access_token", newAccessToken);
            return true;
        } catch (error) {
            console.warn("Failed to refresh token:", error);
            logout(); // リフレッシュ失敗時はログアウト
            return false;
        }
    }, [logout]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axiosInstance.get("/auth/user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCurrentUser(response.data); // ユーザー情報を設定
                setIsAuthenticated(true); // 認証済み状態を設定
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn("Token expired or invaild, logging out.")
                    const refreshSuccess = await refreshToken();
                    if (refreshSuccess) {
                        const newToken = localStorage.getItem("access_token");
                        const retryResponse = await axiosInstance.get("/auth/user/", {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        });
                        setCurrentUser(retryResponse.data);
                        setIsAuthenticated(true);
                    } else {
                        logout();
                    }
                } else {
                    console.error("Error fetching current user:", error);
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            }
        };

        fetchCurrentUser();
    }, [refreshToken, logout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, setCurrentUser, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);