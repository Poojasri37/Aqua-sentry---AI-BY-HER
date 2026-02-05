import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X, Bell } from 'lucide-react';

const UserNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Load notifications from localStorage
        const loadNotifications = () => {
            const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
            setNotifications(userNotifications);
        };

        loadNotifications();

        // Poll for new notifications every 3 seconds
        const interval = setInterval(loadNotifications, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleDismiss = (index) => {
        const updated = notifications.filter((_, i) => i !== index);
        setNotifications(updated);
        localStorage.setItem('userNotifications', JSON.stringify(updated));
    };

    const handleClearAll = () => {
        setNotifications([]);
        localStorage.setItem('userNotifications', JSON.stringify([]));
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications.length > 0 && (
                    <>
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-500 border-2 border-white rounded-full animate-pulse"></span>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    </>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-14 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
                                    <p className="text-xs text-slate-500 font-medium">{notifications.length} new updates</p>
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="text-xs text-cyan-600 font-bold hover:underline"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                    <p className="text-sm font-bold text-slate-900">All Caught Up!</p>
                                    <p className="text-xs text-slate-500 mt-1">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notification, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 hover:bg-slate-50 transition-colors relative group"
                                        >
                                            <button
                                                onClick={() => handleDismiss(index)}
                                                className="absolute top-2 right-2 p-1 hover:bg-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3 text-slate-400" />
                                            </button>

                                            <div className="flex items-start gap-3 pr-6">
                                                <div className={`p-2 rounded-xl ${notification.type === 'request_approved'
                                                        ? 'bg-emerald-50'
                                                        : 'bg-red-50'
                                                    }`}>
                                                    {notification.type === 'request_approved' ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-black text-sm mb-1 ${notification.type === 'request_approved'
                                                            ? 'text-emerald-900'
                                                            : 'text-red-900'
                                                        }`}>
                                                        {notification.type === 'request_approved'
                                                            ? 'Request Approved ✓'
                                                            : 'Request Rejected'}
                                                    </h4>
                                                    <p className="text-xs text-slate-600 font-medium mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                                                        {new Date(notification.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserNotifications;
