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
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                    >
                        Get in <span className="text-gradient">Touch</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions about AquaSentry? We're here to help. Reach out to us directly or fill out the form below.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gov-green-100 rounded-lg">
                                        <Mail className="w-6 h-6 text-gov-green-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                                        <a href="mailto:poojasrinirmalamanickam@gmail.com" className="text-gov-green-700 hover:text-gov-green-800 block">
                                            poojasrinirmalamanickam@gmail.com
                                        </a>
                                        <a href="mailto:deepthitheeran@gmail.com" className="text-gov-green-700 hover:text-gov-green-800 block">
                                            deepthitheeran@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gov-blue-100 rounded-lg">
                                        <Phone className="w-6 h-6 text-gov-blue-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
                                        <p className="text-gray-600">Available Monday - Friday</p>
                                        <p className="text-gray-600">9:00 AM - 6:00 PM (IST)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gov-red-100 rounded-lg">
                                        <MapPin className="w-6 h-6 text-gov-red-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                                        <p className="text-gray-600">India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gov-green-600 to-gov-green-800 p-8 rounded-2xl text-white shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                            <p className="mb-2">Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
                            <p>Weekend support available for critical alerts.</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg"
                    >
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-gov-green-500 focus:bg-white transition-all placeholder:text-gray-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-gov-green-500 focus:bg-white transition-all placeholder:text-gray-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Message</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                        <textarea
                                            required
                                            rows="4"
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-gov-green-500 focus:bg-white transition-all placeholder:text-gray-500"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-gov-green-600 to-gov-green-700 text-white font-bold py-3.5 rounded-xl hover:from-gov-green-700 hover:to-gov-green-800 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    Send Message <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
