import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const jobs = [
    {
        title: "Senior AI Engineer",
        department: "Engineering",
        location: "Bengaluru, India",
        type: "Full-time",
        description: "Build and optimize AI models for water quality prediction and anomaly detection"
    },
    {
        title: "IoT Solutions Architect",
        department: "Engineering",
        location: "Delhi, India",
        type: "Full-time",
        description: "Design and implement IoT sensor networks for municipal water infrastructure"
    },
    {
        title: "Product Manager",
        department: "Product",
        location: "Remote",
        type: "Full-time",
        description: "Drive product strategy for government water management solutions"
    },
    {
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Chennai, India",
        type: "Full-time",
        description: "Help municipalities successfully deploy and use AquaSentry"
    }
];

const Careers = () => {
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
                        Join Our <span className="text-gradient">Team</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Help us build the future of water management in India
                    </motion.p>
                </div>

                {/* Values */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Mission-Driven</h3>
                        <p className="text-gray-600">Solve real problems for millions of people</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Innovation</h3>
                        <p className="text-gray-600">Work with cutting-edge technology</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Impact</h3>
                        <p className="text-gray-600">Make a difference in water sustainability</p>
                    </div>
                </div>

                {/* Job Listings */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                        <p className="text-gray-600 mb-3">{job.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                {job.department}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/contact'}
                                        className="px-6 py-3 bg-gradient-to-r from-gov-green-600 to-gov-green-700 text-white rounded-xl font-semibold hover:from-gov-green-700 hover:to-gov-green-800 transition-all whitespace-nowrap"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Don't see a role that fits?</h2>
                    <p className="mb-8 max-w-2xl mx-auto">
                        We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
                    </p>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="px-8 py-4 bg-white text-gov-green-700 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                    >
                        Get in Touch
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Careers;
