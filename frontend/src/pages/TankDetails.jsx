import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Activity, Droplets, Thermometer, Wind, AlertTriangle,
    FileText, Camera, Bot, Calendar, Wrench, CheckCircle, Share2,
    ShieldCheck, Clock, Download, ChevronRight, Zap, ArrowUpRight, ArrowDownRight, Info, RefreshCw
} from 'lucide-react';
import SensorChart from '../components/dashboard/SensorChart';
import { generateSensorHistory, getTankDetails } from '../utils/mockData';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import ReportIssueModal from '../components/dashboard/ReportIssueModal';
import DigitalTwin3D from '../components/DigitalTwin3D';

const TankDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tank, setTank] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // overview, vision, maintenance
    const [aiAnalysis, setAiAnalysis] = useState('Initialize analysis for regional water security compliance.');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [microplasticData, setMicroplasticData] = useState(null);

    const { lastReading, isConnected, subscribeToTank, unsubscribeFromTank } = useSocket();

    useEffect(() => {
        const data = getTankDetails(id);
        setTank(data);
        setHistory(generateSensorHistory(24));

        // Generate microplastic detection data (simulating YOLO model results)
        const generateMicroplasticData = () => {
            const particleTypes = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS'];
            const numParticles = Math.floor(Math.random() * 40) + 30; // 30-70 particles

            const particles = [];
            const typeCounts = {};

            for (let i = 0; i < numParticles; i++) {
                const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
                typeCounts[type] = (typeCounts[type] || 0) + 1;

                particles.push({
                    id: i,
                    type: type,
                    confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
                    bbox: {
                        x: Math.random() * 0.8 + 0.1,
                        y: Math.random() * 0.8 + 0.1,
                        width: Math.random() * 0.1 + 0.02,
                        height: Math.random() * 0.1 + 0.02
                    },
                    position3D: {
                        x: (Math.random() - 0.5) * 3.5,
                        y: Math.random() * 2.5 + 0.2,
                        z: (Math.random() - 0.5) * 3.5
                    }
                });
            }

            const microplasticPercentage = Math.min((numParticles / 80) * 100, 95).toFixed(1);

            return {
                totalParticles: numParticles,
                microplasticPercentage: parseFloat(microplasticPercentage),
                particlesByType: typeCounts,
                particles: particles
            };
        };

        setMicroplasticData(generateMicroplasticData());

        subscribeToTank(id);
        return () => unsubscribeFromTank(id);
    }, [id]);

    useEffect(() => {
        if (lastReading && lastReading.id === id) {
            setTank(prev => ({
                ...prev,
                metrics: lastReading.metrics,
                waterLevel: lastReading.metrics.waterLevel,
                lastUpdate: lastReading.timestamp
            }));

            setHistory(prev => [...prev.slice(1), {
                timestamp: lastReading.timestamp,
                timeLabel: new Date(lastReading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ...lastReading.metrics
            }]);
        }
    }, [lastReading, id]);

    const handleBack = () => navigate(-1);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setAiAnalysis(`
                <h4 class="font-bold text-cyan-400 mb-2">Regional Compliance Audit</h4>
                <p>Current pH of ${tank.metrics.ph} is within safely regulated margins for the ${tank.location.address.split(',')[1]} region. 
                Monitoring indicates a <strong>stable trend</strong> in chlorine levels (${tank.metrics.chlorine} mg/L). 
                <br/><br/>
                <span class="text-amber-400 font-bold">Recommendation:</span> Scheduled cleaning is due in ${Math.floor(Math.random() * 15)} days. Pre-emptive maintenance is advised to maintain current high purity scores.</p>
            `);
            setIsAnalyzing(false);
        }, 1500);
    };

    if (!tank) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Authenticating Resource ID...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-10">
            {/* Gov Header Style */}
            <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between px-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleBack}
                        className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200 group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{tank.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tank.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                tank.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {tank.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            {tank.id} • {tank.location.address}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isConnected && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Live Telemetry Active</span>
                        </div>
                    )}
                    <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl w-fit mb-4"><Activity className="w-5 h-5" /></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">pH Level</p>
                        <h3 className="text-3xl font-black text-slate-900">{tank.metrics.ph}</h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                            <ArrowUpRight className="w-3 h-3" /> Stabilized
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4"><Zap className="w-5 h-5" /></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Chlorine</p>
                        <h3 className="text-3xl font-black text-slate-900">{tank.metrics.chlorine} <span className="text-sm">mg/L</span></h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                            • Normal Range
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4"><Wind className="w-5 h-5" /></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Turbidity</p>
                        <h3 className="text-3xl font-black text-slate-900">{tank.metrics.turbidity} <span className="text-sm">NTU</span></h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase">
                            <ArrowUpRight className="w-3 h-3" /> Rising
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mb-4"><Thermometer className="w-5 h-5" /></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Temp</p>
                        <h3 className="text-3xl font-black text-slate-900">{tank.metrics.temperature}°C</h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase">
                            <ArrowDownRight className="w-3 h-3" /> Cooling
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl w-fit mb-4"><Droplets className="w-5 h-5" /></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                        <h3 className="text-3xl font-black text-slate-900">94<span className="text-sm text-slate-400">/100</span></h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                            <ShieldCheck className="w-3 h-3" /> Secure
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Advanced Analytics */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Chemical Fingerprint Analysis</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase mt-1">Real-time Correlation Monitoring</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Window: 24h</span>
                                </div>
                            </div>

                            <SensorChart
                                data={history}
                                height={400}
                                showLegend={true}
                                series={[
                                    { key: 'ph', color: '#22d3ee', label: 'pH Level' },
                                    { key: 'chlorine', color: '#3b82f6', label: 'Chlorine (mg/L)' },
                                    { key: 'turbidity', color: '#f59e0b', label: 'Turbidity (NTU)' }
                                ]}
                            />

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">pH Stability Index</p>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                        PH fluctuations are within 0.2 units/hr. No immediate chemical neutralization required.
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Filter Efficiency</p>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                        Turbidity correlation suggests the filtration system is operating at 94% nominal efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Analytics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Temperature Trends</h4>
                                <SensorChart
                                    data={history}
                                    height={200}
                                    series={[{ key: 'temperature', color: '#f43f5e', label: 'Temp (°C)' }]}
                                />
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Storage Volume (%)</h4>
                                <SensorChart
                                    data={history}
                                    height={200}
                                    series={[{ key: 'waterLevel', color: '#0d9488', label: 'Level %' }]}
                                />
                            </div>
                        </div>

                        {/* Maintenance Logs */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <h4 className="text-lg font-black text-slate-900 tracking-tight">Operational Service Logs</h4>
                                <button className="text-cyan-600 font-bold text-sm hover:underline italic">Advanced filtering</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {tank?.location?.address?.includes('New Delhi') || tank?.location?.address?.includes('Pragati Maidan') ? (
                                    <div className="px-8 py-10 text-center">
                                        <p className="text-xs font-bold text-slate-400 italic">No Salem-specific audits applicable to this regional asset.</p>
                                        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 inline-flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">New Delhi Compliance Verified</span>
                                        </div>
                                    </div>
                                ) : (
                                    [1, 2].map(i => (
                                        <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl h-fit border border-slate-200"><CheckCircle className="w-5 h-5" /></div>
                                                <div>
                                                    <h5 className="font-bold text-slate-900">System Integrity Audit - Salem {i === 1 ? 'Alpha' : 'Beta'}</h5>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                        Compliance Verified • {i === 1 ? '12h ago' : '3 days ago'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 text-slate-300" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Microplastic Detection & Digital Twin Section */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden mt-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">AI Vision - Microplastic Detection</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase mt-1">Real-time YOLO Model Analysis & Digital Twin</p>
                                </div>
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Camera className="w-6 h-6" /></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left: Detection Results */}
                                <div className="space-y-6">
                                    {microplasticData && (
                                        <>
                                            {/* Contamination Percentage */}
                                            <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Microplastic Contamination</p>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${microplasticData.microplasticPercentage < 25 ? 'bg-green-100 text-green-700' :
                                                        microplasticData.microplasticPercentage < 50 ? 'bg-yellow-100 text-yellow-700' :
                                                            microplasticData.microplasticPercentage < 75 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {microplasticData.microplasticPercentage < 25 ? 'LOW' :
                                                            microplasticData.microplasticPercentage < 50 ? 'MODERATE' :
                                                                microplasticData.microplasticPercentage < 75 ? 'HIGH' : 'CRITICAL'}
                                                    </span>
                                                </div>
                                                <div className="text-5xl font-black text-slate-900 mb-3">
                                                    {microplasticData.microplasticPercentage}%
                                                </div>
                                                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                                                        style={{ width: `${microplasticData.microplasticPercentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium mt-3">
                                                    Detected by YOLO Vision Model
                                                </p>
                                            </div>

                                            {/* Particle Count */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Particles</p>
                                                    <p className="text-3xl font-black text-slate-900">{microplasticData.totalParticles}</p>
                                                </div>
                                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Particle Types</p>
                                                    <p className="text-3xl font-black text-slate-900">{Object.keys(microplasticData.particlesByType).length}</p>
                                                </div>
                                            </div>

                                            {/* Particle Breakdown */}
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Particle Type Breakdown</p>
                                                <div className="space-y-3">
                                                    {Object.entries(microplasticData.particlesByType).map(([type, count]) => (
                                                        <div key={type} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-3 h-3 rounded-full ${type === 'PET' ? 'bg-red-400' :
                                                                    type === 'HDPE' ? 'bg-teal-400' :
                                                                        type === 'PVC' ? 'bg-yellow-400' :
                                                                            type === 'LDPE' ? 'bg-green-400' :
                                                                                type === 'PP' ? 'bg-pink-400' :
                                                                                    'bg-purple-400'
                                                                    }`} />
                                                                <span className="text-sm font-bold text-slate-700">{type}</span>
                                                            </div>
                                                            <span className="text-lg font-black text-slate-900">{count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Color Legend */}
                                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3">Particle Color Legend</p>
                                                <div className="grid grid-cols-3 gap-2 text-[10px]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                                        <span className="text-slate-600 font-medium">PET</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-400" />
                                                        <span className="text-slate-600 font-medium">HDPE</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                                        <span className="text-slate-600 font-medium">PVC</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                                        <span className="text-slate-600 font-medium">LDPE</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                                                        <span className="text-slate-600 font-medium">PP</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                        <span className="text-slate-600 font-medium">PS</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right: 3D Digital Twin */}
                                <div className="space-y-4">
                                    <div className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700" style={{ height: '600px' }}>
                                        {microplasticData ? (
                                            <DigitalTwin3D
                                                microplasticData={microplasticData}
                                                tankDimensions={{ width: 4, height: 3, depth: 4 }}
                                            />
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-400">
                                                <div className="text-center">
                                                    <Droplets className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                    <p className="text-sm font-medium">Loading Digital Twin...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                                        <div className="flex items-start gap-3">
                                            <Info className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-[10px] text-cyan-800">
                                                <p className="font-black uppercase tracking-widest mb-1">3D Digital Twin Active</p>
                                                <p className="font-medium">Rectangular tank with floating microplastics. Use mouse to rotate, zoom, and pan.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* AI Insight Card */}
                        <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="active-glow absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <Bot className="w-6 h-6 text-cyan-400" />
                                <h3 className="text-xl font-black tracking-tight italic">Neural Health Engine</h3>
                            </div>
                            <div className="bg-white/5 rounded-[2rem] p-6 mb-8 text-sm font-medium text-slate-300 leading-relaxed border border-white/5 min-h-[160px]">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                                        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                                        <p className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Processing Satellite Link...</p>
                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
                                )}
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleAnalyze}
                                    className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-3"
                                >
                                    <RefreshCw className="w-5 h-5" /> Start Logic Audit
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition-all text-xs uppercase tracking-widest"
                                >
                                    Return to Command
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Operational Control</h4>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="w-full flex items-center justify-between p-5 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:shadow-lg transition-all border border-red-100"
                            >
                                <span>Report Issue</span>
                                <AlertTriangle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    // Export comprehensive telemetry data
                                    const telemetryData = {
                                        'Tank ID': tank.id,
                                        'Tank Name': tank.name,
                                        'Location': tank.location?.address || 'N/A',
                                        'Status': tank.status,
                                        'pH Level': tank.metrics.ph,
                                        'Turbidity (NTU)': tank.metrics.turbidity,
                                        'Chlorine (mg/L)': tank.metrics.chlorine,
                                        'Temperature (°C)': tank.metrics.temperature || 'N/A',
                                        'Water Level (%)': tank.waterLevel || 'N/A',
                                        'Last Cleaned': tank.lastCleaned,
                                        'Last Update': tank.lastUpdate || new Date().toISOString(),
                                        'Capacity (L)': tank.capacity || 'N/A',
                                        'Health Score': '94/100'
                                    };

                                    const headers = Object.keys(telemetryData);
                                    const values = Object.values(telemetryData);

                                    const csvContent = [
                                        headers.join(','),
                                        values.map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v).join(','),
                                        '',
                                        '# Historical Data (Last 24h)',
                                        'Timestamp,pH,Turbidity,Chlorine,Temperature,Water Level',
                                        ...history.map(h => `${h.timestamp || h.timeLabel},${h.ph},${h.turbidity},${h.chlorine},${h.temperature || 'N/A'},${h.waterLevel || 'N/A'}`)
                                    ].join('\\n');

                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const link = document.createElement('a');
                                    const url = URL.createObjectURL(blob);

                                    link.setAttribute('href', url);
                                    link.setAttribute('download', `${tank.id}_Telemetry_${new Date().toISOString().split('T')[0]}.csv`);
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                }}
                                className="w-full flex items-center justify-between p-5 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all"
                            >
                                <span>Export Telemetry</span>
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <ReportIssueModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                tank={tank}
            />
        </div>
    );
};

export default TankDetails;
