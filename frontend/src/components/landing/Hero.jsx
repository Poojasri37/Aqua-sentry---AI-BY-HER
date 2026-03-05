import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Droplets, Shield, Zap, TrendingUp, Users, Globe, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const stats = [
        { icon: Droplets, value: "10M+", label: "Liters Monitored Daily", color: "from-blue-500 to-cyan-500" },
        { icon: Shield, value: "99.9%", label: "Quality Assurance", color: "from-emerald-500 to-teal-500" },
        { icon: Zap, value: "<1ms", label: "Response Time", color: "from-amber-500 to-orange-500" }
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
            {/* Background removed to use global App.jsx background */}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">

                {/* Main Headline */}
                <motion.div
                    className="text-center max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>Next Gen Water Monitoring</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
                        <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent pb-2">
                            AquaSentry
                        </span>
                        <br />
                        <span className="text-slate-300 text-3xl md:text-5xl font-bold">
                            Intelligent Water Security
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        Deploying advanced sensors and AI analytics for a resilient, safer water ecosystem in every community.
                    </p>

                    {/* CTA Buttons - Compact */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all flex items-center gap-2"
                        >
                            <Shield className="w-5 h-5" />
                            Get Protected
                        </button>

                        <button
                            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                            className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 backdrop-blur-sm"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Live Demo
                        </button>
                    </div>
                </motion.div>

                {/* Stats Grid - Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-16"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{stat.value}</div>
                                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Dashboard Preview - Sleeker Card */}
                <motion.div
                    className="relative w-full max-w-5xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl group">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none" />

                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                            alt="AquaSentry Dashboard"
                            className="w-full h-auto opacity-90 group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Floating Status */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center z-20">
                            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3 shadow-lg">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="text-white text-sm font-medium tracking-wide">System Active • Monitoring 24/7</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
