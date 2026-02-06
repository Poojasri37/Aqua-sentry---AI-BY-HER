import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Eye, Map, Wrench, Droplets, ArrowRight } from 'lucide-react';

const features = [
    {
        icon: <Activity className="w-6 h-6" />,
        title: "Real-Time Monitoring",
        description: "Track pH, turbidity, and water levels with millisecond latency sensors.",
        color: "bg-gov-blue-50 text-gov-blue-600 border-gov-blue-200"
    },
    {
        icon: <Brain className="w-6 h-6" />,
        title: "AI Recommendations",
        description: "Get actionable insights and automated treatment suggestions powered by ML models.",
        color: "bg-gov-blue-50 text-indigo-700 border-indigo-200"
    },
    {
        icon: <Eye className="w-6 h-6" />,
        title: "Vision Analysis",
        description: "Upload images to detect contamination, rust, or structural damage instantly.",
        color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
        icon: <Map className="w-6 h-6" />,
        title: "Geo-Spatial Mapping",
        description: "Interactive heatmaps of water quality across different wards and zones.",
        color: "bg-gov-blue-100 text-gov-blue-800 border-gov-blue-300"
    },
    {
        icon: <Wrench className="w-6 h-6" />,
        title: "Predictive Maintenance",
        description: "Forecast equipment failures before they happen to prevent downtime.",
        color: "bg-gov-blue-100 text-gov-blue-900 border-gov-blue-400"
    },
    {
        icon: <Droplets className="w-6 h-6" />,
        title: "Demand Forecasting",
        description: "Predict future water usage trends to optimize distribution and storage.",
        color: "bg-sky-50 text-sky-700 border-sky-200"
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-4xl md:text-5xl font-black mb-4 text-gray-950 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Advanced <span className="bg-clip-text text-transparent bg-gradient-to-r from-gov-blue-700 to-indigo-800">Capabilities</span>
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Our comprehensive suite of tools ensures you have complete control over your water infrastructure, powered by state-of-the-art technology.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-200/40 hover:border-blue-300 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 border ${feature.color} group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 mb-6">
                                {feature.description}
                            </p>

                            <div className="flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
                                Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
