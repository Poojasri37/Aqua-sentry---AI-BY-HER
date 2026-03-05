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
    Radio,
    Shield,
    Globe,
    Activity,
    Zap,
    Upload
} from 'lucide-react';
import LiveDataGlobe from '../../components/dashboard/LiveDataGlobe';
import DigitalTwin3D from '../../components/dashboard/DigitalTwin3D';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateTanksList, generateAlerts, generateSensorHistory, generateCoimbatoreAlerts } from '../../utils/mockData';
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
import ReportIssueModal from '../../components/dashboard/ReportIssueModal';
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
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedTankReport, setSelectedTankReport] = useState(null);
    const isPooja = user?.email === 'pooja@gmail.com' || user?.email === 'poojasrinirmalamanickam@gmail.com';

    // Hardware Feed Upload State
    const [hardwareImage, setHardwareImage] = useState("https://images.unsplash.com/photo-1621905251918-48416bd11040?q=80&w=2669&auto=format&fit=crop");
    const fileInputRef = React.useRef(null);

    const handleFeedUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHardwareImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchTanks = async () => {
            try {
                // Determine API URL (fallback to relative if not set)
                const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

                const response = await fetch(`${BASE_URL}/api/sensor/user-tanks`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('aquasentry_token')}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    // For Pooja, prioritize her real New Delhi data
                    if (isPooja) {
                        const tanksData = data.data.length > 0 ? data.data : generateTanksList(3, 'New Delhi');
                        const enhancedTanks = tanksData.map((t, idx) => ({
                            ...t,
                            location: {
                                address: 'Pragati Maidan, New Delhi, Delhi',
                                city: 'New Delhi',
                                district: 'New Delhi',
                                region: 'Pragati Maidan',
                                lat: 28.6139 + (idx * 0.002),
                                lng: 77.2090 + (idx * 0.002)
                            },
                            // Overwrite name to match region if it's generic
                            name: `Pragati Maidan Smart Tank ${idx + 1}`,
                            id: `TN-CB-200${idx + 1}`
                        }));
                        setTanks(enhancedTanks);
                        setRegion('Pragati Maidan, New Delhi');
                        setAlerts(generateCoimbatoreAlerts());
                    } else if (user?.email === 'deepthitheeran@gmail.com') {
                        // For Deepthi, show mock Salem data if she hasn't set up her ESP32 yet
                        if (data.data.length > 0) {
                            setTanks(data.data);
                            setRegion(data.data[0].location.city);
                        } else {
                            setTanks(generateTanksList(5, 'Salem'));
                            setRegion('Salem District');
                        }
                        setAlerts(generateAlerts());
                    } else {
                        setTanks(data.data.length > 0 ? data.data : generateTanksList(5, 'General'));
                        setAlerts(generateAlerts());
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching tanks:', error);
                if (isPooja) {
                    setTanks(generateTanksList(5, 'New Delhi').map((t, idx) => ({
                        ...t,
                        location: {
                            address: 'Pragati Maidan, New Delhi, Delhi',
                            city: 'New Delhi',
                            district: 'New Delhi',
                            region: 'Pragati Maidan',
                            lat: 28.6139 + (idx * 0.002),
                            lng: 77.2090 + (idx * 0.002)
                        },
                        name: `Pragati Maidan Smart Tank ${idx + 1}`,
                        id: `TN-CB-200${idx + 1}`
                    })));
                    setRegion('Pragati Maidan, New Delhi');
                } else {
                    setTanks(generateTanksList(5, 'Salem'));
                    setRegion('Salem District');
                }
                setIsLoading(false);
            }
        };

        fetchTanks();
    }, [user]);

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
        const critical = tanks.filter(t => t.status === 'critical' || (t.metrics?.ph > 8.5 || t.metrics?.turbidity > 5)).length;
        const warning = tanks.filter(t => t.status === 'warning' || (t.metrics?.chlorine > 1.5 || t.metrics?.ph > 8.2)).length;
        const online = tanks.filter(t => t.status === 'online' && t.metrics?.ph <= 8.2 && t.metrics?.turbidity <= 3).length;
        return { critical, warning, online, total: tanks.length };
    }, [tanks]);

    // Generate real-time alerts for Pooja
    useEffect(() => {
        if (isPooja && lastReading) {
            const newAlerts = [];
            if (parseFloat(lastReading.metrics.ph) > 8.5) {
                newAlerts.push({
                    id: `alt_ph_${Date.now()}`,
                    tankId: 'Pragati Maidan Smart Tank',
                    type: 'pH Critical',
                    severity: 'critical',
                    message: `pH level reached ${lastReading.metrics.ph} in Pragati Maidan`,
                    time: 'Just now'
                });
            }
            if (parseFloat(lastReading.metrics.turbidity) > 5) {
                newAlerts.push({
                    id: `alt_turb_${Date.now()}`,
                    tankId: 'Pragati Maidan Smart Tank',
                    type: 'High Turbidity',
                    severity: 'critical',
                    message: `Turbidity exceeded 5 NTU in Pragati Maidan`,
                    time: 'Just now'
                });
            }
            if (newAlerts.length > 0) {
                setAlerts(prev => {
                    const filtered = prev.filter(a => !a.id.includes('alt_')); // Remove old real-time ones
                    return [...newAlerts, ...filtered].slice(0, 10);
                });
            }
        }
    }, [lastReading, user]);

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

    const menuItems = useMemo(() => {
        const items = [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'tanks', label: 'All Tanks', icon: Droplets },
            { id: 'map', label: 'Map View', icon: MapIcon },
            { id: 'alerts', label: 'Alerts Hub', icon: Bell },
            { id: 'ai', label: 'AI Insights', icon: BrainCircuit },
            { id: 'report', label: 'Contamination', icon: AlertTriangle },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'vision', label: 'AI Vision', icon: Eye },
            { id: 'digital_twin', label: 'Digital Twin (3D)', icon: Globe },
            { id: 'telemetry', label: 'Telemetry', icon: Radio },
            { id: 'logs', label: 'System Logs', icon: FileText },
        ];

        if (user?.role === 'admin') {
            items.push({ id: 'admin_panel', label: 'Admin Panel', icon: Shield, action: () => navigate('/admin/dashboard') });
        }
        return items;
    }, [user, navigate]);

    // History of real-time readings for charts
    const [realTimeHistory, setRealTimeHistory] = useState([]);

    useEffect(() => {
        if (isPooja) {
            setRealTimeHistory(generateSensorHistory(24).map(h => ({
                timeLabel: h.timeLabel,
                ph: h.ph,
                chlorine: h.chlorine,
                turbidity: h.turbidity,
                temperature: h.temperature,
                wqi: 90
            })));
        }
    }, [isPooja]);

    useEffect(() => {
        if (lastReading && isPooja) {
            setRealTimeHistory(prev => {
                const newEntry = {
                    timeLabel: new Date(lastReading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    ph: parseFloat(lastReading.metrics.ph),
                    chlorine: parseFloat(lastReading.metrics.chlorine),
                    turbidity: parseFloat(lastReading.metrics.turbidity),
                    temperature: parseFloat(lastReading.metrics.temperature),
                    wqi: parseInt(lastReading.metrics.wqi)
                };
                const updated = [...prev, newEntry].slice(-24); // Keep last 24 readings
                return updated;
            });
        }
    }, [lastReading, user]);

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

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.action ? item.action() : setActiveTab(item.id)}
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
                                    {/* Live Sensor Data - Added for Continuous Updates */}
                                    {lastReading && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h2 className="text-3xl font-black italic tracking-tighter">Live Resource Feed</h2>
                                                        <p className="text-cyan-100 font-bold uppercase text-[10px] tracking-widest mt-1">Real-time Stream: {lastReading.tankName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                                            SYNCHRONIZED
                                                        </div>
                                                        <Radio className="w-6 h-6 animate-pulse text-cyan-300" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-cyan-200 uppercase mb-1">pH Level</p>
                                                        <p className="text-2xl font-black">{lastReading.metrics?.ph}</p>
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-cyan-200 uppercase mb-1">Turbidity</p>
                                                        <p className="text-2xl font-black">{parseFloat(lastReading.metrics?.turbidity).toFixed(1)}</p>
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-cyan-200 uppercase mb-1">Chlorine</p>
                                                        <p className="text-2xl font-black">{parseFloat(lastReading.metrics?.chlorine).toFixed(2)}</p>
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-cyan-200 uppercase mb-1">Temp</p>
                                                        <p className="text-2xl font-black">{lastReading.metrics?.temperature}°C</p>
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-cyan-200 uppercase mb-1">WQI</p>
                                                        <p className="text-2xl font-black text-cyan-300">{lastReading.metrics?.wqi}</p>
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                                        <p className="text-[10px] font-black text-cyan-200 uppercase mb-1">Status</p>
                                                        <p className="text-sm font-black uppercase text-emerald-400">{lastReading.metrics?.quality_status}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div className="flex items-center gap-2">
                                                        <MapIcon className="w-4 h-4 text-cyan-300" />
                                                        <span className="text-xs font-bold text-cyan-100">{lastReading.location?.city}, {lastReading.location?.region}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-cyan-300 tracking-widest">LAST SYNC: {new Date(lastReading.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

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
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight">Water Quality Trends (Real-Time)</h4>
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
                                                    <AreaChart data={isPooja ? realTimeHistory : generateSensorHistory(24)}>
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
                                                                { name: 'Healthy', value: isPooja ? (lastReading?.metrics?.quality_status === 'Excellent' || lastReading?.metrics?.quality_status === 'Good' ? 1 : 0) : stats.online },
                                                                { name: 'Warning', value: isPooja ? (lastReading?.metrics?.quality_status === 'Medium' ? 1 : 0) : stats.warning },
                                                                { name: 'Critical', value: isPooja ? (lastReading?.metrics?.quality_status === 'Bad' || lastReading?.metrics?.quality_status === 'Very Bad' ? 1 : 0) : stats.critical },
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
                                            <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Real-Time Turbidity Tracking</h4>
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={isPooja ? realTimeHistory.slice(-10) : generateSensorHistory(10)}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="timeLabel" fontSize={10} fontWeight="bold" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                        <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                        <Tooltip />
                                                        <Bar dataKey="turbidity" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {
                                activeTab === 'tanks' && (
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
                                                                <span className="text-slate-900">{parseFloat(tank.metrics.chlorine).toFixed(2)} mg/L</span>
                                                            </div>
                                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className={`h-full bg-blue-500 rounded-full`} style={{ width: `${(tank.metrics.chlorine / 2) * 100}%` }} />
                                                            </div>

                                                            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 mt-4">
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Quality Index</p>
                                                                    <p className="text-lg font-black text-cyan-600">{tank.metrics.wqi}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Rating</p>
                                                                    <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${tank.metrics.quality_status === 'Excellent' ? 'bg-green-100 text-green-700' :
                                                                        tank.metrics.quality_status === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                                            tank.metrics.quality_status === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-red-100 text-red-700'
                                                                        }`}>
                                                                        {tank.metrics.quality_status}
                                                                    </p>
                                                                </div>
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
                                )
                            }

                            {
                                activeTab === 'map' && (
                                    <div className="h-[calc(100vh-14rem)] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
                                        <UserTankMap tanks={tanks} />

                                        <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl z-[400] w-64">
                                            <h5 className="font-black text-slate-900 mb-4 text-sm tracking-tight italic">{isPooja ? 'New Delhi' : 'Salem'} Tank Status</h5>
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
                                )
                            }

                            {
                                activeTab === 'alerts' && (
                                    <div className="max-w-4xl mx-auto space-y-4">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between mb-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-xl font-black text-slate-900">{isPooja ? 'New Delhi Alerts Hub' : 'Alerts Hub (Live Feed)'}</h4>
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
                                )
                            }

                            {
                                activeTab === 'digital_twin' && (
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Left Panel: Stats/Info */}
                                                <div className="lg:col-span-1 space-y-6 z-10">
                                                    <div>
                                                        <h2 className="text-3xl font-black text-white italic tracking-tight mb-2">Digital Twin Node</h2>
                                                        <p className="text-cyan-400 font-mono text-sm">LIVE HARDWARE SYNCHRONIZATION</p>
                                                    </div>

                                                    <div className="p-6 bg-black/40 rounded-3xl border border-white/10 backdrop-blur-md">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="p-3 bg-cyan-500/20 rounded-xl">
                                                                <Activity className="w-6 h-6 text-cyan-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-slate-400 uppercase font-black">System Status</div>
                                                                <div className="text-xl font-bold text-white">Online</div>
                                                            </div>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 bg-black/40 rounded-3xl border border-white/10 backdrop-blur-md">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="p-3 bg-amber-500/20 rounded-xl">
                                                                <Activity className="w-6 h-6 text-amber-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-slate-400 uppercase font-black">Microplastics</div>
                                                                <div className="text-xl font-bold text-white">
                                                                    {((parseFloat(lastReading?.metrics?.turbidity || 2.5)) * 12).toFixed(0)} <span className="text-xs text-slate-500">particles/ml</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between text-xs font-mono text-slate-400">
                                                                <span>OPTICAL SCAN</span>
                                                                <span className={(parseFloat(lastReading?.metrics?.turbidity || 2.5)) > 5 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                                                                    {(parseFloat(lastReading?.metrics?.turbidity || 2.5)) > 5 ? 'CONTAMINATION DETECTED' : 'CLEAR'}
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                                <div className="h-full bg-amber-500 animate-pulse" style={{ width: `${Math.min(100, (parseFloat(lastReading?.metrics?.turbidity || 2.5)) * 10)}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Middle Panel: Real Feed */}
                                                <div className="lg:col-span-1 relative h-[500px] rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl bg-black group">
                                                    <div className="absolute top-6 left-6 z-10 bg-red-500/10 backdrop-blur-md px-4 py-2 rounded-xl border border-red-500/20 flex items-center gap-3">
                                                        <div className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                        </div>
                                                        <span className="text-xs font-black text-red-400 tracking-widest">LIVE CAMERA FEED</span>
                                                    </div>

                                                    {/* Upload/Replace Button - Always Visible */}
                                                    <div className="absolute top-6 right-6 z-20 opacity-100 transition-opacity">
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleFeedUpload}
                                                        />
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="bg-slate-900/80 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg border border-white/20 transition-all flex items-center gap-2 text-xs font-bold backdrop-blur-md shadow-lg cursor-pointer"
                                                        >
                                                            <Upload className="w-3 h-3" /> REPLACE IMAGE
                                                        </button>
                                                    </div>

                                                    {/* Real Image Feed */}
                                                    <img
                                                        src={hardwareImage}
                                                        alt="Real Tank Feed"
                                                        className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
                                                    />

                                                    {/* AI Scanning Overlay (Wow Factor) */}
                                                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                                                        {/* Animated Scan Line */}
                                                        <motion.div
                                                            className="absolute left-0 w-full h-1 bg-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,1)]"
                                                            animate={{ top: ['0%', '100%', '0%'] }}
                                                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            <div className="absolute w-full h-24 -mt-24 bg-gradient-to-t from-cyan-500/20 to-transparent" />
                                                        </motion.div>

                                                        {/* Tech Corners */}
                                                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
                                                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
                                                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
                                                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />

                                                        {/* Status Badge */}
                                                        <div className="absolute bottom-6 right-6 bg-cyan-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                                                            <span className="text-[10px] font-black text-cyan-400 tracking-wider">AI VISION ACTIVE</span>
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                                        <p className="text-slate-300 text-xs font-mono">Location: Sector 4-A • Cam-01</p>
                                                    </div>
                                                </div>

                                                {/* Right Panel: Digital Twin */}
                                                <div className="lg:col-span-1 relative h-[500px]">
                                                    <div className="absolute top-6 left-6 z-10 bg-cyan-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/30 flex items-center gap-3 shadow-lg">
                                                        <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                                                        <span className="text-xs font-black text-cyan-400 tracking-widest">DIGITAL TWIN REPLICATION</span>
                                                    </div>

                                                    <DigitalTwin3D
                                                        sensorData={{
                                                            level: parseFloat(lastReading?.metrics?.level || 78),
                                                            turbidity: parseFloat(lastReading?.metrics?.turbidity || 2.5),
                                                            ph: parseFloat(lastReading?.metrics?.ph || 7.2),
                                                            temp: parseFloat(lastReading?.metrics?.temperature || 26)
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Government Welfare & Impact Section - NEW */}
                                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                                                {/* 1. Compliance Badge */}
                                                <div className="bg-slate-900/50 border border-emerald-500/30 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                                                    <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                                                        <Shield className="w-8 h-8 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-emerald-400 font-black text-xs tracking-widest uppercase mb-1">Safety Standard</h3>
                                                        <p className="text-white font-bold text-lg">ISO 10500:2012</p>
                                                        <p className="text-emerald-500/70 text-[10px] font-mono mt-1 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> GOVT. STANDARDS MET
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 2. Beneficiary Impact */}
                                                <div className="bg-slate-900/50 border border-blue-500/30 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                                                    <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50">
                                                        <Users className="w-8 h-8 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-blue-400 font-black text-xs tracking-widest uppercase mb-1">Public Welfare</h3>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-white font-bold text-2xl">1,248</span>
                                                            <span className="text-slate-400 text-xs">Families Served</span>
                                                        </div>
                                                        <p className="text-blue-400/70 text-[10px] font-mono mt-1">↑ 12% EXPANSION</p>
                                                    </div>
                                                </div>

                                                {/* 3. Distribution Status */}
                                                <div className="bg-slate-900/50 border border-amber-500/30 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                                                    <div className="h-16 w-16 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
                                                        <Activity className="w-8 h-8 text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-amber-400 font-black text-xs tracking-widest uppercase mb-1">Distribution Grid</h3>
                                                        <p className="text-white font-bold text-lg">Online - 98% Flow</p>
                                                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                            <div className="h-full bg-amber-500 w-[98%] animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'maintenance' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                                <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Water Quality Trends (Real-Time)</h4>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={realTimeHistory.length > 0 ? realTimeHistory : generateSensorHistory(24)}>
                                                            <defs>
                                                                <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                            <XAxis dataKey="timeLabel" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                            <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                            <Tooltip />
                                                            <Area type="monotone" dataKey="ph" stroke="#06b6d4" fillOpacity={1} fill="url(#colorMaint)" strokeWidth={3} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white flex flex-col justify-center">
                                                <h4 className="text-xl font-black mb-4">{isPooja ? 'Peelamedu Maintenance Grid' : 'Maintenance Status'}</h4>
                                                <p className="text-slate-400 text-sm mb-6">{isPooja ? 'Live status for Avinashi Road sectors.' : 'Regional health status for all assets.'}</p>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                        <span className="text-xs font-bold text-slate-400">System Uptime</span>
                                                        <span className="text-emerald-400 font-black">99.9%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                        <span className="text-xs font-bold text-slate-400">Active Sensors</span>
                                                        <span className="font-black">{tanks.length} / {tanks.length}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-xs font-bold text-slate-400">Next Audit</span>
                                                        <span className="text-cyan-400 font-black">{isPooja ? 'Tomorrow, 10 AM' : '12 Days'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

                                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
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
                                                                {(() => {
                                                                    try {
                                                                        const last = tank.lastCleaned ? new Date(tank.lastCleaned) : new Date();
                                                                        if (isNaN(last.getTime())) return 'N/A';
                                                                        const nextDate = new Date(last.getTime() + 90 * 24 * 60 * 60 * 1000);
                                                                        return nextDate.toISOString().split('T')[0];
                                                                    } catch (e) {
                                                                        return 'N/A';
                                                                    }
                                                                })()}
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
                                )
                            }

                            {
                                activeTab === 'ai' && (
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-r from-slate-900 to-cyan-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-3xl font-black mb-2 flex items-center gap-3 underline decoration-cyan-500 underline-offset-8">
                                                    <BrainCircuit className="w-10 h-10 text-cyan-400" /> AI Insights Engine
                                                </h3>
                                                <p className="text-slate-300 font-medium max-w-xl">
                                                    Aggregated intelligence reports for <span className="text-cyan-400 font-black">{region}</span>. The neural engine analyzes real-time water quality vectors for precise health predictions.
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
                                                    {isPooja && lastReading ? (
                                                        <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                                            <p className="font-bold text-red-800 text-xs mb-1">Live New Delhi Sensor Audit</p>
                                                            <p className="text-xs text-red-600 font-medium">
                                                                Currently monitoring {lastReading.tankName}.
                                                                {parseFloat(lastReading.metrics.ph) > 8.5 || parseFloat(lastReading.metrics.turbidity) > 5 ?
                                                                    ` Neural engine detects a high probability of bacterial growth due to sustained anomalies (pH: ${lastReading.metrics.ph}, Turbidity: ${lastReading.metrics.turbidity}).` :
                                                                    " Real-time data suggests stable microbial conditions. No high-risk zones detected in your area."}
                                                            </p>
                                                        </div>
                                                    ) : tanks.filter(t => t.status === 'critical').map(t => (
                                                        <div key={t.id} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                                            <p className="font-bold text-red-800 text-xs mb-1">{t.name}</p>
                                                            <p className="text-xs text-red-600 font-medium">Neural engine detects a <strong>87% probability</strong> of bacterial growth due to sustained high turbidity levels.</p>
                                                        </div>
                                                    ))}
                                                    {(!isPooja || !lastReading) && tanks.filter(t => t.status === 'critical').length === 0 && (
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
                                                    {isPooja && lastReading ? (
                                                        <div className="relative pl-6 border-l-2 border-cyan-500">
                                                            <p className="text-[10px] font-black text-cyan-600 uppercase mb-1">Live Sensor Prediction</p>
                                                            <p className="text-sm text-slate-600 font-bold">
                                                                Based on {lastReading.metrics.wqi} quality score, your Avinashi Road resource requires inspection in approximately 12 days.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="relative pl-6 border-l-2 border-cyan-500">
                                                                <p className="text-[10px] font-black text-cyan-600 uppercase mb-1">Upcoming Filter Change</p>
                                                                <p className="text-sm text-slate-600 font-bold">Tank TN-SA-1003 requires filter replacement in 4 days.</p>
                                                            </div>
                                                            <div className="relative pl-6 border-l-2 border-slate-200">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Scheduled Tank Wash</p>
                                                                <p className="text-sm text-slate-600 font-bold">2 Assets reaching the 90-day threshold for cleaning.</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'report' && (
                                    <div className="space-y-8">
                                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-4 bg-red-500 rounded-3xl text-white shadow-lg shadow-red-500/20"><AlertTriangle className="w-8 h-8" /></div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Contamination Triggers</h3>
                                                        <p className="text-sm text-slate-500 font-medium italic">Emergency reporting for {region}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTankReport(tanks[0]);
                                                        setIsReportModalOpen(true);
                                                    }}
                                                    className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                                                >
                                                    Report New Issue
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {isPooja && lastReading ? (
                                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-500 transition-all group">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h5 className="font-black text-slate-900">Peelamedu Smart Tank</h5>
                                                            <span className={`w-3 h-3 rounded-full ${parseFloat(lastReading.metrics.ph) > 8.5 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detected Anomalies</p>
                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            {parseFloat(lastReading.metrics.ph) > 8.5 && <span className="px-2 py-1 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase">pH Alert ({lastReading.metrics.ph})</span>}
                                                            {parseFloat(lastReading.metrics.turbidity) > 5 && <span className="px-2 py-1 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase">Turbidity Alert ({lastReading.metrics.turbidity})</span>}
                                                            {parseFloat(lastReading.metrics.wqi) < 50 && <span className="px-2 py-1 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase">Critical WQI</span>}
                                                        </div>
                                                        <button
                                                            onClick={() => navigate(`/user/dashboard`)}
                                                            className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black group-hover:bg-red-600 transition-colors"
                                                        >
                                                            Monitor Live Stream
                                                        </button>
                                                    </div>
                                                ) : (
                                                    tanks.filter(t => t.status === 'critical' || t.status === 'warning').map(t => (
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
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'logs' && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                            <h4 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">Global Telemetry Logs</h4>
                                            <div className="space-y-4">
                                                {[...Array(8)].map((_, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-20">09:4{i} AM</span>
                                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                                        <p className="text-xs text-slate-600 font-bold flex-1 underline decoration-slate-200">
                                                            Telemetry successfully received for <span className="text-slate-900">{isPooja ? `TN-CB-200${i % 5}` : `TN-SA-100${i % 5}`}</span>. Heartbeat packet confirmed.
                                                        </p>
                                                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400 font-black">200 OK</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'settings' && (
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
                                                    <input type="text" readOnly value={`${isPooja ? 'New Delhi' : 'Salem'} Field Office - ${region}`} className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400 cursor-not-allowed" />
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
                                )
                            }

                            {
                                activeTab === 'vision' && (
                                    <div className="card-premium p-8">
                                        <VisionInspection userRole="user" />
                                    </div>
                                )
                            }

                            {
                                activeTab === 'telemetry' && (
                                    <div className="card-premium p-8">
                                        <TelemetryLogs userRole="user" userWards={tanks} />
                                    </div>
                                )
                            }
                        </motion.div>
                    </AnimatePresence>
                </div >
            </main >

            {/* Register Asset Modal */}
            < RegisterAssetModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />

            {/* Report Issue Modal */}
            <ReportIssueModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                tank={selectedTankReport}
            />
        </div >
    );
};

export default UserDashboard;
