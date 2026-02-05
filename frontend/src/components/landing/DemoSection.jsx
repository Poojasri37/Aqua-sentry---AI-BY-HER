import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2 } from 'lucide-react';

const DemoSection = () => {
    return (
        <section id="demo" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                            See AquaSentry in <span className="text-gov-green-700">Action</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Watch how our AI Copilot identifies potential quality issues and suggests maintenance schedules in real-time. The interface is designed for clarity and rapid decision-making.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Instant anomaly detection alerts",
                                "Natural language query interface",
                                "One-click maintenance scheduling",
                                "Comprehensive ward-level reports"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gov-green-600" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button className="mt-10 px-8 py-4 rounded-xl bg-gov-green-700 text-white font-bold hover:bg-gov-green-800 transition-colors shadow-lg shadow-gov-green-500/20">
                            Schedule Live Tour
                        </button>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Decorative elements behind video */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gov-green-100/50 blur-3xl -z-10 rounded-full" />

                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer aspect-video bg-gray-200">
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors z-10">
                                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-14 h-14 rounded-full bg-gov-green-600 text-white flex items-center justify-center shadow-lg">
                                        <Play className="w-6 h-6 ml-1 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Placeholder image for video thumbnail */}
                            <img
                                src="https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070&auto=format&fit=crop"
                                alt="System Demo"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />

                            <div className="absolute bottom-4 left-4 right-4 z-20">
                                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full w-1/3 bg-gov-green-600 rounded-full" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">02:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
