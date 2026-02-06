import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, Send, CheckCircle, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate API call
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden">
            <Navbar />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-blue-50/50 blur-[120px] rounded-full pointer-events-none -mr-32 -mt-32" />
            <div className="absolute top-1/2 left-0 w-1/3 h-[400px] bg-cyan-50/30 blur-[100px] rounded-full pointer-events-none -ml-20" />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <MessageSquare className="w-4 h-4" /> Get in touch
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-8 text-gray-950 tracking-tighter"
                    >
                        How can we <span className="text-gradient">help you?</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Have questions about AquaSentry's AI monitoring? Our team is ready to assist you in making your community's water safer.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="card-premium p-10">
                            <h3 className="text-2xl font-black mb-8 text-gray-950 flex items-center gap-2 tracking-tight">
                                Contact Information
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="p-4 bg-blue-50 rounded-2xl shadow-sm text-blue-600">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-950 mb-2 uppercase text-xs tracking-widest">Email Us</h4>
                                        <div className="space-y-1">
                                            <a href="mailto:poojasrinirmalamanickam@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors block font-bold">
                                                poojasrinirmalamanickam@gmail.com
                                            </a>
                                            <a href="mailto:deepthitheeran@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors block font-bold">
                                                deepthitheeran@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="p-4 bg-cyan-50 rounded-2xl shadow-sm text-cyan-600">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-950 mb-2 uppercase text-xs tracking-widest">Call Us</h4>
                                        <p className="text-gray-600 font-bold">Mon - Fri • 9:00 AM - 6:00 PM (IST)</p>
                                        <p className="text-blue-600 font-black">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="p-4 bg-indigo-50 rounded-2xl shadow-sm text-indigo-600">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-950 mb-2 uppercase text-xs tracking-widest">Main Office</h4>
                                        <p className="text-gray-600 font-bold">Water Quality Division</p>
                                        <p className="text-gray-600 font-bold leading-relaxed">Salem, Tamil Nadu, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">Support Hours</h3>
                                <p className="text-slate-300 font-medium mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p className="text-cyan-400 font-black italic">24/7 Emergency Support for District Admins</p>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="card-premium p-10 md:p-12 relative overflow-hidden">
                            {submitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                                        >
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </motion.div>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-950 mb-4 tracking-tight uppercase">Message Sent Successfully!</h3>
                                    <p className="text-gray-600 font-bold text-lg max-w-sm">Thank you for reaching out. An agent will contact you within 24 hours.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-10 text-blue-600 font-black uppercase text-xs tracking-widest hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-gray-400"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-gray-400"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Message Details</label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <textarea
                                                required
                                                rows="5"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-gray-400"
                                                placeholder="How can our AI system help you better?"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full btn-primary py-5 text-lg shadow-aqua flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        Send Message <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
