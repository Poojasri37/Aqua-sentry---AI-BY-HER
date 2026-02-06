import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Droplets,
    Map as MapIcon,
    Bell,
    BrainCircuit,
    AlertTriangle,
    Wrench,
    FileText,
    Download,
    PlusCircle,
    ChevronRight,
    LogOut,
    Users,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Calendar,
    Settings,
    MoreVertical,
    FileJson,
    Minimize2,
    Maximize2,
    Eye,
    Radio
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateTanksList, generateAlerts, generateSensorHistory } from '../../utils/mockData';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UserTankMap from '../../components/dashboard/UserTankMap';
import RegisterAssetModal from '../../components/dashboard/RegisterAssetModal';
import UserNotifications from '../../components/dashboard/UserNotifications';
import VisionInspection from '../../components/dashboard/VisionInspection';
import TelemetryLogs from '../../components/dashboard/TelemetryLogs';
import { useSocket } from '../../context/SocketContext';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Markers for different statuses
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const icons = {
    red: createIcon('red'),
    yellow: createIcon('gold'),
    green: createIcon('green')
};

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { lastReading, lastAlert, isConnected } = useSocket();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [tanks, setTanks] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [region, setRegion] = useState('Salem District');
    const [isLoading, setIsLoading] = useState(true);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    useEffect(() => {
        // Mock loading
        setTimeout(() => {
            const tanksData = generateTanksList(5, 'Salem');
            setTanks(tanksData);
            setAlerts(generateAlerts());
            setIsLoading(false);
        }, 1000);
    }, []);

    // Update tanks with real-time data
    useEffect(() => {
        if (lastReading) {
            setTanks(prevTanks =>
                prevTanks.map(tank =>
                    tank.id === lastReading.id
                        ? { ...tank, metrics: lastReading.metrics, lastUpdate: lastReading.timestamp }
                        : tank
                )
            );
        }
    }, [lastReading]);

    // Update alerts with real-time data
    useEffect(() => {
        if (lastAlert) {
            setAlerts(prev => {
                // Avoid duplicates
                if (prev.find(a => a.id === lastAlert.id)) return prev;
                return [lastAlert, ...prev];
            });
        }
    }, [lastAlert]);

    const stats = useMemo(() => {
        const critical = tanks.filter(t => t.status === 'critical').length;
        const warning = tanks.filter(t => t.status === 'warning').length;
        const online = tanks.filter(t => t.status === 'online').length;
        return { critical, warning, online, total: tanks.length };
    }, [tanks]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const exportToCSV = () => {
        const headers = ["Tank ID", "Name", "pH", "Turbidity", "Chlorine", "Status", "Last Cleaned"];
        const rows = tanks.map(t => [
            t.id, t.name, t.metrics.ph, t.metrics.turbidity, t.metrics.chlorine, t.status, t.lastCleaned
        ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AquaSentry_Report_${region.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        window.print(); // Simple PDF export via print to start
    };

    const exportTelemetry = () => {
        // Create comprehensive telemetry export
        const telemetryData = tanks.map(tank => ({
            'Tank ID': tank.id,
            'Tank Name': tank.name,
            'Location': tank.location?.address || 'N/A',
            'Ward': tank.name.split('-')[1] || 'N/A',
            'Status': tank.status,
            'pH Level': tank.metrics.ph,
            'Turbidity (NTU)': tank.metrics.turbidity,
            'Chlorine (mg/L)': tank.metrics.chlorine,
            'Temperature (°C)': tank.metrics.temperature || 'N/A',
            'Water Level (%)': tank.waterLevel || 'N/A',
            'Last Cleaned': tank.lastCleaned,
            'Last Update': tank.lastUpdate || new Date().toISOString(),
            'Capacity (L)': tank.capacity || 'N/A'
        }));

        const headers = Object.keys(telemetryData[0]);
        const csvRows = telemetryData.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                return typeof value === 'string' && value.includes(',')
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            }).join(',')
        );

        const csvContent = [
            headers.join(','),
            ...csvRows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `AquaSentry_Telemetry_${region.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tanks', label: 'All Tanks', icon: Droplets },
        { id: 'map', label: 'Map View', icon: MapIcon },
        { id: 'alerts', label: 'Alerts Hub', icon: Bell },
        { id: 'ai', label: 'AI Insights', icon: BrainCircuit },
        { id: 'report', label: 'Contamination', icon: AlertTriangle },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
        { id: 'vision', label: 'AI Vision', icon: Eye },
        { id: 'telemetry', label: 'Telemetry', icon: Radio },
        { id: 'logs', label: 'System Logs', icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarCollapsed ? 80 : 280 }}
                className="bg-[#0f172a] text-white flex flex-col z-30 shadow-2xl relative"
            >
                <div className="p-6 flex items-center justify-between">
                    {!isSidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="p-1.5 bg-cyan-500 rounded-lg">
                                <Droplets className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tighter">AquaSentry<span className="text-cyan-400">.AI</span></span>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors mx-auto"
                    >
                        {isSidebarCollapsed ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-cyan-400' : 'group-hover:scale-110 transition-transform'}`} />
                            {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 space-y-4">
                    <div className="px-4 py-4 bg-slate-800/50 rounded-2xl border border-white/5">
                        {!isSidebarCollapsed && (
                            <div className="mb-4">
                                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Quick Actions</p>
                                <button onClick={exportToCSV} className="w-full flex items-center gap-3 text-xs text-slate-300 hover:text-white mb-3">
                                    <Download className="w-3.5 h-3.5" /> Export Stats (CSV)
                                </button>
                                <button onClick={exportToPDF} className="w-full flex items-center gap-3 text-xs text-slate-300 hover:text-white">
                                    <FileJson className="w-3.5 h-3.5" /> Generate PDF Report
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all font-bold"
                        >
                            <LogOut className="w-5 h-5" />
                            {!isSidebarCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight">{activeTab.replace('_', ' ')} Overview</h2>
                        <p className="text-sm text-slate-500 font-medium">Monitoring <span className="text-cyan-600 font-black">{region}</span> • Live Feed Active</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tanks or assets..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <UserNotifications />
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">{user?.name}</p>
                                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter">Field Officer ({region})</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'dashboard' && (
                                <div className="space-y-8">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 bg-red-50 rounded-2xl text-red-600"><AlertTriangle className="w-6 h-6" /></div>
                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Immediate Action</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900">{stats.critical}</h3>
                                            <p className="text-sm text-slate-500 font-medium">Critical Threshold (pH/Turbidity)</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><Settings className="w-6 h-6" /></div>
                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Observation</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900">{stats.warning}</h3>
                                            <p className="text-sm text-slate-500 font-medium">Warning (Chlorine Levels)</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><CheckCircle2 className="w-6 h-6" /></div>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Operating</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900">{stats.online}</h3>
                                            <p className="text-sm text-slate-500 font-medium">Healthy Tanks (Standard)</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600"><Droplets className="w-6 h-6" /></div>
                                                <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">Inventory</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900">{stats.total}</h3>
                                            <p className="text-sm text-slate-500 font-medium">Total Managed Assets</p>
                                        </div>
                                    </div>

                                    {/* Charts Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-8">
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight">Water Quality Trends (24h)</h4>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div> pH
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Chlorine
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={generateSensorHistory(24)}>
                                                        <defs>
                                                            <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorChlorine" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis
                                                            dataKey="timeLabel"
                                                            fontSize={10}
                                                            tick={{ fill: '#94a3b8' }}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            interval={Math.floor(24 * 12 / 6)}
                                                        />
                                                        <YAxis
                                                            fontSize={10}
                                                            tick={{ fill: '#94a3b8' }}
                                                            tickLine={false}
                                                            axisLine={false}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                                            itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                                                        />
                                                        <Area type="monotone" dataKey="ph" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" />
                                                        <Area type="monotone" dataKey="chlorine" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorChlorine)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Status Distribution</h4>
                                            <div className="h-[300px] flex items-center justify-center">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Healthy', value: stats.online },
                                                                { name: 'Warning', value: stats.warning },
                                                                { name: 'Critical', value: stats.critical },
                                                            ]}
                                                            cx="50%" cy="50%"
                                                            innerRadius={80}
                                                            outerRadius={110}
                                                            paddingAngle={8}
                                                            dataKey="value"
                                                        >
                                                            <Cell fill="#10b981" />
                                                            <Cell fill="#f59e0b" />
                                                            <Cell fill="#ef4444" />
                                                        </Pie>
                                                        <Legend verticalAlign="bottom" height={36} />
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Turbidity Levels (Ward Comparison)</h4>
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={tanks.slice(0, 5).map(t => ({ name: t.name.split('-')[1], val: t.metrics.turbidity }))}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="name" fontSize={10} fontWeight="bold" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                        <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                        <Tooltip />
                                                        <Bar dataKey="val" fill="#0ea5e9" radius={[10, 10, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Live pH Monitoring (Key Assets)</h4>
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={generateSensorHistory(12)}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="timeLabel" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={Math.floor(12 * 12 / 4)} />
                                                        <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                        <Tooltip />
                                                        <Line type="stepAfter" dataKey="ph" stroke="#ef4444" strokeWidth={3} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tanks' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-6">
                                        <p className="text-slate-600 font-bold">Managed Assets in <span className="text-cyan-700">{region}</span></p>
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-colors">
                                                <Filter className="w-4 h-4" /> Filter
                                            </button>
                                            <button
                                                onClick={() => setIsRegisterModalOpen(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                                            >
                                                <PlusCircle className="w-4 h-4" /> Register Asset
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tanks.map((tank) => (
                                            <motion.div
                                                key={tank.id}
                                                whileHover={{ y: -5 }}
                                                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group cursor-pointer"
                                                onClick={() => navigate(`/tanks/${tank.id}`)}
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h5 className="font-black text-slate-900 text-lg">{tank.name}</h5>
                                                            <p className="text-xs text-slate-400 font-bold tracking-widest">{tank.id}</p>
                                                        </div>
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                                            tank.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                            }`}>
                                                            {tank.status}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-4 mb-8">
                                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                            <span className="text-slate-400">pH Level</span>
                                                            <span className={tank.metrics.ph > 8.5 ? 'text-red-500' : 'text-slate-900'}>{tank.metrics.ph}</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full bg-cyan-400 rounded-full`} style={{ width: `${(tank.metrics.ph / 14) * 100}%` }} />
                                                        </div>

                                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                            <span className="text-slate-400">Chlorine</span>
                                                            <span className="text-slate-900">{tank.metrics.chlorine} mg/L</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full bg-blue-500 rounded-full`} style={{ width: `${(tank.metrics.chlorine / 4) * 100}%` }} />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-400">Last Cleaned: {tank.lastCleaned}</span>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'map' && (
                                <div className="h-[calc(100vh-14rem)] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
                                    <UserTankMap tanks={tanks} />

                                    {/* Map Overlay Legend */}
                                    <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl z-[400] w-64">
                                        <h5 className="font-black text-slate-900 mb-4 text-sm tracking-tight italic">Salem Tank Status</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Critical Threshold</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Near Threshold</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Healthy Quality</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="text-[10px] text-slate-500 font-bold">Click any marker to view tank details</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'alerts' && (
                                <div className="max-w-4xl mx-auto space-y-4">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between mb-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-black text-slate-900">Alerts Hub (Live Feed)</h4>
                                                {isConnected && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold">
                                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                                        LIVE
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">System wide anomalies and quality triggers • {alerts.length} active alerts</p>
                                        </div>
                                        <button
                                            onClick={() => setAlerts([])}
                                            className="text-cyan-600 font-black text-sm hover:underline italic"
                                        >
                                            Clear all alerts
                                        </button>
                                    </div>
                                    {alerts.length === 0 ? (
                                        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                            <h5 className="text-lg font-black text-slate-900 mb-2">All Clear!</h5>
                                            <p className="text-sm text-slate-500 font-medium">No active alerts at this time. System is operating normally.</p>
                                        </div>
                                    ) : (
                                        alerts.map(alert => (
                                            <motion.div
                                                key={alert.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:border-slate-300 transition-all cursor-pointer group"
                                                onClick={() => navigate(`/tanks/${alert.tankId}`)}
                                            >
                                                <div className={`p-4 rounded-2xl ${alert.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-black text-slate-900">{alert.tankId}</span>
                                                        <span className="text-[10px] font-black uppercase text-slate-400">• {alert.time}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm font-medium">{alert.message}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-950 transition-colors" />
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'maintenance' && (
                                <div className="space-y-8">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 mb-1">Maintenance & Service</h4>
                                            <p className="text-sm text-slate-500 font-medium">Coordinate with system administrators for regional asset upkeep.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const maintenanceNotice = {
                                                    type: 'maintenance',
                                                    user: user?.name || 'Registered User',
                                                    email: user?.email || 'N/A',
                                                    maintenanceDetails: {
                                                        type: 'System Overhaul Request',
                                                        region: region,
                                                        priority: 'high'
                                                    },
                                                    timestamp: new Date().toISOString()
                                                };
                                                const existing = JSON.parse(localStorage.getItem('maintenanceNotifications') || '[]');
                                                existing.push(maintenanceNotice);
                                                localStorage.setItem('maintenanceNotifications', JSON.stringify(existing));
                                                alert('Regional maintenance request has been broadcasted to the Command Center.');
                                            }}
                                            className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-black hover:shadow-lg transition-all flex items-center gap-2"
                                        >
                                            <Wrench className="w-5 h-5" /> Request Maintenance Overhaul
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-[2/5rem] border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Asset ID</th>
                                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Resource Name</th>
                                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Last Service</th>
                                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Health Index</th>
                                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Next Audit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {tanks.map(tank => (
                                                    <tr key={tank.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-8 py-6 font-black text-slate-900 text-xs">{tank.id}</td>
                                                        <td className="px-8 py-6 font-bold text-slate-600 text-sm">{tank.name}</td>
                                                        <td className="px-8 py-6 font-bold text-slate-500 text-xs">{tank.lastCleaned}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                                                tank.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                                }`}>
                                                                {tank.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 font-bold text-cyan-600 text-xs italic">
                                                            {new Date(new Date(tank.lastCleaned).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Recent Resolutions Section */}
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mt-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Resolved Support Tickets</h4>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Verified</span>
                                        </div>

                                        <div className="space-y-4">
                                            {JSON.parse(localStorage.getItem('userNotifications') || '[]')
                                                .filter(n => n.type === 'issue_resolved')
                                                .slice(0, 5)
                                                .map((resolution, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-emerald-200 transition-all">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-black text-slate-900 mb-1">{resolution.message}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(resolution.timestamp).toLocaleString()}</p>
                                                        </div>
                                                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                            RESOLVED
                                                        </div>
                                                    </div>
                                                ))}

                                            {JSON.parse(localStorage.getItem('userNotifications') || '[]').filter(n => n.type === 'issue_resolved').length === 0 && (
                                                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                    <p className="text-xs font-bold text-slate-400 italic">No recently resolved issues to display.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ai' && (
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-r from-slate-900 to-cyan-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-black mb-2 flex items-center gap-3 underline decoration-cyan-500 underline-offset-8">
                                                <BrainCircuit className="w-10 h-10 text-cyan-400" /> AI Insights Engine
                                            </h3>
                                            <p className="text-slate-300 font-medium max-w-xl">
                                                Aggregated intelligence reports for Salem Region. The neural engine analyzes water quality vectors to predict contamination and system failures.
                                            </p>
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-red-50 rounded-2xl text-red-600"><AlertTriangle className="w-5 h-5" /></div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Contamination Risk Audit</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {tanks.filter(t => t.status === 'critical').map(t => (
                                                    <div key={t.id} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                                        <p className="font-bold text-red-800 text-xs mb-1">{t.name}</p>
                                                        <p className="text-xs text-red-600 font-medium">Neural engine detects a <strong>87% probability</strong> of bacterial growth due to sustained high turbidity levels.</p>
                                                    </div>
                                                ))}
                                                {tanks.filter(t => t.status === 'critical').length === 0 && (
                                                    <div className="p-8 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl border border-dashed">
                                                        No high-risk zones detected.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600"><CheckCircle2 className="w-5 h-5" /></div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Predictive Maintenance</h4>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="relative pl-6 border-l-2 border-cyan-500">
                                                    <p className="text-[10px] font-black text-cyan-600 uppercase mb-1">Upcoming Filter Change</p>
                                                    <p className="text-sm text-slate-600 font-bold">Tank TN-SA-1003 requires filter replacement in 4 days.</p>
                                                </div>
                                                <div className="relative pl-6 border-l-2 border-slate-200">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Scheduled Tank Wash</p>
                                                    <p className="text-sm text-slate-600 font-bold">2 Assets reaching the 90-day threshold for cleaning.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'report' && (
                                <div className="space-y-8">
                                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-4 bg-red-500 rounded-3xl text-white shadow-lg shadow-red-500/20"><AlertTriangle className="w-8 h-8" /></div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Contamination Triggers</h3>
                                                <p className="text-sm text-slate-500 font-medium italic">Emergency reporting and location-based contamination mapping</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {tanks.filter(t => t.status === 'critical' || t.status === 'warning').map(t => (
                                                <div key={t.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-500 transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h5 className="font-black text-slate-900">{t.name}</h5>
                                                        <span className={`w-3 h-3 rounded-full ${t.status === 'critical' ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`}></span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detected Anomalies</p>
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {t.metrics.ph > 8.5 && <span className="px-2 py-1 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase">pH Alert</span>}
                                                        {t.metrics.turbidity > 5 && <span className="px-2 py-1 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase">Turbidity Alert</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/tanks/${t.id}`)}
                                                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black group-hover:bg-red-600 transition-colors"
                                                    >
                                                        Initiate Emergency protocol
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'logs' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <h4 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">Global Telemetry Logs</h4>
                                        <div className="space-y-4">
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-20">09:4{i} AM</span>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                                    <p className="text-xs text-slate-600 font-bold flex-1 underline decoration-slate-200">
                                                        Telemetry successfully received for <span className="text-slate-900">TN-SA-100{i % 5}</span>. Heartbeat packet confirmed.
                                                    </p>
                                                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400 font-black">200 OK</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="max-w-2xl mx-auto space-y-8 p-4">
                                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full -translate-y-8 translate-x-8"></div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                            <Settings className="w-8 h-8 text-slate-400" /> Account Settings
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Identity Name</label>
                                                <input type="text" defaultValue={user?.name} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Designation</label>
                                                <input type="text" readOnly value={`Salem Field Office - ${region}`} className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400 cursor-not-allowed" />
                                            </div>
                                            <div className="pt-4 flex gap-4">
                                                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:shadow-2xl transition-all">Update Secure Identity</button>
                                                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50">Reset Key</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Sensor Threshold Configuration</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                                    <span className="text-xs font-black text-slate-500 uppercase">pH Safe Range</span>
                                                    <span className="text-sm font-black text-slate-900">6.5 - 8.5</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                                    <span className="text-xs font-black text-slate-500 uppercase">Chlorine Target</span>
                                                    <span className="text-sm font-black text-slate-900">0.5 - 2.0 mg/L</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                                    <span className="text-xs font-black text-slate-500 uppercase">Turbidity Limit</span>
                                                    <span className="text-sm font-black text-slate-900">&lt; 5.0 NTU</span>
                                                </div>
                                                <button className="w-full py-4 bg-cyan-100 text-cyan-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-200 transition-colors">
                                                    Calibrate Neural Thresholds
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Security Preferences</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">Two-Factor Authentication</p>
                                                    <p className="text-xs text-slate-500 font-medium">Add an extra layer of system security</p>
                                                </div>
                                                <div className="w-12 h-6 bg-cyan-500 rounded-full relative p-1 cursor-pointer">
                                                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">Critical Telemetry Alerts</p>
                                                    <p className="text-xs text-slate-500 font-medium">Notify on mobile via SMS and Push</p>
                                                </div>
                                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                                                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vision' && (
                                <div className="card-premium p-8">
                                    <VisionInspection userRole="user" />
                                </div>
                            )}

                            {activeTab === 'telemetry' && (
                                <TelemetryLogs userRole="user" userWards={tanks} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Register Asset Modal */}
            <RegisterAssetModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />
        </div>
    );
};

export default UserDashboard;
