import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert, Activity, Zap, AlertTriangle, CheckCircle2,
    TrendingUp, Info, Beaker, ChevronDown, ChevronUp, BarChart3
} from 'lucide-react';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

const RISK_CONFIG = {
    'Low Risk': { color: 'emerald', gradient: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
    'Moderate Risk': { color: 'amber', gradient: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Info },
    'High Risk': { color: 'orange', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: AlertTriangle },
    'Critical Risk': { color: 'red', gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: ShieldAlert }
};

const PARAM_LABELS = {
    orpRisk: { name: 'ORP', unit: 'mV', icon: '⚡' },
    tdsRisk: { name: 'EC/TDS', unit: 'ppm', icon: '🧂' },
    turbidityRisk: { name: 'Turbidity', unit: 'NTU', icon: '🌊' },
    phRisk: { name: 'pH', unit: '', icon: '🧪' },
    microplasticRisk: { name: 'Microplastics', unit: '', icon: '🔬' },
    heavyMetalRisk: { name: 'Heavy Metals', unit: '', icon: '⚙️' },
    uvAbsorbanceRisk: { name: 'UV Absorbance', unit: 'AU', icon: '☀️' },
    dissolvedOxygenRisk: { name: 'Dissolved O₂', unit: 'mg/L', icon: '💨' }
};

const CRIPanel = ({ userRole = 'user' }) => {
    const [criResult, setCriResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [simParams, setSimParams] = useState({
        ph: 7.2, turbidity: 1.5, ec_tds: 300, orp: 650,
        dissolved_oxygen: 8.5, microplasticLevel: 2,
        heavyMetalIndex: null, uvAbsorbance: null
    });

    const simulateCRI = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/cri/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ params: simParams })
            });
            const data = await res.json();
            if (data.success) setCriResult(data.result);
        } catch (err) {
            console.error('Error simulating CRI:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        simulateCRI();
    }, []);

    const riskConfig = criResult ? RISK_CONFIG[criResult.riskCategory] || RISK_CONFIG['Low Risk'] : RISK_CONFIG['Low Risk'];
    const RiskIcon = riskConfig.icon;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-600 via-red-600 to-orange-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-20 w-64 h-64 bg-rose-300/10 blur-[80px] rounded-full"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Carcinogenic Risk Index (CRI)</h2>
                            </div>
                            <p className="text-rose-100 font-medium text-sm">Multi-sensor fusion health risk assessment • 8-parameter weighted scoring</p>
                        </div>
                    </div>

                    {/* Weight Distribution */}
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {[
                            { label: 'ORP', weight: '20%', icon: '⚡' },
                            { label: 'Micro', weight: '20%', icon: '🔬' },
                            { label: 'TDS', weight: '15%', icon: '🧂' },
                            { label: 'Turb', weight: '15%', icon: '🌊' },
                            { label: 'pH', weight: '10%', icon: '🧪' },
                            { label: 'Metal', weight: '10%', icon: '⚙️' },
                            { label: 'UV', weight: '5%', icon: '☀️' },
                            { label: 'DO', weight: '5%', icon: '💨' },
                        ].map((p, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-center border border-white/5">
                                <span className="text-lg">{p.icon}</span>
                                <p className="text-[9px] font-black uppercase tracking-wider mt-1">{p.label}</p>
                                <p className="text-xs font-black text-white/70">{p.weight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Simulator Panel */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">CRI Simulator</h3>
                        <p className="text-sm text-slate-500">Adjust sensor values to simulate risk assessment</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={simulateCRI}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-red-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Beaker className="w-4 h-4" />
                        {loading ? 'Calculating...' : 'Calculate CRI'}
                    </motion.button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { key: 'ph', label: 'pH Level', min: 0, max: 14, step: 0.1 },
                        { key: 'turbidity', label: 'Turbidity (NTU)', min: 0, max: 5000, step: 50 },
                        { key: 'ec_tds', label: 'TDS (ppm)', min: 0, max: 3000, step: 50 },
                        { key: 'orp', label: 'ORP (mV)', min: -200, max: 1000, step: 10 },
                        { key: 'dissolved_oxygen', label: 'DO (mg/L)', min: 0, max: 14, step: 0.5 },
                        { key: 'microplasticLevel', label: 'Microplastic', min: 0, max: 100, step: 5 },
                    ].map(param => (
                        <div key={param.key} className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{param.label}</label>
                            <input
                                type="number"
                                value={simParams[param.key] ?? ''}
                                onChange={e => setSimParams(prev => ({ ...prev, [param.key]: e.target.value ? parseFloat(e.target.value) : null }))}
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* CRI Score Display */}
            <AnimatePresence>
                {criResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Score Card */}
                        <div className={`${riskConfig.bg} ${riskConfig.border} border-2 rounded-3xl p-8`}>
                            <div className="flex items-center gap-8">
                                {/* Circular Score */}
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200" />
                                        <motion.circle
                                            cx="60" cy="60" r="52" fill="none"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            className={riskConfig.text}
                                            stroke="currentColor"
                                            strokeDasharray={`${2 * Math.PI * 52}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - criResult.criScore / 100) }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-black ${riskConfig.text}`}>{criResult.criScore}</span>
                                        <span className="text-xs font-bold text-slate-500">/100</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <RiskIcon className={`w-7 h-7 ${riskConfig.text}`} />
                                        <h3 className={`text-2xl font-black ${riskConfig.text}`}>{criResult.riskCategory}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{criResult.explanation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Parameter Breakdown */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-5 h-5 text-slate-400" />
                                    <h3 className="text-lg font-black text-slate-900">Parameter Risk Breakdown</h3>
                                </div>
                                {showDetails ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>

                            <AnimatePresence>
                                {showDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 space-y-4">
                                            {criResult.topContributors?.map((contributor, idx) => {
                                                const barColor = contributor.score <= 30 ? 'bg-emerald-400' :
                                                    contributor.score <= 60 ? 'bg-amber-400' :
                                                        contributor.score <= 80 ? 'bg-orange-500' : 'bg-red-500';
                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-slate-800">{contributor.parameter}</span>
                                                                <span className="text-[10px] font-bold text-slate-400">
                                                                    weight: {Math.round(contributor.weight * 100)}%
                                                                </span>
                                                            </div>
                                                            <span className={`text-sm font-black ${contributor.score <= 30 ? 'text-emerald-600' :
                                                                contributor.score <= 60 ? 'text-amber-600' :
                                                                    contributor.score <= 80 ? 'text-orange-600' : 'text-red-600'
                                                                }`}>
                                                                {contributor.score}/100
                                                            </span>
                                                        </div>
                                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-1">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${contributor.score}%` }}
                                                                transition={{ delay: idx * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                                                                className={`h-full rounded-full ${barColor}`}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-slate-500">{contributor.detail}</p>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Recommendations */}
                        {criResult.recommendations?.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setShowRecommendations(!showRecommendations)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        <h3 className="text-lg font-black text-slate-900">Recommendations ({criResult.recommendations.length})</h3>
                                    </div>
                                    {showRecommendations ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>

                                <AnimatePresence>
                                    {showRecommendations && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 space-y-3">
                                                {criResult.recommendations.map((rec, idx) => {
                                                    const isUrgent = rec.includes('CRITICAL') || rec.includes('URGENT') || rec.includes('Immediately');
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.08 }}
                                                            className={`flex items-start gap-3 p-4 rounded-2xl border ${isUrgent
                                                                ? 'bg-red-50 border-red-200'
                                                                : 'bg-slate-50 border-slate-200'
                                                                }`}
                                                        >
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${isUrgent ? 'bg-red-500 text-white' : 'bg-slate-300 text-white'
                                                                }`}>
                                                                {idx + 1}
                                                            </div>
                                                            <p className={`text-sm font-medium ${isUrgent ? 'text-red-700' : 'text-slate-700'}`}>{rec}</p>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Risk Scale Legend */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight uppercase">Risk Scale Reference</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { range: '0–30', label: 'Low Risk', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                                    { range: '31–60', label: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-700' },
                                    { range: '61–80', label: 'High Risk', color: 'bg-orange-500', textColor: 'text-orange-700' },
                                    { range: '81–100', label: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' },
                                ].map((level, i) => (
                                    <div key={i} className="text-center">
                                        <div className={`h-3 rounded-full ${level.color} mb-2`}></div>
                                        <p className={`text-xs font-black ${level.textColor}`}>{level.range}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{level.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CRIPanel;
