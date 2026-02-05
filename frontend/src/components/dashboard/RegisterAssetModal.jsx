import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Droplets, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterAssetModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        capacity: '',
        ward: '',
        purpose: 'residential'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Simulate API call to register asset
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Send notification to admin
            const notification = {
                type: 'asset_registration',
                user: user?.name || 'Unknown User',
                email: user?.email || 'N/A',
                assetDetails: formData,
                timestamp: new Date().toISOString()
            };

            // In a real implementation, this would be an API call
            console.log('Asset Registration Notification:', notification);

            // Store in localStorage for admin to see (temporary solution)
            const existingNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
            existingNotifications.push(notification);
            localStorage.setItem('adminNotifications', JSON.stringify(existingNotifications));

            setSubmitStatus('success');

            // Reset form after 2 seconds
            setTimeout(() => {
                setFormData({
                    name: '',
                    location: '',
                    latitude: '',
                    longitude: '',
                    capacity: '',
                    ward: '',
                    purpose: 'residential'
                });
                setSubmitStatus(null);
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error registering asset:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register New Asset</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Add a water tank to the monitoring system</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                        <div className="space-y-6">
                            {/* Tank Name */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    Tank Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Salem-Ward5-Tank1"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                />
                            </div>

                            {/* Ward */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    Ward Number *
                                </label>
                                <input
                                    type="text"
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Ward 5"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                />
                            </div>

                            {/* Location Address */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    Location Address *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Anna Nagar, Salem, Tamil Nadu"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                />
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                        Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        required
                                        placeholder="11.6643"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                        Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        required
                                        placeholder="78.1460"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Capacity */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    Capacity (Liters) *
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., 50000"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                />
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    Purpose *
                                </label>
                                <select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                >
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="agricultural">Agricultural</option>
                                </select>
                            </div>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-black text-emerald-900">Asset Registered Successfully!</p>
                                        <p className="text-xs text-emerald-600 font-medium">Admin has been notified with your details.</p>
                                    </div>
                                </motion.div>
                            )}

                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <div>
                                        <p className="text-sm font-black text-red-900">Registration Failed</p>
                                        <p className="text-xs text-red-600 font-medium">Please try again or contact support.</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-8 border-t border-slate-200 bg-slate-50 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Droplets className="w-4 h-4" />
                                    Register Asset
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RegisterAssetModal;
