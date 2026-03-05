import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ArrowRight,
    Wrench,
    HardHat
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TechnicianSignup = () => {
    const role = 'technician'; // Hardcoded role
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register, isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/technician/dashboard';
            navigate(redirectPath);
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await register(name, email, password, role);
            if (result.success) {
                navigate('/technician/dashboard');
            } else {
                setError(result.error || 'Registration failed. Please check your details.');
            }
        } catch (err) {
            setError('Connection to security server failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900 px-4 font-sans py-12">
            {/* Dark Background Accents */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <Link
                to="/"
                className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-all z-20 font-medium group"
            >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Portal
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-4 ring-white/10">
                        <div className="animate-pulse">
                            <Wrench className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        Technician <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Portal Access</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Field Operations Registration</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-blue-500" />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm flex items-center gap-3 font-medium"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                Full Name
                            </label>
                            <div className="relative group">
                                <HardHat className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                                    placeholder="tech@aquasentry.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-6 rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Register as Technician <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/10 text-center">
                        <p className="text-slate-400 text-sm font-medium">
                            Already a field agent?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold">
                                Login to Console
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TechnicianSignup;
