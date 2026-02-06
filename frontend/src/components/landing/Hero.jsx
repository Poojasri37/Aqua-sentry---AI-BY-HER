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
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[15%] -right-[10%] w-[900px] h-[900px] bg-gradient-to-br from-sky-200/40 via-blue-100/30 to-transparent rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -60, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[15%] -left-[10%] w-[1000px] h-[1000px] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-transparent rounded-full blur-[150px]"
                />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`
                        }}
                    />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

                {/* Main Headline with Icons */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                        <motion.span
                            className="block text-gray-900 mb-5 font-black"
                            animate={{ opacity: [0.85, 1, 0.85] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <span className="inline-flex items-center gap-4 md:gap-6">
                                <Droplets className="w-14 h-14 md:w-20 md:h-20 text-blue-600 inline-block drop-shadow-lg" />
                                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">AquaSentry</span>
                            </span>
                        </motion.span>
                        <span className="block text-3xl md:text-5xl lg:text-6xl mb-5 text-gray-700 font-semibold tracking-tight leading-tight">
                            Real-Time Water Tank Monitoring System
                        </span>
                        <span className="block text-2xl md:text-4xl lg:text-5xl">
                            <span className="text-gradient font-bold drop-shadow-sm">
                                Built for a Resilient Nation
                            </span>
                        </span>
                    </h1>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Empowering <span className="text-blue-700 font-bold">every community</span> with real-time insights and <span className="text-indigo-700 font-bold">intelligent monitoring</span>
                    </motion.p>
                </motion.div>

                {/* Mission Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-4xl mx-auto mb-12"
                >
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-blue-100 shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Our Mission: Clean Water for Every Home</h3>
                                <p className="text-gray-700 leading-relaxed font-normal text-base">
                                    Bridging the gap between <span className="font-bold text-blue-700">water infrastructure</span> and <span className="font-bold text-indigo-700">cutting-edge technology</span>.
                                    Through <span className="px-2 py-1 bg-sky-100 rounded-md font-bold text-sky-800">AI-powered analytics</span> and
                                    <span className="px-2 py-1 bg-blue-100 rounded-md font-bold text-blue-800 ml-1">IoT sensors</span>,
                                    we ensure <span className="font-black text-gray-900">safe, clean, and sustainable</span> water reaches every household.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-wrap gap-6 mb-16 justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xl shadow-2xl hover:shadow-blue-500/50 transition-all hover:-translate-y-2 hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <Shield className="w-6 h-6" />
                            Get Started
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-800"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </button>

                    <button
                        onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                        className="group px-12 py-6 rounded-2xl bg-white/80 backdrop-blur-md border-2 border-blue-200 text-gray-900 font-black text-xl hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all flex items-center gap-4 hover:-translate-y-1"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                        Watch Demo
                    </button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    className="relative w-full max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 1.1 }}
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-16px_rgba(0,0,0,0.3)] border-8 border-white/60 backdrop-blur-xl hover:shadow-blue-500/30 transition-all duration-500 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 z-10 pointer-events-none" />

                        {/* Animated corner accents */}
                        <motion.div
                            animate={{ rotate: [0, 90, 0] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute top-4 right-4 w-16 h-16 border-4 border-blue-400/30 rounded-lg z-20"
                        />

                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                            alt="AquaSentry Dashboard Preview"
                            className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Live indicator */}
                        <div className="absolute bottom-6 left-6 right-6 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 z-20 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-4 h-4 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
                                    />
                                    <span className="text-white font-black text-lg tracking-wider">REAL-TIME MONITORING</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">All Systems Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
