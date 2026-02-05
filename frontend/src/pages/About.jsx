import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, ShieldCheck, Activity, Users, Server, Database, Cloud, Cpu } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        About <span className="text-gradient">AquaSentry</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Advanced water tank monitoring system designed to revolutionize water management through AI-driven recommendations, real-time alerts, and IoT integration.
                    </motion.p>
                </div>

                {/* Mission Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Water is life, yet its management remains one of the greatest challenges of our time. At AquaSentry, we are committed to solving this through technology.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our platform empowers communities and businesses by providing real-time visibility into their water infrastructure, ensuring safety, sustainability, and operational efficiency using cutting-edge AI and IoT solutions.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-gov-green-50 rounded-xl text-center">
                                    <ShieldCheck className="w-8 h-8 text-gov-green-700 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900">Safety First</h3>
                                </div>
                                <div className="p-4 bg-gov-blue-50 rounded-xl text-center">
                                    <Activity className="w-8 h-8 text-gov-blue-700 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900">Real-time Data</h3>
                                </div>
                                <div className="p-4 bg-gov-blue-50 rounded-xl text-center">
                                    <Users className="w-8 h-8 text-gov-blue-700 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900">Community</h3>
                                </div>
                                <div className="p-4 bg-gov-green-50 rounded-xl text-center">
                                    <Droplets className="w-8 h-8 text-gov-green-700 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900">Sustainability</h3>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Architecture Diagram */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold mb-8 text-center">System Architecture</h2>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Frontend Layer */}
                            <div className="text-center">
                                <div className="p-4 bg-gov-blue-100 rounded-xl mb-4">
                                    <Server className="w-12 h-12 text-gov-blue-700 mx-auto" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Frontend Layer</h3>
                                <p className="text-sm text-gray-600 mb-3">React.js + Tailwind CSS</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Dashboard UI</li>
                                    <li>• Real-time Charts</li>
                                    <li>• Responsive Design</li>
                                </ul>
                            </div>

                            {/* Backend Layer */}
                            <div className="text-center">
                                <div className="p-4 bg-gov-green-100 rounded-xl mb-4">
                                    <Cpu className="w-12 h-12 text-gov-green-700 mx-auto" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Backend Layer</h3>
                                <p className="text-sm text-gray-600 mb-3">Python + FastAPI</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• REST API</li>
                                    <li>• AI/ML Models</li>
                                    <li>• WebSocket</li>
                                </ul>
                            </div>

                            {/* Data Layer */}
                            <div className="text-center">
                                <div className="p-4 bg-gov-red-100 rounded-xl mb-4">
                                    <Database className="w-12 h-12 text-gov-red-700 mx-auto" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Data Layer</h3>
                                <p className="text-sm text-gray-600 mb-3">IoT + Storage</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Sensor Data</li>
                                    <li>• JSON Storage</li>
                                    <li>• Real-time Sync</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Flow */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                <span className="font-semibold">IoT Sensors</span>
                                <span>→</span>
                                <span className="font-semibold">Backend API</span>
                                <span>→</span>
                                <span className="font-semibold">AI Processing</span>
                                <span>→</span>
                                <span className="font-semibold">Dashboard</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team/Contact Section */}
                <div className="text-center bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">Built for the Future</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        We are continuously evolving. Join us in our journey to make water management smarter and more accessible for everyone.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
