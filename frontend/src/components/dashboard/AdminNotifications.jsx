import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, User, MapPin, Droplets, Calendar, AlertTriangle, Wrench, FileText } from 'lucide-react';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, asset, issue, maintenance

    useEffect(() => {
        // Load notifications from localStorage
        const loadNotifications = () => {
            const assetNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
            const issueNotifications = JSON.parse(localStorage.getItem('issueNotifications') || '[]');
            const maintenanceNotifications = JSON.parse(localStorage.getItem('maintenanceNotifications') || '[]');

            // Combine all notifications with type
            const allNotifications = [
                ...assetNotifications.map(n => ({ ...n, type: 'asset' })),
                ...issueNotifications.map(n => ({ ...n, type: 'issue' })),
                ...maintenanceNotifications.map(n => ({ ...n, type: 'maintenance' }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setNotifications(allNotifications);
        };

        loadNotifications();

        // Poll for new notifications every 3 seconds
        const interval = setInterval(loadNotifications, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleDismiss = (notification, index) => {
        // Remove from appropriate localStorage
        const storageKey = notification.type === 'asset' ? 'adminNotifications' :
            notification.type === 'issue' ? 'issueNotifications' :
                'maintenanceNotifications';

        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filtered = stored.filter((_, i) => {
            // Find the actual index in the specific storage
            const actualIndex = stored.findIndex(n =>
                n.timestamp === notification.timestamp &&
                JSON.stringify(n) === JSON.stringify(notifications.filter(n => n.type === notification.type)[i])
            );
            return i !== actualIndex;
        });
        localStorage.setItem(storageKey, JSON.stringify(filtered));

        // Update local state
        setNotifications(notifications.filter((_, i) => i !== index));
    };

    const handleClearAll = () => {
        localStorage.setItem('adminNotifications', JSON.stringify([]));
        localStorage.setItem('issueNotifications', JSON.stringify([]));
        localStorage.setItem('maintenanceNotifications', JSON.stringify([]));
        setNotifications([]);
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'asset': return <Droplets className="w-4 h-4 text-cyan-600" />;
            case 'issue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'maintenance': return <Wrench className="w-4 h-4 text-amber-600" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    const getNotificationBg = (type) => {
        switch (type) {
            case 'asset': return 'bg-cyan-50';
            case 'issue': return 'bg-red-50';
            case 'maintenance': return 'bg-amber-50';
            default: return 'bg-slate-50';
        }
    };

    const getNotificationTitle = (type) => {
        switch (type) {
            case 'asset': return 'New Asset Registration';
            case 'issue': return 'Issue Reported';
            case 'maintenance': return 'Maintenance Request';
            default: return 'Notification';
        }
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
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                        className="absolute right-0 top-14 w-[450px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm">Admin Notifications</h3>
                                    <p className="text-xs text-slate-500 font-medium">{filteredNotifications.length} pending notifications</p>
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

                            {/* Filter Tabs */}
                            <div className="flex gap-2">
                                {[
                                    { id: 'all', label: 'All', count: notifications.length },
                                    { id: 'asset', label: 'Assets', count: notifications.filter(n => n.type === 'asset').length },
                                    { id: 'issue', label: 'Issues', count: notifications.filter(n => n.type === 'issue').length },
                                    { id: 'maintenance', label: 'Maintenance', count: notifications.filter(n => n.type === 'maintenance').length }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilter(tab.id)}
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === tab.id
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {tab.label} {tab.count > 0 && `(${tab.count})`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[500px] overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                    <p className="text-sm font-bold text-slate-900">All Caught Up!</p>
                                    <p className="text-xs text-slate-500 mt-1">No new {filter !== 'all' ? filter : ''} notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredNotifications.map((notification, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 hover:bg-slate-50 transition-colors relative group"
                                        >
                                            <button
                                                onClick={() => handleDismiss(notification, index)}
                                                className="absolute top-2 right-2 p-1 hover:bg-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3 text-slate-400" />
                                            </button>

                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 ${getNotificationBg(notification.type)} rounded-xl`}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 pr-6">
                                                    <h4 className="font-black text-slate-900 text-sm mb-1">
                                                        {getNotificationTitle(notification.type)}
                                                    </h4>

                                                    <div className="space-y-2 mb-3">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <User className="w-3 h-3 text-slate-400" />
                                                            <span className="text-slate-600 font-medium">
                                                                {notification.user} ({notification.email})
                                                            </span>
                                                        </div>

                                                        {notification.type === 'asset' && notification.assetDetails && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <Droplets className="w-3 h-3 text-slate-400" />
                                                                    <span className="text-slate-600 font-medium">
                                                                        {notification.assetDetails.name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <MapPin className="w-3 h-3 text-slate-400" />
                                                                    <span className="text-slate-600 font-medium">
                                                                        {notification.assetDetails.ward} - {notification.assetDetails.location}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}

                                                        {notification.type === 'issue' && notification.issueDetails && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <FileText className="w-3 h-3 text-slate-400" />
                                                                    <span className="text-slate-600 font-medium">
                                                                        Tank: {notification.issueDetails.tankName || notification.issueDetails.tankId}
                                                                    </span>
                                                                </div>
                                                                <div className="p-2 bg-slate-100 rounded-lg">
                                                                    <p className="text-xs text-slate-700 font-medium italic">
                                                                        "{notification.issueDetails.description}"
                                                                    </p>
                                                                </div>
                                                            </>
                                                        )}

                                                        {notification.type === 'maintenance' && notification.maintenanceDetails && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <Wrench className="w-3 h-3 text-slate-400" />
                                                                    <span className="text-slate-600 font-medium">
                                                                        {notification.maintenanceDetails.type || 'Maintenance Request'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <MapPin className="w-3 h-3 text-slate-400" />
                                                                    <span className="text-slate-600 font-medium">
                                                                        Region: {notification.maintenanceDetails.region || 'Salem District'}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                                                            {new Date(notification.timestamp).toLocaleString()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors">
                                                                {notification.type === 'asset' ? 'Approve' :
                                                                    notification.type === 'issue' ? 'Dispatch' : 'Schedule'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDismiss(notification, index)}
                                                                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors"
                                                            >
                                                                Dismiss
                                                            </button>
                                                        </div>
                                                    </div>
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

export default AdminNotifications;
