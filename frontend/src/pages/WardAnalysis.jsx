import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Droplets, AlertTriangle, CheckCircle2, Activity,
    TrendingUp, TrendingDown, MapPin, Calendar, Wrench, Download
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const WardAnalysis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { ward, tanks } = location.state || {};

    const [selectedMetric, setSelectedMetric] = useState('ph');

    useEffect(() => {
        if (!ward) {
            navigate('/dashboard');
        }
    }, [ward, navigate]);

    if (!ward) return null;

    // Calculate ward statistics
    const wardStats = {
        totalTanks: tanks?.length || 0,
        critical: tanks?.filter(t => t.status === 'critical').length || 0,
        warning: tanks?.filter(t => t.status === 'warning').length || 0,
        online: tanks?.filter(t => t.status === 'online').length || 0,
        avgPh: tanks?.reduce((acc, t) => acc + parseFloat(t.metrics.ph), 0) / (tanks?.length || 1),
        avgTurbidity: tanks?.reduce((acc, t) => acc + parseFloat(t.metrics.turbidity), 0) / (tanks?.length || 1),
        avgChlorine: tanks?.reduce((acc, t) => acc + parseFloat(t.metrics.chlorine), 0) / (tanks?.length || 1)
    };

    const statusData = [
        { name: 'Healthy', value: wardStats.online, color: '#10b981' },
        { name: 'Warning', value: wardStats.warning, color: '#f59e0b' },
        { name: 'Critical', value: wardStats.critical, color: '#ef4444' }
    ];

    const tankMetricsData = tanks?.map(tank => ({
        name: tank.name.split('-')[2] || tank.id,
        ph: parseFloat(tank.metrics.ph),
        turbidity: parseFloat(tank.metrics.turbidity),
        chlorine: parseFloat(tank.metrics.chlorine)
    })) || [];

    const exportWardReport = () => {
        const csvData = tanks?.map(tank => ({
            'Ward': ward.name,
            'Tank ID': tank.id,
            'Tank Name': tank.name,
            'Status': tank.status,
            'pH': tank.metrics.ph,
            'Turbidity': tank.metrics.turbidity,
            'Chlorine': tank.metrics.chlorine,
            'Water Level': tank.waterLevel + '%',
            'Last Cleaned': tank.lastCleaned
        })) || [];

        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => headers.map(h => row[h]).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${ward.id}_Analysis_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-10">
            {/* Header */}
            <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between px-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200 group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{ward.name}</h1>
                            <div
                                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                                style={{ backgroundColor: ward.color }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Salem District • Comprehensive Ward Analysis
                        </p>
                    </div>
                </div>

                <button
                    onClick={exportWardReport}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:shadow-lg transition-all"
                >
                    <Download className="w-4 h-4" />
                    Export Ward Report
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600">
                                <Droplets className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{wardStats.totalTanks}</h3>
                        <p className="text-sm text-slate-500 font-medium">Total Tanks in Ward</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">URGENT</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{wardStats.critical}</h3>
                        <p className="text-sm text-slate-500 font-medium">Critical Alerts</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{wardStats.warning}</h3>
                        <p className="text-sm text-slate-500 font-medium">Warning Status</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{wardStats.online}</h3>
                        <p className="text-sm text-slate-500 font-medium">Healthy Tanks</p>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Status Distribution */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Ward Status Distribution</h4>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%" cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tank Metrics Comparison */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Tank Metrics Comparison</h4>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={tankMetricsData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" fontSize={10} fontWeight="bold" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey={selectedMetric} fill={ward.color} radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-2 mt-4 justify-center">
                            {['ph', 'turbidity', 'chlorine'].map(metric => (
                                <button
                                    key={metric}
                                    onClick={() => setSelectedMetric(metric)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${selectedMetric === metric
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {metric}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Average Metrics */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-8">
                    <h4 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Ward Average Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-cyan-50 rounded-3xl border border-cyan-100">
                            <p className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-2">Average pH Level</p>
                            <h3 className="text-4xl font-black text-cyan-900">{wardStats.avgPh.toFixed(2)}</h3>
                            <p className="text-xs text-cyan-600 font-medium mt-2">Within safe range (6.5-8.5)</p>
                        </div>
                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                            <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Average Turbidity</p>
                            <h3 className="text-4xl font-black text-amber-900">{wardStats.avgTurbidity.toFixed(2)} <span className="text-lg">NTU</span></h3>
                            <p className="text-xs text-amber-600 font-medium mt-2">Target: &lt; 5.0 NTU</p>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Average Chlorine</p>
                            <h3 className="text-4xl font-black text-blue-900">{wardStats.avgChlorine.toFixed(2)} <span className="text-lg">mg/L</span></h3>
                            <p className="text-xs text-blue-600 font-medium mt-2">Optimal: 0.5-2.0 mg/L</p>
                        </div>
                    </div>
                </div>

                {/* Tanks List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">All Tanks in {ward.name}</h4>
                        <span className="text-sm text-slate-500 font-bold">{wardStats.totalTanks} tanks</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {tanks?.map((tank) => (
                            <div
                                key={tank.id}
                                onClick={() => navigate(`/tanks/${tank.id}`)}
                                className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                            tank.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                        }`}>
                                        <Droplets className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-slate-900">{tank.name}</h5>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{tank.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 font-bold uppercase">pH: {tank.metrics.ph}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Turbidity: {tank.metrics.turbidity} NTU</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                            tank.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                        }`}>
                                        {tank.status}
                                    </span>
                                    <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all rotate-180" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WardAnalysis;
