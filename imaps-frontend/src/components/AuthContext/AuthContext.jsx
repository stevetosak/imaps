import React, { createContext, useState, useEffect } from "react";
import HttpService from "../../scripts/net/HttpService.js";
import {LoadingContainer} from "../LoadingContainer/LoadingContainer.jsx";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username,setUsername] = useState("");


    const verifyToken = async () => {
        const token = localStorage.getItem("token");
        const httpService = new HttpService("http://localhost:8080/api/auth");

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


    useEffect(() => {
        verifyToken();

    }, []);

    if(loading){
        return <LoadingContainer/>
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated,loading, setLoading, username, setUsername,verifyToken }}>
            {children}
        </AuthContext.Provider>
    );
};
