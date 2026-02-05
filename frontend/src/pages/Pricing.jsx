import React from 'react';
import { motion } from 'framer-motion';
import { Check, Building2, Users, Zap } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const pricingPlans = [
    {
        name: "Municipal",
        icon: <Building2 className="w-8 h-8" />,
        price: "Contact Us",
        description: "For government water utilities and municipalities",
        features: [
            "Up to 50 water tanks",
            "Real-time monitoring",
            "AI recommendations",
            "Vision analysis",
            "GIS mapping",
            "24/7 support",
            "BIS compliance reports",
            "Jal Jeevan Mission integration"
        ],
        color: "from-gov-green-600 to-gov-green-800",
        popular: true
    },
    {
        name: "Enterprise",
        icon: <Users className="w-8 h-8" />,
        price: "Custom",
        description: "For large water distribution networks",
        features: [
            "Unlimited tanks",
            "Advanced AI features",
            "Custom integrations",
            "Dedicated account manager",
            "On-premise deployment",
            "Custom SLA",
            "White-label options",
            "Training & onboarding"
        ],
        color: "from-gov-blue-600 to-gov-blue-800",
        popular: false
    },
    {
        name: "Pilot",
        icon: <Zap className="w-8 h-8" />,
        price: "Free",
        description: "Try AquaSentry with limited features",
        features: [
            "Up to 5 water tanks",
            "Basic monitoring",
            "Standard alerts",
            "Email support",
            "30-day trial",
            "Demo data included"
        ],
        color: "from-gov-red-600 to-gov-red-800",
        popular: false
    }
];

const Pricing = () => {
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
                        Simple, <span className="text-gradient">Transparent Pricing</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Choose the plan that fits your water management needs
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white p-8 rounded-2xl border-2 ${plan.popular ? 'border-gov-green-500 shadow-xl' : 'border-gray-200 shadow-lg'} relative`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gov-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            )}

                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4`}>
                                {plan.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-gov-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => window.location.href = '/contact'}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-gov-green-600 to-gov-green-700 text-white hover:from-gov-green-700 hover:to-gov-green-800'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Can I switch plans later?</h4>
                            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
                            <p className="text-gray-600">No setup fees for any plan. We'll help you get started for free.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                            <p className="text-gray-600">We accept bank transfers, government purchase orders, and online payments.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Pricing;
