import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('aquasentry_token');
        if (storedToken) {
            try {
                // Try to decode as JWT first (in case we switch to real backend later)
                // If it fails, fallback to simple base64 decode for mock
                let decoded;
                if (storedToken.split('.').length === 3) {
                    decoded = jwtDecode(storedToken);
                } else {
                    decoded = JSON.parse(atob(storedToken));
                }

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser(decoded);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = React.useCallback(async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('aquasentry_token', data.token);
                setToken(data.token);
                setUser(data);
                return { success: true, user: data };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Cannot connect to server' };
        }
    }, []);

    const register = React.useCallback(async (name, email, password, role) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('aquasentry_token', data.token);
                setToken(data.token);
                setUser(data);
                return { success: true, user: data };
            } else {
                return { success: false, error: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Cannot connect to server' };
        }
    }, []);

    const logout = React.useCallback(() => {
        localStorage.removeItem('aquasentry_token');
        setToken(null);
        setUser(null);
    }, []);

    const isAuthenticated = React.useCallback(() => {
        return !!token && !!user;
    }, [token, user]);

    const value = React.useMemo(() => ({
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated
    }), [user, token, loading, login, register, logout, isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
