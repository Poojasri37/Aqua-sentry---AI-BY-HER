import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Droplets, Activity, AlertTriangle, CheckCircle, MapPin, Thermometer, Waves } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { isConnected, lastReading } = useSocket();
    const navigate = useNavigate();
    const [sensorData, setSensorData] = useState([]);
    const [latestReading, setLatestReading] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Update sensor data when new reading arrives
    useEffect(() => {
        if (lastReading) {
            console.log('📡 New sensor reading:', lastReading);
            setLatestReading(lastReading);

            // Add to history (keep last 10 readings)
            setSensorData(prev => {
                const updated = [lastReading, ...prev].slice(0, 10);
                return updated;
            });
        }
    }, [lastReading]);

    // Status determination based on pH and turbidity
    const getStatus = (metrics) => {
        if (!metrics) return 'offline';
        const ph = parseFloat(metrics.ph);
        const turbidity = parseFloat(metrics.turbidity);

        // Normal pH range: 6.5 - 8.5
        // High turbidity threshold: > 1000
        if ((ph < 6.5 || ph > 8.5) || turbidity > 1000) {
            return 'warning';
        }
        return 'normal';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-lg">
                                <Droplets className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">AquaSentry Dashboard</h1>
                                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Connection Status */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                <span className="text-sm text-gray-600">
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-2xl p-8 text-white mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2">Your Account</h2>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-gov-green-100 text-sm">Email</p>
                            <p className="font-semibold">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-gov-green-100 text-sm">Role</p>
                            <p className="font-semibold capitalize">{user?.role}</p>
                        </div>
                        <div>
                            <p className="text-gov-green-100 text-sm">User ID</p>
                            <p className="font-semibold text-sm">{user?.id}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Latest Sensor Reading - Large Display */}
                {latestReading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold">Live Sensor Data</h2>
                                <p className="text-blue-100 mt-1">Real-time updates from ESP32</p>
                            </div>
                            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Activity className="w-8 h-8 animate-pulse" />
                            </div>
                        </div>

                        {/* Location Info */}
                        {latestReading.location && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-semibold">Location</span>
                                </div>
                                <p className="text-lg">
                                    {latestReading.location.city}, {latestReading.location.region}, {latestReading.location.country}
                                </p>
                                <p className="text-sm text-blue-100 mt-1">
                                    {latestReading.location.lat?.toFixed(4)}, {latestReading.location.lng?.toFixed(4)}
                                </p>
                            </div>
                        )}

                        {/* Sensor Metrics Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* pH Level */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-5 h-5" />
                                    <span className="text-sm font-medium">pH Level</span>
                                </div>
                                <p className="text-4xl font-bold">{latestReading.metrics?.ph}</p>
                                <p className="text-xs text-blue-100 mt-1">
                                    Voltage: {latestReading.metrics?.ph_voltage?.toFixed(3)}V
                                </p>
                            </div>

                            {/* Turbidity */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Waves className="w-5 h-5" />
                                    <span className="text-sm font-medium">Turbidity</span>
                                </div>
                                <p className="text-4xl font-bold">{latestReading.metrics?.turbidity?.toFixed(1)}</p>
                                <p className="text-xs text-blue-100 mt-1">
                                    Voltage: {latestReading.metrics?.turbidity_voltage?.toFixed(3)}V
                                </p>
                            </div>

                            {/* Temperature */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer className="w-5 h-5" />
                                    <span className="text-sm font-medium">Temperature</span>
                                </div>
                                <p className="text-4xl font-bold">{latestReading.metrics?.temperature}°C</p>
                                <p className="text-xs text-blue-100 mt-1">Calculated</p>
                            </div>

                            {/* Water Level */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-5 h-5" />
                                    <span className="text-sm font-medium">Water Level</span>
                                </div>
                                <p className="text-4xl font-bold">{latestReading.metrics?.waterLevel}%</p>
                                <p className="text-xs text-blue-100 mt-1">Tank capacity</p>
                            </div>
                        </div>

                        {/* Additional Calculated Parameters */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Chlorine */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-5 h-5" />
                                    <span className="text-sm font-medium">Chlorine</span>
                                </div>
                                <p className="text-3xl font-bold">{latestReading.metrics?.chlorine?.toFixed(2) || 'N/A'}</p>
                                <p className="text-xs text-blue-100 mt-1">mg/L (Calculated)</p>
                            </div>

                            {/* TDS */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-5 h-5" />
                                    <span className="text-sm font-medium">TDS</span>
                                </div>
                                <p className="text-3xl font-bold">{latestReading.metrics?.tds || 'N/A'}</p>
                                <p className="text-xs text-blue-100 mt-1">ppm (Calculated)</p>
                            </div>

                            {/* Conductivity */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-5 h-5" />
                                    <span className="text-sm font-medium">Conductivity</span>
                                </div>
                                <p className="text-3xl font-bold">{latestReading.metrics?.conductivity || 'N/A'}</p>
                                <p className="text-xs text-blue-100 mt-1">µS/cm (Calculated)</p>
                            </div>

                            {/* Dissolved Oxygen */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Waves className="w-5 h-5" />
                                    <span className="text-sm font-medium">Dissolved O₂</span>
                                </div>
                                <p className="text-3xl font-bold">{latestReading.metrics?.dissolved_oxygen?.toFixed(1) || 'N/A'}</p>
                                <p className="text-xs text-blue-100 mt-1">mg/L (Calculated)</p>
                            </div>
                        </div>

                        {/* Water Quality Index */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Water Quality Index (WQI)</h3>
                                    <p className="text-sm text-blue-100">Composite quality score</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-5xl font-bold">{latestReading.metrics?.wqi || 'N/A'}</p>
                                    <p className={`text-sm font-semibold mt-1 px-3 py-1 rounded-full inline-block ${latestReading.metrics?.quality_status === 'Excellent' ? 'bg-green-500' :
                                            latestReading.metrics?.quality_status === 'Good' ? 'bg-blue-500' :
                                                latestReading.metrics?.quality_status === 'Medium' ? 'bg-yellow-500' :
                                                    latestReading.metrics?.quality_status === 'Bad' ? 'bg-orange-500' :
                                                        'bg-red-500'
                                        }`}>
                                        {latestReading.metrics?.quality_status || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-4">
                                <div
                                    className={`h-4 rounded-full transition-all ${(latestReading.metrics?.wqi || 0) >= 90 ? 'bg-green-500' :
                                            (latestReading.metrics?.wqi || 0) >= 70 ? 'bg-blue-500' :
                                                (latestReading.metrics?.wqi || 0) >= 50 ? 'bg-yellow-500' :
                                                    (latestReading.metrics?.wqi || 0) >= 25 ? 'bg-orange-500' :
                                                        'bg-red-500'
                                        }`}
                                    style={{ width: `${latestReading.metrics?.wqi || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-blue-100">
                                Last updated: {new Date(latestReading.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Readings</p>
                                <p className="text-3xl font-bold text-gray-900">{sensorData.length}</p>
                            </div>
                            <div className="p-3 bg-gov-blue-100 rounded-xl">
                                <Activity className="w-6 h-6 text-gov-blue-700" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Connection Status</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {isConnected ? 'Online' : 'Offline'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                                <CheckCircle className={`w-6 h-6 ${isConnected ? 'text-green-700' : 'text-red-700'}`} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">System Status</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {latestReading ? getStatus(latestReading.metrics).toUpperCase() : 'WAITING'}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sensor History */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sensor Readings</h2>
                    {sensorData.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
                            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Waiting for ESP32 sensor data...</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Make sure your ESP32 is connected and sending data to the backend
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sensorData.map((reading, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {reading.tankName || reading.location?.city || 'Tank'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(reading.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatus(reading.metrics) === 'normal'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {getStatus(reading.metrics)}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">pH Level</span>
                                            <span className="font-semibold">{reading.metrics?.ph}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">Turbidity</span>
                                            <span className="font-semibold">{reading.metrics?.turbidity?.toFixed(1)}</span>
                                        </div>
                                        {reading.location && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{reading.location.city}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 bg-gov-blue-50 border border-gov-blue-200 rounded-xl p-6"
                >
                    <div className="flex items-start gap-4">
                        <Activity className="w-6 h-6 text-gov-blue-700 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-gray-700 font-semibold mb-2">Real-Time ESP32 Integration</p>
                            <p className="text-gray-600 text-sm">
                                This dashboard displays live sensor data from your ESP32 device.
                                Data includes pH levels, turbidity, temperature, and location information.
                                All readings are automatically saved to the database and broadcasted in real-time.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;

