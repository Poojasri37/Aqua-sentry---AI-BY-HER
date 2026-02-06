import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, ArrowRight, Sparkles, Zap, Eye, TrendingUp, X } from 'lucide-react';

const DemoSection = () => {
    const [showVideoModal, setShowVideoModal] = useState(false);

    const features = [
        { icon: Zap, text: "Instant anomaly detection alerts", color: "text-amber-600" },
        { icon: Sparkles, text: "Natural language query interface", color: "text-blue-600" },
        { icon: CheckCircle2, text: "One-click maintenance scheduling", color: "text-emerald-600" },
        { icon: TrendingUp, text: "Comprehensive ward-level reports", color: "text-indigo-600" }
    ];

    // Replace this with your actual YouTube video ID or local video URL
    const demoVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    return (
        <section id="demo" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Section Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6"
                        >
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-blue-700 tracking-wide">Live Demo</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900 tracking-tight leading-tight">
                            See AquaSentry in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 font-extrabold">Action</span>
                        </h2>

                        <p className="text-gray-700 text-lg md:text-xl mb-10 leading-relaxed font-normal">
                            Watch how our <span className="text-black font-bold">AI Copilot</span> identifies potential quality issues and suggests <span className="text-black font-bold">maintenance schedules</span> in real-time. The interface is designed for <span className="text-blue-700 font-semibold">clarity</span> and <span className="text-blue-700 font-semibold">rapid</span> decision-making.
                        </p>

                        <div className="space-y-6 mb-12">
                            {features.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-4 group"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100 shadow-sm">
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <span className="text-gray-800 font-semibold text-base md:text-lg">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowVideoModal(true)}
                            className="group relative px-12 py-6 rounded-2xl bg-gray-900 text-white font-black text-xl shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Play className="w-6 h-6" />
                                Watch Full Demo
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Decorative elements behind video */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 blur-3xl -z-10 rounded-full" />

                        <div
                            onClick={() => setShowVideoModal(true)}
                            className="relative rounded-[2.5rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.3)] border-8 border-white group cursor-pointer aspect-video bg-gradient-to-br from-gray-900 to-gray-800"
                        >
                            <div className="relative h-full w-full rounded-[1.8rem] overflow-hidden">
                                {/* Video placeholder with overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-purple-900/40 group-hover:from-blue-900/20 group-hover:via-indigo-900/20 group-hover:to-purple-900/20 transition-all duration-500 z-10">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                                                <Play className="w-8 h-8 text-white fill-current ml-1" />
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 rounded-full border-4 border-white/30"
                                        />
                                    </motion.div>
                                </div>

                                <img
                                    src="https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070&auto=format&fit=crop"
                                    alt="System Demo"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                                />

                                {/* Video controls overlay */}
                                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                                            />
                                            <span className="text-white font-bold text-sm">CLICK TO PLAY DEMO</span>
                                        </div>
                                        <div className="text-white/80 text-sm font-semibold">2:45</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-blue-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-gray-900">98.5%</div>
                                    <div className="text-xs font-semibold text-gray-600">Uptime</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-blue-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-gray-900">&lt;50ms</div>
                                    <div className="text-xs font-semibold text-gray-600">Response</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Full-screen Video Modal */}
            <AnimatePresence>
                {showVideoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setShowVideoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowVideoModal(false)}
                                className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all border border-white/20"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            <iframe
                                className="w-full h-full"
                                src={`${demoVideoUrl}?autoplay=1`}
                                title="AquaSentry Demo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default DemoSection;
