import React, {createContext, useState, useContext, useEffect} from 'react';
import {verifyToken} from "../../scripts/util/verifyToken.js";

const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verifyToken(setIsAuthenticated,setUsername,setLoading)
    }, []);


    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                username,
                loading,
                setIsAuthenticated,
                setUsername,
                setLoading,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
