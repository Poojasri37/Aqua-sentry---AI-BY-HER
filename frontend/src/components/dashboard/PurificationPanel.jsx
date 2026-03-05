import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Droplets, Leaf, Timer, CheckCircle2, AlertTriangle, XCircle,
    Play, Square, RefreshCw, ChevronRight, Zap, Activity, Beaker
} from 'lucide-react';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

const METHOD_ICONS = {
    activated_carbon_biochar: '🪨',
    mineral_filtration: '💎',
    biosand_filtration: '🏖️',
    ceramic_microfiltration: '🏺',
    moringa_coagulation: '🌿',
    solar_uv_disinfection: '☀️'
};

const METHOD_COLORS = {
    activated_carbon_biochar: { bg: 'from-slate-600 to-slate-800', light: 'bg-slate-50 text-slate-700 border-slate-200' },
    mineral_filtration: { bg: 'from-purple-500 to-indigo-600', light: 'bg-purple-50 text-purple-700 border-purple-200' },
    biosand_filtration: { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-50 text-amber-700 border-amber-200' },
    ceramic_microfiltration: { bg: 'from-rose-500 to-pink-600', light: 'bg-rose-50 text-rose-700 border-rose-200' },
    moringa_coagulation: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    solar_uv_disinfection: { bg: 'from-yellow-400 to-orange-500', light: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
};

const PurificationPanel = ({ userRole = 'user', tanks = [] }) => {
    const [methods, setMethods] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeView, setActiveView] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);
    const [triggering, setTriggering] = useState(false);
    const [activePurification, setActivePurification] = useState(null);
    const [selectedTankId, setSelectedTankId] = useState('');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchMethods();
        fetchStats();
        fetchActive();
    }, []);

    useEffect(() => {
        if (activeView === 'history') {
            fetchHistory();
        }
    }, [activeView, selectedTankId]);

    useEffect(() => {
        if (tanks.length > 0 && !selectedTankId) {
            setSelectedTankId(tanks[0]?.id || tanks[0]?._id || '');
        }
    }, [tanks]);

    const fetchMethods = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/purification/methods`);
            const data = await res.json();
            if (data.success) setMethods(data.methods);
        } catch (err) {
            console.error('Error fetching methods:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('aquasentry_token');
            const res = await fetch(`${BASE_URL}/api/purification/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setStats(data.stats);
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchActive = async () => {
        try {
            const token = localStorage.getItem('aquasentry_token');
            // If we have a selected tank, check for that
            const id = selectedTankId || (tanks.length > 0 ? (tanks[0]?.id || tanks[0]?._id) : null);
            if (!id) return;

            const res = await fetch(`${BASE_URL}/api/purification/active/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.active) {
                setActivePurification(data.event);
            }
        } catch (err) {
            console.error('Error fetching active:', err);
        }
    };

    const fetchHistory = async () => {
        const id = selectedTankId || (tanks.length > 0 ? (tanks[0]?.id || tanks[0]?._id) : null);
        if (!id) return;

        setHistoryLoading(true);
        try {
            const token = localStorage.getItem('aquasentry_token');
            const res = await fetch(`${BASE_URL}/api/purification/history/${id}?limit=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setHistory(data.data);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const simulateRecommendation = async () => {
        setSimulating(true);
        try {
            const res = await fetch(`${BASE_URL}/api/purification/recommend?contaminationType=multi_parameter&turbidity=2500&ph=5.5&tds=800&microplasticLevel=40`);
            const data = await res.json();
            if (data.success) setSimulationResult(data.recommendation);
        } catch (err) {
            console.error('Error simulating:', err);
        } finally {
            setSimulating(false);
        }
    };

    const triggerPurification = async (methodId = null) => {
        if (!selectedTankId) return;
        setTriggering(true);

        try {
            let selectedMethod = methodId;
            let currentSnapshot = simulationResult?.sensorSnapshot || { ph: 5.5, turbidity: 2500, tds: 800, microplasticLevel: 40 };

            // Step 1: Recommend if not provided (Integrated AI Recommendation)
            if (!selectedMethod) {
                const recRes = await fetch(`${BASE_URL}/api/purification/recommend?contaminationType=multi_parameter&ph=${currentSnapshot.ph}&turbidity=${currentSnapshot.turbidity}&tds=${currentSnapshot.tds}&microplasticLevel=${currentSnapshot.microplasticLevel}`);
                const recData = await recRes.json();
                if (recData.success) {
                    selectedMethod = recData.recommendation.method;
                    setSimulationResult(recData.recommendation);
                }
            }

            const token = localStorage.getItem('aquasentry_token');
            // Step 2: Trigger Purification
            const res = await fetch(`${BASE_URL}/api/purification/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tankId: selectedTankId,
                    contaminationType: simulationResult?.contaminationType || 'multi_parameter',
                    sensorSnapshot: currentSnapshot,
                    method: selectedMethod
                })
            });
            const data = await res.json();
            if (data.success) {
                const event = data.event || data.purificationEvent;
                setActivePurification(event);
                fetchStats();

                // Step 3: Notify Admin (localStorage persist for mockup)
                const adminNotifs = JSON.parse(localStorage.getItem('purificationNotifications') || '[]');
                const selectedTank = tanks.find(t => (t.id || t._id) === selectedTankId);
                adminNotifs.unshift({
                    type: 'purification',
                    user: 'System/AI',
                    email: 'ai@aquasentry.vision',
                    tankName: selectedTank?.name || 'Smart Tank',
                    message: `Purification triggered for ${selectedTank?.name || 'Tank'}. Method: ${event.purificationMethodDetails?.displayName || event.purificationMethod}`,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('purificationNotifications', JSON.stringify(adminNotifs.slice(0, 50)));
            }
        } catch (err) {
            console.error('Error triggering purification:', err);
        } finally {
            setTriggering(false);
        }
    };

    const stopPurification = async (eventId) => {
        try {
            const token = localStorage.getItem('aquasentry_token');
            const res = await fetch(`${BASE_URL}/api/purification/stop/${eventId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setActivePurification(null);
                fetchStats();
            }
        } catch (err) {
            console.error('Error stopping:', err);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/10 blur-[80px] rounded-full"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Natural Purification Control</h2>
                            </div>
                            <p className="text-emerald-100 font-medium text-sm">AI-powered natural water purification monitoring and control system</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={simulateRecommendation}
                                disabled={simulating}
                                className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold hover:bg-white/30 transition-all border border-white/10 flex items-center gap-2"
                            >
                                <Beaker className="w-4 h-4" />
                                {simulating ? 'Analyzing...' : 'Simulate Detection'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <p className="text-[10px] font-black text-emerald-200 uppercase mb-1 tracking-widest">Total Events</p>
                            <p className="text-3xl font-black">{stats?.totalEvents || 0}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <p className="text-[10px] font-black text-emerald-200 uppercase mb-1 tracking-widest">Active Now</p>
                            <p className="text-3xl font-black text-yellow-300">{stats?.activeEvents || 0}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <p className="text-[10px] font-black text-emerald-200 uppercase mb-1 tracking-widest">Recovery Rate</p>
                            <p className="text-3xl font-black text-emerald-300">{stats?.recoveryRate || 0}%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <p className="text-[10px] font-black text-emerald-200 uppercase mb-1 tracking-widest">Avg Duration</p>
                            <p className="text-3xl font-black">{stats?.averageDurationMinutes || 0}<span className="text-base ml-1">min</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation Result */}
            <AnimatePresence>
                {simulationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-3xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{METHOD_ICONS[simulationResult.method]}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-black text-slate-900">AI Recommendation</h3>
                                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-black">
                                        {simulationResult.confidenceScore}% Confidence
                                    </span>
                                </div>
                                <p className="text-xl font-bold text-teal-700 mb-1">{simulationResult.details.displayName}</p>
                                <p className="text-sm text-slate-600 mb-3">{simulationResult.details.description}</p>
                                <div className="flex gap-4 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {simulationResult.estimatedDuration} min</span>
                                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {simulationResult.details.estimatedEfficiency}% efficiency</span>
                                </div>
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {simulationResult.details.targetContaminants.map((c, i) => (
                                        <span key={i} className="px-2 py-1 bg-white rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200">
                                            {c.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setSimulationResult(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-4 pt-4 border-t border-teal-200">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => triggerPurification(simulationResult.method)}
                                disabled={triggering || !selectedTankId}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Play className="w-4 h-4" />
                                {triggering ? 'Initiating...' : 'Trigger Maintenance Using This Method'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Purification Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Trigger Purification</h3>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedTankId}
                        onChange={(e) => setSelectedTankId(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                    >
                        {tanks.length > 0 ? tanks.map(t => (
                            <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                        )) : (
                            <option value="">Peelamedu Smart Tank 1</option>
                        )}
                    </select>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={triggerPurification}
                        disabled={triggering}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Play className="w-4 h-4" />
                        {triggering ? 'Starting...' : 'Start Purification'}
                    </motion.button>
                </div>
            </div>

            {/* Active Purification Status */}
            <AnimatePresence>
                {activePurification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <h3 className="text-lg font-black text-emerald-800">Purification In Progress</h3>
                            </div>
                            <button
                                onClick={() => stopPurification(activePurification._id)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase hover:bg-red-100 border border-red-200 flex items-center gap-2 transition-all"
                            >
                                <Square className="w-3 h-3" /> Stop
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-700">
                                    {METHOD_ICONS[activePurification.method]} {activePurification.methodDetails?.displayName || activePurification.method?.replace(/_/g, ' ')}
                                </span>
                                <span className="font-black text-emerald-600">{activePurification.progress || 0}%</span>
                            </div>
                            <div className="h-4 bg-white rounded-full overflow-hidden border border-emerald-200">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${activePurification.progress || 15}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                />
                            </div>
                        </div>
                        <div className="flex gap-6 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> Est. {activePurification.estimatedDuration || 120} min</span>
                            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Status: {activePurification.status || 'in_progress'}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm w-fit">
                {['overview', 'methods', 'history'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveView(tab)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeView === tab
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                            : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Methods Grid */}
            {activeView === 'methods' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {methods.map((method, idx) => {
                        const colors = METHOD_COLORS[method.id] || { bg: 'from-gray-500 to-gray-700', light: 'bg-gray-50 text-gray-700 border-gray-200' };
                        return (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group"
                            >
                                <div className={`bg-gradient-to-br ${colors.bg} p-6 text-white`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-3xl">{METHOD_ICONS[method.id]}</span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black">
                                            {method.estimatedEfficiency}% Efficiency
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black mb-1">{method.displayName}</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{method.description}</p>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                                        <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {method.estimatedDuration} min</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {method.targetContaminants.map((c, i) => (
                                            <span key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${colors.light}`}>
                                                {c.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Overview */}
            {activeView === 'overview' && (
                <div className="space-y-6">
                    {/* Method Usage Distribution */}
                    {stats?.methodDistribution?.length > 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                            <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Method Usage Distribution</h3>
                            <div className="space-y-4">
                                {stats.methodDistribution.map((m, idx) => {
                                    const total = stats.totalEvents || 1;
                                    const percent = Math.round((m.count / total) * 100);
                                    return (
                                        <div key={idx} className="flex items-center gap-4">
                                            <span className="text-2xl w-10">{METHOD_ICONS[m.method] || '🧪'}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-bold text-slate-700">{m.displayName}</span>
                                                    <span className="text-xs font-black text-slate-400">{m.count} uses ({percent}%)</span>
                                                </div>
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                        transition={{ delay: idx * 0.15, duration: 0.8, ease: 'easeOut' }}
                                                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Leaf className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">No Purification Events Yet</h3>
                            <p className="text-sm text-slate-500 max-w-md mx-auto">
                                The system will automatically trigger natural purification when contamination is detected.
                                Click "Simulate Detection" above to see the AI recommendation engine in action.
                            </p>
                        </div>
                    )}

                    {/* System Flow */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                        <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Purification Pipeline Flow</h3>
                        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2">
                            {[
                                { icon: AlertTriangle, label: 'Contamination Detected', color: 'bg-red-50 text-red-600 border-red-200' },
                                { icon: Beaker, label: 'AI Method Selection', color: 'bg-purple-50 text-purple-600 border-purple-200' },
                                { icon: Play, label: 'Purification Started', color: 'bg-blue-50 text-blue-600 border-blue-200' },
                                { icon: Activity, label: 'Monitoring Progress', color: 'bg-amber-50 text-amber-600 border-amber-200' },
                                { icon: CheckCircle2, label: 'Water Recovered', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                            ].map((step, idx) => (
                                <React.Fragment key={idx}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.15 }}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border min-w-[140px] ${step.color}`}
                                    >
                                        <step.icon className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-center">{step.label}</span>
                                    </motion.div>
                                    {idx < 4 && <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* History */}
            {activeView === 'history' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Purification History</h3>
                            <p className="text-sm text-slate-500">Past reclamation events and recovery outcomes</p>
                        </div>
                        <button onClick={fetchHistory} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                            <RefreshCw className={`w-5 h-5 text-slate-400 ${historyLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {historyLoading ? (
                        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                            Loading Archive...
                        </div>
                    ) : history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((event, idx) => {
                                const duration = event.completedAt
                                    ? Math.round((new Date(event.completedAt) - new Date(event.startedAt)) / 60000)
                                    : 'Incomplete';

                                return (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border-l-4"
                                        style={{ borderLeftColor: event.outcome === 'recovered' ? '#10b981' : '#f59e0b' }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">{METHOD_ICONS[event.purificationMethod] || '🧪'}</div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm">{event.purificationMethodDetails?.displayName || event.purificationMethod}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        <Timer className="w-3 h-3" /> {duration} MIN TAKEN
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        {new Date(event.startedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg inline-block mb-1 ${event.outcome === 'recovered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {event.outcome?.replace(/_/g, ' ') || 'Process Ended'}
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                {event.outcomeDetails?.improvementPercent ? `+${event.outcomeDetails.improvementPercent}% Quality` : 'Audit Complete'}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                            <RefreshCw className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">No purification history recorded for this tank.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PurificationPanel;
