import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    ArrowRight,
    Droplets,
    UserCircle2,
    User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [role, setRole] = useState('user');
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
            const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
            navigate(redirectPath);
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const roleToSubmit = role === 'user' ? 'business_partner' : role;
            const result = await register(name, email, password, roleToSubmit);
            if (result.success) {
                const userRole = result.user.role;
                navigate(userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard');
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
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden mesh-gradient animate-gradient-flow px-4 font-sans py-12">
            {/* Soft Background Accents */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gov-blue-100 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px]" />
            </div>

            <Link
                to="/"
                className="absolute top-8 left-8 text-gray-500 hover:text-gov-blue-700 flex items-center gap-2 transition-all z-20 font-medium group"
            >
                <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
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
                    <div className="w-16 h-16 bg-gradient-to-br from-gov-blue-700 to-gov-blue-900 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                        <div className="animate-bounce">
                            <Droplets className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-gray-950 tracking-tight mb-2">
                        AquaSentry <span className="bg-clip-text text-transparent bg-gradient-to-r from-gov-blue-700 to-indigo-800">Account Registration</span>
                    </h1>
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Official Secure Access Gateway</p>
                </div>

                <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gov-green-600 to-gov-blue-600" />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3 font-medium"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            {error}
                        </motion.div>
                    )}



                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gov-blue-700 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-blue-100 focus:border-gov-blue-700 transition-all font-medium"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                Identity Clearance (Email)
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gov-blue-700 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-blue-100 focus:border-gov-blue-700 transition-all font-medium"
                                    placeholder="user@portal.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Security Passcode</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gov-blue-700 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-blue-100 focus:border-gov-blue-700 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group bg-gov-blue-700 text-white font-bold py-6 rounded-xl overflow-hidden transition-all shadow-lg hover:bg-gov-blue-800 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Secure Account <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-gov-blue-700 hover:text-gov-blue-900 font-bold">
                                Log in here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center opacity-70">
                    <p className="text-xs text-gray-500 font-medium">
                        © 2026 Jal Jeevan Mission Integrated Portal. Protected by AquaSentry AI.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
