import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Eye, Map, Wrench, Droplets, CheckCircle } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const features = [
    {
        icon: <Activity className="w-8 h-8" />,
        title: "Real-Time Monitoring",
        description: "Track pH, turbidity, and water levels with millisecond latency sensors.",
        details: [
            "Live sensor data updates every second",
            "pH range: 6.5-8.5 (BIS standards)",
            "Turbidity monitoring < 5 NTU",
            "Temperature, dissolved oxygen, chlorine tracking",
            "Automated threshold alerts"
        ],
        color: "from-gov-green-500 to-gov-green-700"
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: "AI Recommendations",
        description: "Get actionable insights and automated treatment suggestions powered by ML models.",
        details: [
            "Google Gemini AI integration",
            "Predictive maintenance scheduling",
            "Water quality forecasting (24h/48h)",
            "Anomaly detection algorithms",
            "Cost-optimized treatment plans"
        ],
        color: "from-gov-blue-600 to-gov-blue-800"
    },
    {
        icon: <Eye className="w-8 h-8" />,
        title: "Vision Analysis",
        description: "Upload images to detect contamination, rust, or structural damage instantly.",
        details: [
            "AI-powered image analysis",
            "Contamination detection",
            "Rust and corrosion identification",
            "Algae growth monitoring",
            "Infrastructure damage assessment"
        ],
        color: "from-gov-green-600 to-gov-green-800"
    },
    {
        icon: <Map className="w-8 h-8" />,
        title: "Geo-Spatial Mapping",
        description: "Interactive heatmaps of water quality across different wards and zones.",
        details: [
            "GeoJSON ward boundaries",
            "Multi-metric heatmaps",
            "Color-coded status visualization",
            "Ward-level aggregation",
            "Geographic bounds calculation"
        ],
        color: "from-gov-red-600 to-gov-red-800"
    },
    {
        icon: <Wrench className="w-8 h-8" />,
        title: "Predictive Maintenance",
        description: "Forecast equipment failures before they happen to prevent downtime.",
        details: [
            "ML-based failure prediction",
            "Maintenance schedule optimization",
            "Auto-calculation of next service dates",
            "Equipment health scoring",
            "Downtime prevention alerts"
        ],
        color: "from-gov-blue-500 to-gov-blue-700"
    },
    {
        icon: <Droplets className="w-8 h-8" />,
        title: "Demand Forecasting",
        description: "Predict future water usage trends to optimize distribution and storage.",
        details: [
            "Consumption pattern analysis",
            "Seasonal demand prediction",
            "Leakage and overflow detection",
            "Rainwater harvesting potential",
            "Distribution optimization"
        ],
        color: "from-gov-green-500 to-gov-blue-600"
    }
];

const FeaturesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Powerful <span className="text-gradient">Features</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Comprehensive water management capabilities for modern municipalities
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center text-gov-green-700">
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 mb-6">{feature.description}</p>

                            <div className="space-y-3">
                                {feature.details.map((detail, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-gov-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        Experience the power of AI-driven water management for your municipality
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-8 py-4 bg-white text-gov-green-700 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                    >
                        Start Free Trial
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FeaturesPage;
