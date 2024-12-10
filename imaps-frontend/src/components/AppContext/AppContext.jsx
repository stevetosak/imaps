import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

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

// Custom hook to access context values
export const useAppContext = () => useContext(AppContext);
