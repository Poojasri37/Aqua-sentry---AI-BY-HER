import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';

// Mock Alerts Data
const MOCK_ALERTS = [
    { id: 1, type: 'critical', tank: 'Tank A-101', message: 'pH Level Critical high (9.2)', time: '10 mins ago', status: 'active' },
    { id: 2, type: 'warning', tank: 'Tank B-04', message: 'Water level low (< 20%)', time: '1 hour ago', status: 'active' },
    { id: 3, type: 'info', tank: 'Tank C-12', message: 'Maintenance scheduled for tomorrow', time: '2 hours ago', status: 'active' },
    { id: 4, type: 'critical', tank: 'Tank A-103', message: 'Turbidity exceeds safe limit (5.0 NTU)', time: '4 hours ago', status: 'resolved' },
    { id: 5, type: 'warning', tank: 'Tank D-09', message: 'Sensor offline for 15 mins', time: '5 hours ago', status: 'resolved' },
];

const AlertsPanel = () => {
    const [filter, setFilter] = useState('all'); // all, critical, warning, resolved
    const [alerts, setAlerts] = useState(MOCK_ALERTS);
    const { lastAlert, isConnected } = useSocket();

    useEffect(() => {
        if (lastAlert) {
            // Avoid adding duplicate alerts if they have the same ID
            setAlerts(prev => {
                if (prev.find(a => a.id === lastAlert.id)) return prev;
                return [lastAlert, ...prev];
            });
        }
    }, [lastAlert]);

    const handleResolve = (id) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    };

    const filteredAlerts = alerts.filter(a => {
        if (filter === 'all') return a.status === 'active';
        if (filter === 'resolved') return a.status === 'resolved';
        return a.type === filter && a.status === 'active';
    });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" /> System Alerts
                    </h2>
                    {isConnected && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            LIVE
                        </div>
                    )}
                </div>

                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    {['all', 'critical', 'warning', 'resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === f
                                ? 'bg-gov-green-100 text-gov-green-700 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50'
                                } capitalize`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                    {filteredAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <CheckCircle className="w-10 h-10 mb-2 text-green-100" />
                            <p>No alerts found</p>
                        </div>
                    ) : (
                        filteredAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-4 rounded-lg border-l-4 shadow-sm bg-white flex justify-between items-start gap-3 ${alert.type === 'critical' ? 'border-red-500' :
                                    alert.type === 'warning' ? 'border-yellow-500' :
                                        alert.type === 'info' ? 'border-blue-500' : 'border-gray-500'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-0.5 p-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-100 text-red-600' :
                                        alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {alert.type === 'critical' ? <AlertTriangle className="w-4 h-4" /> :
                                            alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                                                <Info className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{alert.tank}</h4>
                                        <p className="text-gray-600 text-sm mt-0.5">{alert.message}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <p className="text-xs text-gray-400">{alert.time}</p>
                                            {alert.user && <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">By: {alert.user}</p>}
                                        </div>
                                    </div>
                                </div>

                                {alert.status === 'active' && (
                                    <button
                                        onClick={() => handleResolve(alert.id)}
                                        className="text-xs text-gray-500 hover:text-green-600 font-medium px-2 py-1 hover:bg-green-50 rounded transition-colors"
                                    >
                                        Resolve
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                View All Notification History
            </div>
        </div>
    );
};

export default AlertsPanel;
