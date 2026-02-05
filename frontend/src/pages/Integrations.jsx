import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Database, Zap, Shield, Code, Webhook } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const integrations = [
    {
        icon: <Cloud className="w-8 h-8" />,
        name: "Google Gemini AI",
        description: "Advanced AI recommendations and strategic insights",
        category: "AI/ML",
        color: "bg-gov-blue-100 text-gov-blue-700"
    },
    {
        icon: <Zap className="w-8 h-8" />,
        name: "Groq/Llama",
        description: "High-speed predictions and conversational AI",
        category: "AI/ML",
        color: "bg-gov-green-100 text-gov-green-700"
    },
    {
        icon: <Database className="w-8 h-8" />,
        name: "IoT Sensors",
        description: "Real-time data from pH, turbidity, and level sensors",
        category: "Hardware",
        color: "bg-gov-red-100 text-gov-red-700"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        name: "BIS Standards",
        description: "Compliance with IS 10500 drinking water standards",
        category: "Compliance",
        color: "bg-gov-blue-100 text-gov-blue-700"
    },
    {
        icon: <Code className="w-8 h-8" />,
        name: "REST API",
        description: "40+ endpoints for complete system integration",
        category: "Developer",
        color: "bg-gov-green-100 text-gov-green-700"
    },
    {
        icon: <Webhook className="w-8 h-8" />,
        name: "Webhooks",
        description: "Real-time event notifications and alerts",
        category: "Developer",
        color: "bg-gov-red-100 text-gov-red-700"
    }
];

const Integrations = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Seamless <span className="text-gradient">Integrations</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Connect with leading AI providers, IoT sensors, and compliance standards
                    </motion.p>
                </div>

                {/* Integrations Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {integrations.map((integration, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-xl ${integration.color} flex items-center justify-center mb-4`}>
                                {integration.icon}
                            </div>
                            <span className="text-xs font-semibold text-gov-green-700 uppercase tracking-wide">{integration.category}</span>
                            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{integration.name}</h3>
                            <p className="text-gray-600 text-sm">{integration.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* API Documentation */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
                    <p className="text-gray-600 mb-6">
                        Integrate AquaSentry into your existing infrastructure with our comprehensive REST API
                    </p>
                    <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto">
                        <div className="mb-2"><span className="text-gray-500"># Get all tanks</span></div>
                        <div className="mb-4">GET /api/tanks</div>
                        <div className="mb-2"><span className="text-gray-500"># Get AI predictions</span></div>
                        <div className="mb-4">GET /api/ai/predict/:tank_id</div>
                        <div className="mb-2"><span className="text-gray-500"># Upload vision analysis</span></div>
                        <div>POST /api/ai/vision/water</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Integrations;
