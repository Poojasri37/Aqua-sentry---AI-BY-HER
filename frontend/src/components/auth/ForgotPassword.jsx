import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Key, ArrowRight, CheckCircle, X, ShieldAlert, Fingerprint } from 'lucide-react';

const ForgotPassword = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate OTP trigger
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
        }, 1200);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            setIsLoading(true);
            // Simulate Password Reset
            setTimeout(() => {
                setIsLoading(false);
                onClose();
                setStep(1);
                // Reset state
                setEmail('');
                setOtp(['', '', '', '', '', '']);
                setNewPassword('');
                setConfirmPassword('');
            }, 1500);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-md bg-white border border-gray-200 rounded-[2rem] shadow-2xl overflow-hidden relative"
                >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gov-blue-600 via-indigo-600 to-gov-blue-800" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-10">
                        <div className="mb-10 text-center">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                {step === 1 && <Mail className="w-8 h-8 text-gov-blue-700" />}
                                {step === 2 && <ShieldAlert className="w-8 h-8 text-indigo-700 animate-pulse" />}
                                {step === 3 && <Fingerprint className="w-8 h-8 text-gov-blue-800" />}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                {step === 1 && 'Recover Access'}
                                {step === 2 && 'Identity Verification'}
                                {step === 3 && 'New Passcode'}
                            </h3>
                            <p className="text-gray-600 text-sm font-medium">
                                {step === 1 && 'Enter your authorized email to sync.'}
                                {step === 2 && `Enter the 6-digit code sent to your inbox.`}
                                {step === 3 && 'Define a new secure hash for your identity.'}
                            </p>
                        </div>

                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gov-blue-700" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-50 focus:border-gov-blue-700 transition-all font-medium"
                                            placeholder="identity@gov.in"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gov-blue-700 text-white font-bold py-4 rounded-xl hover:bg-gov-blue-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Request Secure Code <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleOtpSubmit} className="space-y-8">
                                <div className="flex gap-2 justify-center">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            autoFocus={i === 0}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gov-blue-100 focus:border-gov-blue-600 outline-none"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gov-blue-700 text-white font-bold py-4 rounded-xl hover:bg-gov-blue-800 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify Identity <CheckCircle className="w-5 h-5" /></>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm font-bold text-center text-gray-500 hover:text-gov-blue-700 transition-colors uppercase tracking-widest"
                                >
                                    Re-send Uplink
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gov-blue-700" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-50 focus:border-gov-blue-700 transition-all font-medium"
                                            placeholder="New Security Passcode"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gov-blue-700" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-50 focus:border-gov-blue-700 transition-all font-medium"
                                            placeholder="Confirm Passcode"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gov-blue-700 text-white font-bold py-4 rounded-xl hover:bg-gov-blue-800 shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Commit Vault Reset <CheckCircle className="w-5 h-5" /></>}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ForgotPassword;
