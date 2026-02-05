import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, FileText } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const Documentation = () => {
    const [activeTab, setActiveTab] = useState('getting-started');

    const tabs = [
        { id: 'getting-started', label: 'Getting Started', icon: <Book className="w-5 h-5" /> },
        { id: 'api', label: 'API Reference', icon: <Code className="w-5 h-5" /> },
        { id: 'guides', label: 'Guides', icon: <FileText className="w-5 h-5" /> },
        { id: 'cli', label: 'CLI Tools', icon: <Terminal className="w-5 h-5" /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        <span className="text-gradient">Documentation</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to integrate and use AquaSentry
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg sticky top-24">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${activeTab === tab.id
                                            ? 'bg-gov-green-100 text-gov-green-800 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                            {activeTab === 'getting-started' && (
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
                                    <div className="prose max-w-none">
                                        <h3 className="text-xl font-semibold mb-3">Installation</h3>
                                        <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-6">
                                            npm install @aquasentry/sdk
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3">Quick Start</h3>
                                        <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-6 overflow-x-auto">
                                            <div>import AquaSentry from '@aquasentry/sdk';</div>
                                            <div className="mt-2">const client = new AquaSentry(&#123;</div>
                                            <div className="ml-4">apiKey: 'your-api-key',</div>
                                            <div className="ml-4">region: 'in-south-1'</div>
                                            <div>&#125;);</div>
                                            <div className="mt-2">// Fetch tank data</div>
                                            <div>const tanks = await client.tanks.list();</div>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3">Authentication</h3>
                                        <p className="text-gray-600 mb-4">
                                            All API requests require authentication using JWT tokens. Include your token in the Authorization header.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'api' && (
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">GET /api/tanks</h3>
                                            <p className="text-gray-600 mb-3">Retrieve all water tanks with current status</p>
                                            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
                                                curl -H "Authorization: Bearer YOUR_TOKEN" \<br />
                                                &nbsp;&nbsp;https://api.aquasentry.ai/api/tanks
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">GET /api/ai/predict/:tank_id</h3>
                                            <p className="text-gray-600 mb-3">Get AI predictions for a specific tank</p>
                                            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
                                                curl -H "Authorization: Bearer YOUR_TOKEN" \<br />
                                                &nbsp;&nbsp;https://api.aquasentry.ai/api/ai/predict/tank-123
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">POST /api/ai/vision/water</h3>
                                            <p className="text-gray-600 mb-3">Upload image for vision analysis</p>
                                            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
                                                curl -X POST \<br />
                                                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_TOKEN" \<br />
                                                &nbsp;&nbsp;-F "image=@water-sample.jpg" \<br />
                                                &nbsp;&nbsp;https://api.aquasentry.ai/api/ai/vision/water
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'guides' && (
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Guides</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold mb-2">Setting Up Real-Time Monitoring</h3>
                                            <p className="text-gray-600 text-sm">Learn how to configure IoT sensors and connect them to AquaSentry</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold mb-2">Configuring AI Alerts</h3>
                                            <p className="text-gray-600 text-sm">Set up intelligent alerts based on water quality thresholds</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold mb-2">GIS Integration</h3>
                                            <p className="text-gray-600 text-sm">Integrate ward boundaries and create custom heatmaps</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold mb-2">BIS Compliance Reporting</h3>
                                            <p className="text-gray-600 text-sm">Generate compliance reports for IS 10500 standards</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'cli' && (
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">CLI Tools</h2>
                                    <div className="prose max-w-none">
                                        <h3 className="text-xl font-semibold mb-3">Installation</h3>
                                        <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-6">
                                            npm install -g @aquasentry/cli
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3">Common Commands</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
                                                    aqua login
                                                </div>
                                                <p className="text-gray-600 text-sm mt-2">Authenticate with your account</p>
                                            </div>
                                            <div>
                                                <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
                                                    aqua tanks list
                                                </div>
                                                <p className="text-gray-600 text-sm mt-2">List all tanks in your account</p>
                                            </div>
                                            <div>
                                                <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
                                                    aqua alerts --tank=tank-123
                                                </div>
                                                <p className="text-gray-600 text-sm mt-2">View alerts for a specific tank</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Documentation;
