import React, { useState, useEffect } from 'react';
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
            return userWards.map(ward => ward.tankId).filter(Boolean);
        }
    };

    useEffect(() => {
        const tankIds = getAllTankIds();

        // Generate initial logs
        const initialLogs = Array.from({ length: 10 }, (_, i) => {
            const randomTankId = tankIds[Math.floor(Math.random() * tankIds.length)];
            const now = new Date(Date.now() - (i * 60000)); // Past logs
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            return {
                id: `log-${Date.now()}-${i}`,
                tankId: randomTankId,
                message: `Telemetry successfully received for ${randomTankId}. Heartbeat packet confirmed.`,
                status: '200 OK',
                timestamp: timeString,
                fullTimestamp: now.toISOString(),
                type: 'success'
            };
        });

        setLogs(initialLogs);

        // Generate new logs every 5 seconds
        const interval = setInterval(() => {
            const randomTankId = tankIds[Math.floor(Math.random() * tankIds.length)];
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            // Randomly generate success, warning, or error logs
            const logTypes = [
                { type: 'success', status: '200 OK', message: `Telemetry successfully received for ${randomTankId}. Heartbeat packet confirmed.` },
                { type: 'success', status: '200 OK', message: `Data sync completed for ${randomTankId}. All parameters normal.` },
                { type: 'warning', status: '202 Accepted', message: `Delayed response from ${randomTankId}. Retrying connection...` },
                { type: 'error', status: '503 Timeout', message: `Connection timeout for ${randomTankId}. Sensor offline.` }
            ];

            const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];

            const newLog = {
                id: `log-${Date.now()}-${Math.random()}`,
                tankId: randomTankId,
                message: randomLog.message,
                status: randomLog.status,
                timestamp: timeString,
                fullTimestamp: now.toISOString(),
                type: randomLog.type
            };

            setLogs(prev => {
                const updated = [newLog, ...prev];
                return updated.slice(0, 100); // Keep last 100 logs
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [userRole, userWards]);

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
