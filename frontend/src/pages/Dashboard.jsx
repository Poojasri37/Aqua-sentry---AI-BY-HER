import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Droplets, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Mock user-specific data
    const userTanks = [
        {
            id: 1,
            name: `${user?.name}'s Tank 1`,
            location: "Zone A",
            waterLevel: 85,
            pH: 7.2,
            status: "normal"
        },
        {
            id: 2,
            name: `${user?.name}'s Tank 2`,
            location: "Zone B",
            waterLevel: 45,
            pH: 6.8,
            status: "warning"
        }
    ];

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
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
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
                                <p className="text-gray-600 text-sm">Total Tanks</p>
                                <p className="text-3xl font-bold text-gray-900">{userTanks.length}</p>
                            </div>
                            <div className="p-3 bg-gov-blue-100 rounded-xl">
                                <Droplets className="w-6 h-6 text-gov-blue-700" />
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
                                <p className="text-gray-600 text-sm">Normal Status</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {userTanks.filter(t => t.status === 'normal').length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-700" />
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
                                <p className="text-gray-600 text-sm">Warnings</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {userTanks.filter(t => t.status === 'warning').length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tanks List */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Water Tanks</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {userTanks.map((tank, index) => (
                            <motion.div
                                key={tank.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{tank.name}</h3>
                                        <p className="text-sm text-gray-600">{tank.location}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tank.status === 'normal'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {tank.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Water Level</span>
                                            <span className="font-semibold">{tank.waterLevel}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gov-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${tank.waterLevel}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">pH Level</span>
                                        <span className="font-semibold">{tank.pH}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Info Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 bg-gov-blue-50 border border-gov-blue-200 rounded-xl p-6 text-center"
                >
                    <Activity className="w-8 h-8 text-gov-blue-700 mx-auto mb-3" />
                    <p className="text-gray-700">
                        <strong>Note:</strong> This is a demo dashboard showing user-specific data.
                        Each user sees only their own tanks and updates.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
