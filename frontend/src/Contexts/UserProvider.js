import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Create a context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Retrieve user from localStorage if it exists
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    // Function to verify the token and load user data
    const verifyToken = async () => {
        const token = Cookies.get("token"); // Get token from cookie
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/users/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const userData = {
                id: response.data.data._id,
                username: response.data.data.username,
                email: response.data.data.email,
                role: response.data.data.role
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("dataLoaded", "true");
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error) {
            console.error("Token verification failed:", error);
            // Clear the data if the token verification fails
            localStorage.removeItem("user");
            localStorage.removeItem("dataLoaded");
        } finally {
            setLoading(false);
        }
    };

    // Function to manually refresh user data
    const refreshUserData = () => {
        localStorage.removeItem("dataLoaded");
        localStorage.removeItem("user");
        setLoading(true);
        verifyToken();
    };

    // Load data on first visit or if manually refreshed
    useEffect(() => {
        const dataLoaded = localStorage.getItem("dataLoaded");
        if (!dataLoaded) {
            verifyToken();
        } else {
            setLoading(false);
        }
        if (performance.getEntriesByType('navigation')[0].type === 'reload') {
            refreshUserData();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUserData }}>
            {children}
        </UserContext.Provider>
    );
};