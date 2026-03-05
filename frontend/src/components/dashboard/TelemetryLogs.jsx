import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Clock, CheckCircle2, AlertCircle, Activity, Filter, Download } from 'lucide-react';

const TelemetryLogs = ({ userRole = 'admin', userWards = [] }) => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('all'); // all, success, warning, error

    // All tank IDs for admin, filtered for users
    const getAllTankIds = () => {
        if (userRole === 'admin') {
            return [
                'TN-SA-1000', 'TN-SA-1001', 'TN-SA-1002', 'TN-SA-1003', 'TN-SA-1004',
                'TN-CB-2001', 'TN-CB-2002', 'TN-CB-2003', 'TN-CB-2004', 'TN-CB-2005',
                'TN-CH-3001', 'TN-CH-3002', 'TN-CH-3003', 'TN-CH-3004', 'TN-CH-3005',
                'TN-MD-4001', 'TN-MD-4002', 'TN-MD-4003', 'TN-MD-4004', 'TN-MD-4005'
            ];
        } else {
            // For users, only show tanks from their wards
            return userWards.map(ward => ward.id).filter(Boolean);
        }
    };

    const { lastReading, lastAlert } = useSocket();

    useEffect(() => {
        const tankIds = getAllTankIds();

        // If we get a real update, add it to logs
        if (lastReading && (userRole === 'admin' || tankIds.includes(lastReading.id))) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            const newLog = {
                id: `log-${Date.now()}`,
                tankId: lastReading.tankName || lastReading.id,
                message: `Packet received: pH ${lastReading.metrics.ph}, Turbidity ${lastReading.metrics.turbidity}. Data sync complete.`,
                status: '200 OK',
                timestamp: timeString,
                fullTimestamp: now.toISOString(),
                type: 'success'
            };

            setLogs(prev => [newLog, ...prev.slice(0, 99)]);
        }
    }, [lastReading]);

    useEffect(() => {
        const tankIds = getAllTankIds();

        // Add alerts to logs too
        if (lastAlert && (userRole === 'admin' || tankIds.includes(lastAlert.tankId))) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            const newLog = {
                id: `log-alert-${Date.now()}`,
                tankId: lastAlert.tankId,
                message: `ALERT: ${lastAlert.message}`,
                status: '400 WARN',
                timestamp: timeString,
                fullTimestamp: now.toISOString(),
                type: lastAlert.severity === 'critical' ? 'error' : 'warning'
            };

            setLogs(prev => [newLog, ...prev.slice(0, 99)]);
        }
    }, [lastAlert]);

    useEffect(() => {
        const tankIds = getAllTankIds();

        // Generate initial mixed logs if none exist
        if (logs.length === 0) {
            const initialLogs = Array.from({ length: 5 }, (_, i) => {
                const randomTankId = tankIds[i % tankIds.length] || 'Peelamedu Smart Tank';
                const now = new Date(Date.now() - (i * 300000));

                return {
                    id: `log-init-${i}`,
                    tankId: randomTankId,
                    message: `System heartbeat confirmed for ${randomTankId}. Operational integrity 100%.`,
                    status: '200 OK',
                    timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    fullTimestamp: now.toISOString(),
                    type: 'success'
                };
            });
            setLogs(initialLogs);
        }
    }, [userWards]);

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.type === filter);

    const getLogIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-amber-500" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getLogStyle = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 hover:bg-green-100';
            case 'warning':
                return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
            case 'error':
                return 'bg-red-50 border-red-200 hover:bg-red-100';
            default:
                return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
        }
    };

    const exportLogs = () => {
        const csvContent = [
            ['Timestamp', 'Tank ID', 'Status', 'Message'].join(','),
            ...filteredLogs.map(log =>
                [log.timestamp, log.tankId, log.status, `"${log.message}"`].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `telemetry-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                        >
                            <Radio className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {userRole === 'admin' ? 'Global Telemetry Logs' : 'My Ward Telemetry Logs'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Real-time heartbeat monitoring • {filteredLogs.length} logs
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportLogs}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </motion.button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'all'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All ({logs.length})
                    </button>
                    <button
                        onClick={() => setFilter('success')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'success'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Success ({logs.filter(l => l.type === 'success').length})
                    </button>
                    <button
                        onClick={() => setFilter('warning')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'warning'
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Warnings ({logs.filter(l => l.type === 'warning').length})
                    </button>
                    <button
                        onClick={() => setFilter('error')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'error'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Errors ({logs.filter(l => l.type === 'error').length})
                    </button>
                </div>
            </div>

            {/* Logs List */}
            <div className="max-h-[600px] overflow-y-auto">
                <AnimatePresence initial={false}>
                    {filteredLogs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3, delay: index < 5 ? index * 0.05 : 0 }}
                            className={`border-b border-gray-100 p-4 transition-all ${getLogStyle(log.type)}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {getLogIcon(log.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-900 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                                            {log.tankId}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${log.type === 'success' ? 'bg-green-100 text-green-700' :
                                            log.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium">{log.message}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 flex-shrink-0">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-xs font-semibold">{log.timestamp}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredLogs.length === 0 && (
                    <div className="p-12 text-center">
                        <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Logs Found</h3>
                        <p className="text-gray-500">No telemetry logs match the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TelemetryLogs;
