import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { Activity, Shield, Globe as GlobeIcon, Zap, MapPin } from 'lucide-react';
import * as THREE from 'three';

const LiveDataGlobe = () => {
    const globeEl = useRef();
    const [points, setPoints] = useState([]);
    const [arcs, setArcs] = useState([]);
    const [rings, setRings] = useState([]);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Initial globe rotation and mount check
    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to ensure ref is set after mount
    useEffect(() => {
        if (mounted && globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 });
        }
    }, [mounted]);

    // Generate Mock Sensor Data
    useEffect(() => {
        if (!mounted) return;

        const generateData = () => {
            const SENSOR_COUNT = 30;
            const newPoints = Array.from({ length: SENSOR_COUNT }).map((_, i) => ({
                id: i,
                lat: (Math.random() - 0.5) * 160,
                lng: (Math.random() - 0.5) * 360,
                status: Math.random() > 0.8 ? 'alert' : 'active',
                val: Math.random(),
                name: `Sensor-Node-${1000 + i}`,
                location: `Sector ${String.fromCharCode(65 + i)}`
            }));

            // Force add User's location
            newPoints.push({
                id: 'hq',
                lat: 11.0168,
                lng: 76.9558,
                status: 'hq',
                val: 1,
                name: 'AquaSentry HQ',
                location: 'Coimbatore, IN'
            });

            setPoints(newPoints);

            // Create Arcs
            const hq = newPoints.find(p => p.id === 'hq');
            const newArcs = newPoints
                .filter(p => p.id !== 'hq')
                .slice(0, 8)
                .map(p => ({
                    startLat: p.lat,
                    startLng: p.lng,
                    endLat: hq.lat,
                    endLng: hq.lng,
                    color: p.status === 'alert' ? ['#ef4444', '#ef4444'] : ['#06b6d4', '#3b82f6']
                }));
            setArcs(newArcs);

            // Create Rings
            const newRings = newPoints
                .filter(p => Math.random() > 0.7)
                .map(p => ({
                    lat: p.lat,
                    lng: p.lng,
                    maxR: 5,
                    propagationSpeed: 2,
                    repeatPeriod: 800
                }));
            setRings(newRings);
        };

        generateData();
        const interval = setInterval(generateData, 4000);
        return () => clearInterval(interval);
    }, [mounted]);

    return (
        <div className="relative w-full h-[600px] bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl group transition-all">
            {/* 3D Globe */}
            <div className="absolute inset-0 cursor-move">
                {mounted && (
                    <Globe
                        ref={globeEl}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundColor="rgba(0,0,0,0)"
                        atmosphereColor="#06b6d4"
                        atmosphereAltitude={0.15}

                        // Points (Sensors)
                        pointsData={points}
                        pointColor={d => d.status === 'alert' ? '#ef4444' : d.status === 'hq' ? '#10b981' : '#06b6d4'}
                        pointAltitude={d => d.status === 'hq' ? 0.1 : 0.05}
                        pointRadius={d => d.status === 'hq' ? 0.5 : 0.25}
                        onPointHover={setHoveredPoint}
                        pointLabel="name"

                        // Rings (Active Pings/Alerts)
                        ringsData={rings}
                        ringColor={() => (t) => `rgba(6, 182, 212, ${1 - t})`}
                        ringMaxRadius="maxR"
                        ringPropagationSpeed="propagationSpeed"
                        ringRepeatPeriod="repeatPeriod"

                        // Arcs (Data Transmission)
                        arcsData={arcs}
                        arcColor="color"
                        arcDashLength={0.4}
                        arcDashGap={2}
                        arcDashInitialGap={() => Math.random()}
                        arcDashAnimateTime={2000}
                        arcStroke={0.5}

                        // Aesthetics
                        hexBinPointsData={points}
                        hexBinPointWeight="val"
                        hexBinResolution={4}
                        hexMargin={0.2}
                        hexTopColor={() => '#06b6d4'}
                        hexSideColor={() => '#0e7490'}
                        hexBinMerge={true}
                    />
                )}
            </div>

            {/* Overlay UI: Digital Twin HUD */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-8 flex flex-col justify-between z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <GlobeIcon className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-white font-black tracking-tight">GLOBAL DIGITAL TWIN</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            LIVE NETWORK STATUS: ACTIVE
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-right"
                    >
                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Nodes</div>
                        <div className="text-2xl font-black text-white font-mono">{points.length}</div>
                    </motion.div>
                </div>

                {/* Footer / Tooltip Area */}
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        {hoveredPoint && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-cyan-400" />
                                    <span className="font-bold text-white text-sm">{hoveredPoint.name}</span>
                                </div>
                                <div className="text-xs text-slate-400 font-mono pl-6">{hoveredPoint.location}</div>
                            </motion.div>
                        )}
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs font-mono text-slate-400 space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div> Active Secure Link
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> Critical Alert
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Central Hub (HQ)
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Overlay Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default LiveDataGlobe;
