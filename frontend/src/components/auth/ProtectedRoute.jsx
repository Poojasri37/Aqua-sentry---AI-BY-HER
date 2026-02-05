import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gov-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated() || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access unauthorized route
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'business_partner') return <Navigate to="/partner/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
