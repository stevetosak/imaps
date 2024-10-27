import React, { createContext, useState, useEffect } from "react";
import HttpService from "../../scripts/net/HttpService.js";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username,setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const httpService = new HttpService("http://localhost:8080/api/auth");

        const verifyToken = async () => {
            try {
                const response = await httpService.get(`/verify?token=${token}`);
                if (response.username) {
                    setIsAuthenticated(true);
                    setUsername(response.username)
                    console.log("/verify resp: ",response.username);
                } else {
                    setIsAuthenticated(false);
                    setLoading(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyToken()
        } else {
            setIsAuthenticated(false);
            setLoading(false);
        }

    }, []);

    const handleLogin = (data) => {
        localStorage.setItem("token", data.token);
        setUsername(data.username);
        setIsAuthenticated(true);

        console.log("USR: ", username)
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading, please wait...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, loading, setLoading, username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};
