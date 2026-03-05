import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Shield, Users } from 'lucide-react';

const ProjectOverview = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block py-1.5 px-4 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black mb-6 border border-cyan-500/20 uppercase tracking-widest backdrop-blur-sm"
                    >
                        Our Vision & Purpose
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight"
                    >
                        Why We Built <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">AquaSentry</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-400 max-w-3xl mx-auto"
                    >
                        Water scarcity and contamination are pressing global challenges. We developed this platform to empower communities with the data they need to protect their most vital resource.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1: The Problem */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all group"
                    >
                        <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">The Challenge</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Traditional water monitoring is manual, slow, and reactive. Problems like contamination or leaks are often detected too late, leading to waste and health risks.
                        </p>
                    </motion.div>

                    {/* Card 2: The Solution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/20 transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/30">
                            <Lightbulb className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Our Solution</h3>
                        <p className="text-slate-300 leading-relaxed font-medium">
                            We built an intelligent ecosystem that combines <strong className="text-cyan-400">IoT sensors</strong> for real-time tracking and <strong className="text-cyan-400">Gen-AI</strong> to predict quality issues before they escalate.
                        </p>
                    </motion.div>

                    {/* Card 3: The Impact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all group"
                    >
                        <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">The Impact</h3>
                        <p className="text-slate-400 leading-relaxed">
                            By democratizing access to water data, we are enabling municipalities and citizens to make informed decisions, ensuring safe water for every household.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center bg-slate-800/30 rounded-2xl p-8 border border-white/5 backdrop-blur-sm"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="p-3 bg-slate-700/50 rounded-full shadow-lg border border-white/10">
                            <Users className="w-6 h-6 text-cyan-400" />
                        </div>
                        <p className="text-lg text-slate-300 font-medium">
                            "Built with the vision of <span className="font-bold text-cyan-400 underline decoration-cyan-500/30 decoration-2 underline-offset-4">Antyodaya</span> — serving the last person in the line with technology."
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProjectOverview;
