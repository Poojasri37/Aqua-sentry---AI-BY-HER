import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Droplets, Info } from 'lucide-react';

const RequestTankModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        location: '',
        capacity: '',
        purpose: 'Irrigation',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10"
                    >
                        {isSuccess ? (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <Send className="w-10 h-10" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
                                <p className="text-gray-500">Our administrators will review your request for a new tank in {formData.location} and get back to you soon.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-gradient-to-r from-gov-green-600 to-gov-green-700 p-8 text-white relative">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <h2 className="text-3xl font-bold mb-2">Request New Tank</h2>
                                    <p className="text-white/80 font-medium">Expand your monitoring network</p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gov-green-600" /> Location (Tamil Nadu)
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Tiruppur Sector G"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-gov-green-500 focus:bg-white transition-all transition-all"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Droplets className="w-4 h-4 text-gov-green-600" /> Capacity (Liters)
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="5000"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-gov-green-500 transition-all focus:bg-white"
                                                    value={formData.capacity}
                                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-gov-green-600" /> Purpose
                                                </label>
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-gov-green-500 transition-all focus:bg-white"
                                                    value={formData.purpose}
                                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                                >
                                                    <option>Irrigation</option>
                                                    <option>Drinking Water</option>
                                                    <option>Industrial Use</option>
                                                    <option>Poultry Farm</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Additional Notes</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Describe why a new tank is needed at this location..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-gov-green-500 transition-all focus:bg-white resize-none"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gov-green-600 text-white font-bold py-4 rounded-xl hover:bg-gov-green-700 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" /> Submit Request
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RequestTankModal;
