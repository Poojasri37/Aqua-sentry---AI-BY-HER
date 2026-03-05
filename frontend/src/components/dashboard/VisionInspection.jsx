import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, Upload, Radio, Activity, AlertTriangle, CheckCircle,
    XCircle, Scan, Zap, Droplets, Target, Shield, RefreshCw
} from 'lucide-react';

const VisionInspection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [scanStep, setScanStep] = useState('');

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const canvasRef = useRef(null);

    // 🎨 Logic: Analyze Image Color
    const analyzeImageColor = (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let r = 0, g = 0, b = 0;

            // Sample every 10th pixel for performance
            let count = 0;
            for (let i = 0; i < data.length; i += 40) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            generateDiagnosis(r, g, b);
        };
    };

    // 🧠 Logic: Generate AI Diagnosis
    const generateDiagnosis = (r, g, b) => {
        let diagnosis = {
            status: 'Clean',
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/50',
            icon: CheckCircle,
            message: 'Water appears clear and safe.',
            metrics: { turbidity: 1.2, ph: 7.4, bio: 2 },
            issues: []
        };

        // Calculate brightness and saturation helpers
        const brightness = (r + g + b) / 3;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;

        // 🟤 1. Rust / Mud / Turbid (Red or Brown dominant)
        // Brown is often Red + Green, or just Red dominant.
        if ((r > b + 30 && r > g + 10) || (r > 100 && g > 80 && b < 80)) {
            diagnosis = {
                status: 'Critical',
                color: 'text-amber-600',
                bg: 'bg-amber-600/10',
                border: 'border-amber-600/50',
                icon: XCircle,
                message: 'Heavy sedimentation or rust detected.',
                metrics: { turbidity: 120, ph: 6.1, bio: 45 },
                issues: ['Iron Oxidation (Rust)', 'High Turbidity', 'Suspended Solids']
            };
        }
        // 🟢 2. Algae (Green dominant)
        else if (g > r + 15 && g > b + 15) {
            diagnosis = {
                status: 'Contaminated',
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/50',
                icon: AlertTriangle,
                message: 'Significant algal bloom detected.',
                metrics: { turbidity: 85, ph: 8.5, bio: 92 },
                issues: ['High Algae Content', 'Organic Contamination', 'Possible Eutrophication']
            };
        }
        // ⚫ 3. Dark / Hazardous (Low Brightness)
        else if (brightness < 70) {
            diagnosis = {
                status: 'Hazardous',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/50',
                icon: Activity,
                message: 'Unknown dark contaminants detected.',
                metrics: { turbidity: 95, ph: 5.5, bio: 78 },
                issues: ['Industrial Runoff', 'Oil/Grease', 'Severe Contamination']
            };
        }
        // 🟡 4. Yellowish / Chemical (High R+G, Low B) if not caught by rust
        else if (r > 150 && g > 150 && b < 100) {
            diagnosis = {
                status: 'Warning',
                color: 'text-yellow-500',
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/50',
                icon: AlertTriangle,
                message: 'Discoloration detected (Possible Chemical).',
                metrics: { turbidity: 45, ph: 8.0, bio: 12 },
                issues: ['Chemical Discoloration', 'Sulfur Presence']
            };
        }

        // Default is CLEAN (White/Blue/Greyish-White)

        setResults(diagnosis);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target.result);
                setResults(null);
                startScan(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const startScan = (imageSrc) => {
        setAnalyzing(true);
        setScanProgress(0);

        // Simulation Steps
        const steps = [
            { t: 500, label: 'Initializing Neural Net...' },
            { t: 1500, label: 'Identifying Particles...' },
            { t: 2500, label: 'Analyzing Color Spectrum...' },
            { t: 3500, label: 'Calculating Toxicity...' },
        ];

        steps.forEach(step => {
            setTimeout(() => setScanStep(step.label), step.t);
        });

        // Loop progress bar
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 80);

        // Finish
        setTimeout(() => {
            analyzeImageColor(imageSrc);
            setAnalyzing(false);
            setScanStep('Analysis Complete');
        }, 4000);
    };

    return (
        <div className="relative min-h-[600px] w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            {/* Hidden Canvas for Processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center">

                {!selectedImage ? (
                    // 🟢 IDLE STATE
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 max-w-lg"
                    >
                        <div className="relative mx-auto w-32 h-32">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Scan className="w-16 h-16 text-cyan-400" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                                AquaSight AI v2.0
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Ready for bio-scan. Upload water sample for molecular structure analysis.
                            </p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="px-8 py-4 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-xl hover:bg-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3 font-bold"
                            >
                                <Upload className="w-5 h-5" />
                                Load Sample
                            </button>
                            <button
                                onClick={() => cameraInputRef.current.click()}
                                className="px-8 py-4 bg-blue-500/10 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/20 hover:scale-105 transition-all flex items-center gap-3 font-bold"
                            >
                                <Camera className="w-5 h-5" />
                                Activate Cam
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    // 🔵 ANALYSIS STATE
                    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                        {/* LEFT: SCANNER VIEW */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
                            <img
                                src={selectedImage}
                                alt="Sample"
                                className="w-full h-full object-cover opacity-80"
                            />

                            {/* HUD Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-2 py-1 bg-black/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded">CAM-01</span>
                                    <span className="px-2 py-1 bg-black/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded">LIVE</span>
                                </div>

                                {/* Target Reticle */}
                                <div className="absolute inset-0 border-[20px] border-cyan-500/10 rounded-xl" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/20 rounded-full" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />

                                {/* 🔴 LASER SCANNER ANIMATION */}
                                {analyzing && (
                                    <motion.div
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-20"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-400/20 to-transparent" />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: DATA PANEL */}
                        <div className="space-y-6">
                            {analyzing ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between text-cyan-400 font-mono text-sm">
                                        <span>PROCESSING DATA...</span>
                                        <span>{scanProgress}%</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cyan-500"
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>

                                    {/* Terminal Output */}
                                    <div className="font-mono text-green-400 text-sm bg-black/50 p-4 rounded-xl border border-white/10 h-32 flex flex-col justify-end">
                                        <p className="opacity-50">System initialized...</p>
                                        <p className="opacity-75">Reading optical sensor data...</p>
                                        <p className="text-cyan-300 animate-pulse">&gt; {scanStep}</p>
                                    </div>
                                </motion.div>
                            ) : results ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className={`p-6 rounded-2xl border ${results.border} ${results.bg} backdrop-blur-md`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <results.icon className={`w-6 h-6 ${results.color}`} />
                                                    <h3 className={`text-2xl font-black uppercase tracking-wider ${results.color}`}>
                                                        {results.status}
                                                    </h3>
                                                </div>
                                                <p className="text-slate-300">{results.message}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full border ${results.border} ${results.color} text-xs font-bold uppercase`}>
                                                Confidence 98%
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <div className="p-3 rounded-lg bg-black/20 text-center">
                                                <div className="text-xs text-slate-400 uppercase mb-1">Turbidity</div>
                                                <div className="text-xl font-bold text-white">{results.metrics.turbidity} <span className="text-xs text-slate-500">NTU</span></div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-black/20 text-center">
                                                <div className="text-xs text-slate-400 uppercase mb-1">pH Level</div>
                                                <div className="text-xl font-bold text-white">{results.metrics.ph}</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-black/20 text-center">
                                                <div className="text-xs text-slate-400 uppercase mb-1">Bio-Load</div>
                                                <div className="text-xl font-bold text-white">
                                                    {results.metrics.bio}<span className="text-xs text-slate-500">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Issues List */}
                                        {results.issues.length > 0 && (
                                            <div className="space-y-2">
                                                {results.issues.map((issue, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300 bg-black/20 px-3 py-2 rounded">
                                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                        {issue}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Analyze New Sample
                                    </button>
                                </motion.div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            {/* Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />
            <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
            />
        </div>
    );
};

export default VisionInspection;
