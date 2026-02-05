import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, LayoutDashboard, Users, Activity, Settings, Bell, Map as MapIcon,
    ClipboardList, CheckCircle, XCircle, Bot, Droplets, AlertTriangle,
    TrendingUp, TrendingDown, Download, ChevronRight, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import TankMap from '../../components/dashboard/TankMap';
import AlertsPanel from '../../components/dashboard/AlertsPanel';
import AdminNotifications from '../../components/dashboard/AdminNotifications';
import { generateTanksList, generatePendingRequests, generateReportedIssues } from '../../utils/mockData';
import { useSocket } from '../../context/SocketContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { lastReading, isConnected } = useSocket();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedRegion, setSelectedRegion] = useState('Salem');
    const [tanks, setTanks] = useState([]);
    const [requests, setRequests] = useState([]);
    const [reportedIssues, setReportedIssues] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock regions data
    const regions = [
        { id: 'salem', name: 'Salem', wards: 5, tanks: 5 },
        { id: 'coimbatore', name: 'Coimbatore', wards: 5, tanks: 5 },
        { id: 'chennai', name: 'Chennai', wards: 5, tanks: 5 },
        { id: 'madurai', name: 'Madurai', wards: 5, tanks: 5 }
    ];

    useEffect(() => {
        if (lastReading) {
            setTanks(prevTanks =>
                prevTanks.map(tank =>
                    tank.id === lastReading.id
                        ? { ...tank, metrics: lastReading.metrics, waterLevel: lastReading.metrics.waterLevel, lastUpdate: lastReading.timestamp }
                        : tank
                )
            );
        }
    }, [lastReading]);

    useEffect(() => {
        // Simulate API call to fetch all tanks
        setIsLoading(true);
        setTimeout(() => {
            // Generate 5 tanks per region (total 20 tanks)
            const salemTanks = Array.from({ length: 5 }, (_, i) => ({
                id: `TN-SA-${1001 + i}`,
                name: `Salem Ward ${i + 1} Tank`,
                region: 'Salem',
                ward: `Ward ${i + 1}`,
                status: ['online', 'warning', 'critical'][Math.floor(Math.random() * 3)],
                waterLevel: Math.floor(Math.random() * 100),
                location: { lat: 11.6643 + (i * 0.01), lng: 78.1460 + (i * 0.01) },
                lastUpdate: new Date().toISOString(),
                metrics: {
                    ph: (6.5 + Math.random() * 2).toFixed(1),
                    turbidity: (Math.random() * 5).toFixed(1),
                    chlorine: (1.0 + Math.random() * 1.5).toFixed(1),
                    temperature: (20 + Math.random() * 10).toFixed(1)
                }
            }));

            const coimbatoreTanks = Array.from({ length: 5 }, (_, i) => ({
                id: `TN-CB-${2001 + i}`,
                name: `Coimbatore Ward ${i + 1} Tank`,
                region: 'Coimbatore',
                ward: `Ward ${i + 1}`,
                status: ['online', 'warning', 'critical'][Math.floor(Math.random() * 3)],
                waterLevel: Math.floor(Math.random() * 100),
                location: { lat: 11.0168 + (i * 0.01), lng: 76.9558 + (i * 0.01) },
                lastUpdate: new Date().toISOString(),
                metrics: {
                    ph: (6.5 + Math.random() * 2).toFixed(1),
                    turbidity: (Math.random() * 5).toFixed(1),
                    chlorine: (1.0 + Math.random() * 1.5).toFixed(1),
                    temperature: (20 + Math.random() * 10).toFixed(1)
                }
            }));

            const chennaiTanks = Array.from({ length: 5 }, (_, i) => ({
                id: `TN-CH-${3001 + i}`,
                name: `Chennai Ward ${i + 1} Tank`,
                region: 'Chennai',
                ward: `Ward ${i + 1}`,
                status: ['online', 'warning', 'critical'][Math.floor(Math.random() * 3)],
                waterLevel: Math.floor(Math.random() * 100),
                location: { lat: 13.0827 + (i * 0.01), lng: 80.2707 + (i * 0.01) },
                lastUpdate: new Date().toISOString(),
                metrics: {
                    ph: (6.5 + Math.random() * 2).toFixed(1),
                    turbidity: (Math.random() * 5).toFixed(1),
                    chlorine: (1.0 + Math.random() * 1.5).toFixed(1),
                    temperature: (20 + Math.random() * 10).toFixed(1)
                }
            }));

            const maduraiTanks = Array.from({ length: 5 }, (_, i) => ({
                id: `TN-MD-${4001 + i}`,
                name: `Madurai Ward ${i + 1} Tank`,
                region: 'Madurai',
                ward: `Ward ${i + 1}`,
                status: ['online', 'warning', 'critical'][Math.floor(Math.random() * 3)],
                waterLevel: Math.floor(Math.random() * 100),
                location: { lat: 9.9252 + (i * 0.01), lng: 78.1198 + (i * 0.01) },
                lastUpdate: new Date().toISOString(),
                metrics: {
                    ph: (6.5 + Math.random() * 2).toFixed(1),
                    turbidity: (Math.random() * 5).toFixed(1),
                    chlorine: (1.0 + Math.random() * 1.5).toFixed(1),
                    temperature: (20 + Math.random() * 10).toFixed(1)
                }
            }));

            setTanks([...salemTanks, ...coimbatoreTanks, ...chennaiTanks, ...maduraiTanks]);

            // Load real requests from localStorage
            const loadRequests = () => {
                const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
                const formattedRequests = adminNotifications.map((notif, index) => ({
                    id: `req-${index}-${Date.now()}`,
                    user: notif.user,
                    email: notif.email,
                    location: notif.assetDetails?.location || 'N/A',
                    capacity: parseInt(notif.assetDetails?.capacity) || 0,
                    purpose: notif.assetDetails?.purpose || 'N/A',
                    timestamp: notif.timestamp,
                    originalIndex: index
                }));
                setRequests(formattedRequests);
            };

            // Load real issues from localStorage
            const loadIssues = () => {
                const issueNotifications = JSON.parse(localStorage.getItem('issueNotifications') || '[]');
                const formattedIssues = issueNotifications.map((notif, index) => ({
                    id: `issue-${index}`,
                    tank: notif.issueDetails?.tankName || notif.issueDetails?.tankId || 'Unknown Tank',
                    issue: notif.issueDetails?.description || 'No description provided',
                    severity: notif.issueDetails?.severity || 'medium',
                    user: notif.user,
                    date: new Date(notif.timestamp).toLocaleDateString(),
                    aiSummary: `Based on the reported issue, recommend immediate inspection of water quality parameters. ${notif.issueDetails?.issueType ? `Issue type: ${notif.issueDetails.issueType}.` : ''} Priority level: ${notif.issueDetails?.severity || 'medium'}.`
                }));
                setReportedIssues(formattedIssues);
            };

            loadRequests();
            loadIssues();

            // Mock registered users
            setRegisteredUsers([
                { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'user', region: 'Salem', joinedDate: '2024-01-15', tanks: 3 },
                { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'user', region: 'Coimbatore', joinedDate: '2024-02-01', tanks: 2 },
                { id: 3, name: 'Arun Patel', email: 'arun@example.com', role: 'business_partner', region: 'Chennai', joinedDate: '2024-01-20', tanks: 5 },
                { id: 4, name: 'Lakshmi Iyer', email: 'lakshmi@example.com', role: 'user', region: 'Salem', joinedDate: '2024-02-10', tanks: 1 },
                { id: 5, name: 'Vijay Reddy', email: 'vijay@example.com', role: 'user', region: 'Madurai', joinedDate: '2024-01-25', tanks: 2 }
            ]);

            setIsLoading(false);
        }, 800);

        // Poll for new requests and issues every 3 seconds
        const interval = setInterval(() => {
            // Update requests
            const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
            const formattedRequests = adminNotifications.map((notif, index) => ({
                id: `req-${index}-${Date.now()}`,
                user: notif.user,
                email: notif.email,
                location: notif.assetDetails?.location || 'N/A',
                capacity: parseInt(notif.assetDetails?.capacity) || 0,
                purpose: notif.assetDetails?.purpose || 'N/A',
                timestamp: notif.timestamp,
                originalIndex: index
            }));
            setRequests(formattedRequests);

            // Update issues
            const issueNotifications = JSON.parse(localStorage.getItem('issueNotifications') || '[]');
            const formattedIssues = issueNotifications.map((notif, index) => ({
                id: `issue-${index}`,
                tank: notif.issueDetails?.tankName || notif.issueDetails?.tankId || 'Unknown Tank',
                issue: notif.issueDetails?.description || 'No description provided',
                severity: notif.issueDetails?.severity || 'medium',
                user: notif.user,
                date: new Date(notif.timestamp).toLocaleDateString(),
                aiSummary: `Based on the reported issue, recommend immediate inspection of water quality parameters. ${notif.issueDetails?.issueType ? `Issue type: ${notif.issueDetails.issueType}.` : ''} Priority level: ${notif.issueDetails?.severity || 'medium'}.`
            }));
            setReportedIssues(formattedIssues);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleApproveRequest = (reqId) => {
        // Find the request
        const request = requests.find(r => r.id === reqId);
        if (request) {
            // Send notification to user
            const userNotification = {
                type: 'request_approved',
                message: `Your asset registration request for "${request.location}" has been approved!`,
                timestamp: new Date().toISOString()
            };

            // Store in localStorage for user to see
            const existingUserNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
            existingUserNotifications.push(userNotification);
            localStorage.setItem('userNotifications', JSON.stringify(existingUserNotifications));

            console.log('User notified of approval:', userNotification);

            // Remove from adminNotifications
            const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
            adminNotifications.splice(request.originalIndex, 1);
            localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        }

        // Update local state immediately
        setRequests(requests.filter(r => r.id !== reqId));
    };

    const handleRejectRequest = (reqId) => {
        // Find the request
        const request = requests.find(r => r.id === reqId);
        if (request) {
            // Send notification to user
            const userNotification = {
                type: 'request_rejected',
                message: `Your asset registration request for "${request.location}" has been rejected. Please contact support for details.`,
                timestamp: new Date().toISOString()
            };

            // Store in localStorage for user to see
            const existingUserNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
            existingUserNotifications.push(userNotification);
            localStorage.setItem('userNotifications', JSON.stringify(existingUserNotifications));

            console.log('User notified of rejection:', userNotification);

            // Remove from adminNotifications
            const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
            adminNotifications.splice(request.originalIndex, 1);
            localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        }

        // Update local state immediately
        setRequests(requests.filter(r => r.id !== reqId));
    };

    // Calculate Summary Stats
    const totalTanks = tanks.length;
    const alertCount = tanks.filter(t => t.status === 'critical' || t.status === 'warning').length;
    const onlineCount = tanks.filter(t => t.status === 'online').length;

    // Regional statistics for charts
    const regionalData = regions.map(region => ({
        name: region.name,
        tanks: region.tanks,
        wards: region.wards,
        alerts: Math.floor(Math.random() * 5)
    }));

    const statusData = [
        { name: 'Healthy', value: onlineCount, color: '#10b981' },
        { name: 'Warning', value: tanks.filter(t => t.status === 'warning').length, color: '#f59e0b' },
        { name: 'Critical', value: tanks.filter(t => t.status === 'critical').length, color: '#ef4444' }
    ];

    const waterQualityTrend = [
        { month: 'Jan', ph: 7.2, turbidity: 3.5, chlorine: 1.8 },
        { month: 'Feb', ph: 7.3, turbidity: 3.2, chlorine: 1.9 },
        { month: 'Mar', ph: 7.1, turbidity: 3.8, chlorine: 1.7 },
        { month: 'Apr', ph: 7.4, turbidity: 3.1, chlorine: 2.0 },
        { month: 'May', ph: 7.2, turbidity: 3.4, chlorine: 1.8 },
        { month: 'Jun', ph: 7.3, turbidity: 3.3, chlorine: 1.9 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-gov-green-500 rounded-lg flex items-center justify-center font-bold">A</div>
                        <span className="text-xl font-bold">AquaSentry</span>
                    </div>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <Users className="w-5 h-5" /> Registered Users
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <ClipboardList className="w-5 h-5" /> Requests
                            {requests.length > 0 && <span className="ml-auto bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{requests.length}</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('tanks')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'tanks' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <Activity className="w-5 h-5" /> All Tanks
                        </button>
                        <button
                            onClick={() => setActiveTab('map')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'map' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <MapIcon className="w-5 h-5" /> Map View
                        </button>
                        <button
                            onClick={() => setActiveTab('alerts')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'alerts' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <Bell className="w-5 h-5" /> Alerts
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-gov-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <Settings className="w-5 h-5" /> Settings
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="flex items-center gap-6">
                        {isConnected ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Live System Active</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-400 rounded-full border border-gray-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">System Offline</span>
                            </div>
                        )}
                        <AdminNotifications />
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-gov-green-100 rounded-full flex items-center justify-center text-gov-green-700 font-bold border border-gov-green-200">
                                {user?.name?.[0] || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-20">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-gray-500 text-sm font-medium">Total Regions</h3>
                                        <MapIcon className="w-5 h-5 text-cyan-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{regions.length}</p>
                                    <p className="text-xs text-gray-400 mt-1">Across Tamil Nadu</p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-gray-500 text-sm font-medium">Total Tanks</h3>
                                        <Droplets className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : totalTanks}</p>
                                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> +12% from last month
                                    </p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-red-600">{isLoading ? '...' : alertCount}</p>
                                    <p className="text-xs text-gray-400 mt-1">Requires attention</p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-gray-500 text-sm font-medium">System Health</h3>
                                        <Activity className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : `${Math.round((onlineCount / totalTanks) * 100)}%`}</p>
                                    <p className="text-xs text-gray-400 mt-1">Operational status</p>
                                </motion.div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Regional Distribution */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Regional Distribution</h3>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={regionalData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" fontSize={12} fontWeight="bold" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <YAxis fontSize={12} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Bar dataKey="tanks" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Status Distribution */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Overall Status Distribution</h3>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Water Quality Trends */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Water Quality Trends (Last 6 Months)</h3>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={waterQualityTrend}>
                                                <defs>
                                                    <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorChlorine" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="month" fontSize={12} fontWeight="bold" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <YAxis fontSize={12} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="ph" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPh)" strokeWidth={2} />
                                                <Area type="monotone" dataKey="turbidity" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTurbidity)" strokeWidth={2} />
                                                <Area type="monotone" dataKey="chlorine" stroke="#10b981" fillOpacity={1} fill="url(#colorChlorine)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Registered Users Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
                                    <p className="text-sm text-gray-500 mt-1">{registeredUsers.length} total users</p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                                    <Download className="w-4 h-4" />
                                    Export Users
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Region</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tanks</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {registeredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                            {user.name[0]}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'business_partner' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {user.role.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">{user.region}</td>
                                                <td className="px-6 py-4 text-gray-900 font-medium">{user.tanks}</td>
                                                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(user.joinedDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Requests Tab */}
                    {activeTab === 'requests' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">Pending Asset Registration Requests</h2>
                                <p className="text-sm text-gray-500 mt-1">{requests.length} pending approvals</p>
                            </div>
                            {requests.length === 0 ? (
                                <div className="p-12 text-center">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">All Caught Up!</h3>
                                    <p className="text-gray-500">No pending requests at this time.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Capacity</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Purpose</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {requests.map(req => (
                                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{req.user}</td>
                                                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{req.location}</td>
                                                    <td className="px-6 py-4 text-gray-600">{req.capacity.toLocaleString()}L</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">
                                                            {req.purpose}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 flex gap-2">
                                                        <button
                                                            onClick={() => handleApproveRequest(req.id)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(req.id)}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* All Tanks Tab */}
                    {activeTab === 'tanks' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">All Tanks - Multi-Region View</h2>
                                    <p className="text-sm text-gray-500 mt-1">{totalTanks} tanks across {regions.length} regions</p>
                                </div>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="All">All Regions</option>
                                    {regions.map(region => (
                                        <option key={region.id} value={region.name}>{region.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {tanks
                                    .filter(tank => selectedRegion === 'All' || tank.region === selectedRegion)
                                    .map(tank => (
                                        <div
                                            key={tank.id}
                                            onClick={() => navigate(`/tanks/${tank.id}`)}
                                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                                    tank.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    <Droplets className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{tank.name}</h3>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">{tank.id} • {tank.region}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 font-bold uppercase">pH: {tank.metrics.ph}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Turbidity: {tank.metrics.turbidity} NTU</p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                                    tank.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    {tank.status}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Map View Tab */}
                    {activeTab === 'map' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Interactive Map View</h2>
                                        <p className="text-sm text-gray-500 mt-1">Navigate regions and wards</p>
                                    </div>
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        {regions.map(region => (
                                            <option key={region.id} value={region.name}>{region.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Warning</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Critical</span>
                                </div>
                            </div>
                            <TankMap tanks={tanks} />
                        </div>
                    )}

                    {/* Alerts Tab */}
                    {activeTab === 'alerts' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Active Reported Issues</h2>
                                    <p className="text-sm text-gray-500 mt-1">{reportedIssues.length} active issues</p>
                                </div>
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">{reportedIssues.length} ACTIVE</span>
                            </div>
                            {reportedIssues.length === 0 ? (
                                <div className="p-12 text-center">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Issues</h3>
                                    <p className="text-gray-500">All systems are running smoothly. No reported issues at this time.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reportedIssues.map(iss => (
                                        <div key={iss.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                                            <div className={`p-1 ${iss.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-bold text-gray-900">{iss.tank}</span>
                                                    <span className="text-xs text-gray-400">{iss.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4 italic">"{iss.issue}"</p>
                                                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3">
                                                    <Bot className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                    <div className="text-xs text-indigo-900 leading-relaxed">
                                                        <span className="font-bold block mb-1">AI Recommendation:</span>
                                                        {iss.aiSummary}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                                                <span className="text-xs text-gray-500">Reported by: <strong>{iss.user}</strong></span>
                                                <button className="text-indigo-600 text-xs font-bold hover:underline">Dispatch Technician</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>

                            <div className="space-y-6">
                                {/* General Settings */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Email Notifications</p>
                                                <p className="text-sm text-gray-500">Receive email alerts for critical issues</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">SMS Alerts</p>
                                                <p className="text-sm text-gray-500">Get SMS for emergency situations</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Auto-Approve Requests</p>
                                                <p className="text-sm text-gray-500">Automatically approve verified users</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Management */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
                                    <div className="space-y-3">
                                        <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left rounded-lg transition-colors flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Export All Data</span>
                                            <Download className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left rounded-lg transition-colors flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Backup Database</span>
                                            <Download className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-left rounded-lg transition-colors flex items-center justify-between">
                                            <span className="font-medium text-red-600">Clear Cache</span>
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* System Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">System Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Version</p>
                                            <p className="font-bold text-gray-900">v2.1.0</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                                            <p className="font-bold text-gray-900">Feb 5, 2026</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Database Size</p>
                                            <p className="font-bold text-gray-900">2.4 GB</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">API Status</p>
                                            <p className="font-bold text-emerald-600">Operational</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
