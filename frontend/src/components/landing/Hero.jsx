import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-gov-green-50">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gov-green-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gov-blue-200/30 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-green-50 text-gov-green-800 border border-gov-green-300 mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-green-600 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gov-green-700"></span>
                    </span>
                    <span className="text-sm font-medium tracking-wide">AI-Powered Water Intelligence</span>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="block text-gray-900 mb-2">Aquatic Intelligence for a</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-gov-green-600 to-gov-blue-600">
                        Resilient Nation
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10 leading-relaxed mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    We built AquaSentry to bridge the gap between water management and advanced technology.
                    Using <span className="font-semibold text-gray-900">AI-driven analysis</span> and <span className="font-semibold text-gray-900">IoT monitoring</span>,
                    we ensure every community has access to safe, clean, and sustainable water resources.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <button onClick={() => navigate('/login')} className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-gov-green-600 to-gov-green-700 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-gov-green-700 hover:to-gov-green-800 transition-all transform hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Get Started Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    <button className="px-8 py-4 rounded-xl bg-white border-2 border-gov-green-300 text-gov-green-800 font-medium text-lg hover:bg-gov-green-50 transition-all flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gov-green-100 flex items-center justify-center group-hover:bg-gov-green-200 transition-colors">
                            <Play className="w-4 h-4 fill-gov-green-700 text-gov-green-700 ml-0.5" />
                        </div>
                        Watch Demo
                    </button>
                </motion.div>

                {/* Dashboard Mockup / Visual */}
                <motion.div
                    className="mt-20 relative w-full max-w-5xl"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-gov-green-400 to-gov-blue-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                    <div className="relative glass rounded-xl border border-gray-300 overflow-hidden aspect-[16/9] shadow-2xl bg-white/50 backdrop-blur-sm">
                        {/* Abstract UI Representation */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 hover:bg-gray-900/20 transition-colors">
                            <div className="text-center p-8">
                                <div className="inline-block p-4 rounded-full bg-gov-green-100 mb-4 animate-bounce">
                                    <Play className="w-12 h-12 text-gov-green-700 fill-gov-green-700" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Dashboard Preview</h3>
                                <p className="text-gray-700">Click to explore the live simulation</p>
                            </div>
                        </div>
                        {/* This would be an actual image or video in production */}
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                            alt="Dashboard Analytics"
                            className="w-full h-full object-cover opacity-30"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
