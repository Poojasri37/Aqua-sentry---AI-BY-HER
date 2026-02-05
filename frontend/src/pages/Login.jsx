import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    ArrowRight,
    Droplets,
    UserCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPassword from '../components/auth/ForgotPassword';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [role, setRole] = useState('user'); // 'user' maps to business_partner internally
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();

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
            const result = await login(email, password);
            if (result.success) {
                const userRole = result.user.role;
                navigate(userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard');
            } else {
                setError(result.error || 'Invalid credentials. Please verify your identity.');
            }
        } catch (err) {
            setError('Connection to security server failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-50 px-4 font-sans">
            {/* Soft Background Accents */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gov-green-100 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gov-blue-100 rounded-full blur-[120px]" />
            </div>

            <Link
                to="/"
                className="absolute top-8 left-8 text-gray-500 hover:text-gov-green-700 flex items-center gap-2 transition-all z-20 font-medium group"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                        <Droplets className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                        AquaSentry <span className="text-gov-green-700">Login</span>
                    </h1>
                    <p className="text-gray-600 font-medium uppercase tracking-widest text-xs">Official Secure Access Gateway</p>
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

                    {/* Role Selector - Gov Style */}
                    <div className="flex gap-4 p-1.5 bg-gray-100 rounded-xl mb-10">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-lg text-sm font-bold transition-all relative ${role === 'user' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {role === 'user' && (
                                <motion.div layoutId="role-bg-light" className="absolute inset-0 bg-gov-green-700 rounded-lg shadow-md -z-0" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <UserCircle2 className="w-4 h-4" /> User
                            </span>
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-lg text-sm font-bold transition-all relative ${role === 'admin' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {role === 'admin' && (
                                <motion.div layoutId="role-bg-light" className="absolute inset-0 bg-gov-green-700 rounded-lg shadow-md -z-0" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Admin
                            </span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                Identity Clearance (Email)
                            </label>
                            <div className="relative group">
                                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gov-green-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-green-100 focus:border-gov-green-600 transition-all font-medium"
                                    placeholder={role === 'admin' ? "admin@gov.in" : "user@portal.com"}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700">Security Passcode</label>
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPasswordOpen(true)}
                                    className="text-xs text-gov-green-700 hover:text-gov-green-900 font-bold underline"
                                >
                                    Forgot Passcode?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gov-green-600 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-green-100 focus:border-gov-green-600 transition-all font-medium"
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
                            className="w-full relative group bg-gov-green-700 text-white font-bold py-4.5 rounded-xl overflow-hidden transition-all shadow-lg hover:bg-gov-green-800 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Authenticate Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    {role !== 'admin' && (
                        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                            <p className="text-gray-500 text-sm font-medium">
                                Account access required?{' '}
                                <Link to="/contact" className="text-gov-green-700 hover:text-gov-green-900 font-bold">
                                    Contact System Admin
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center opacity-70">
                    <p className="text-xs text-gray-500 font-medium">
                        © 2026 Jal Jeevan Mission Integrated Portal. Protected by AquaSentry AI.
                    </p>
                </div>
            </motion.div>

            <ForgotPassword
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </div>
    );
};

export default Login;
