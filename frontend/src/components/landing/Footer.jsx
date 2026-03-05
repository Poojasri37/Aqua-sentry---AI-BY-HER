import React from 'react';
import { Twitter, Github, Linkedin, Droplets, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [isSubscribed, setIsSubscribed] = React.useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        setIsSubscribed(true);
        setTimeout(() => setIsSubscribed(false), 5000);
    };

    return (
        <footer className="relative pt-20 pb-10 overflow-hidden border-t border-white/5 bg-slate-900/40 backdrop-blur-sm">
            {/* Glow effect at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-cyan-500/10 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="p-2 bg-slate-800 rounded-xl shadow-lg border border-white/10">
                                <Droplets className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">AquaSentry<span className="text-cyan-400">.AI</span></span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                            Empowering communities with smart water monitoring solutions, ensuring safety, sustainability, and efficiency through AI-powered precision.
                        </p>
                        <div className="text-slate-400 text-sm mb-8 space-y-3 font-semibold">
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-white/5">
                                    <Mail className="w-4 h-4 text-cyan-400" />
                                </div>
                                <a href="mailto:poojasrinirmalamanickam@gmail.com" className="hover:text-cyan-400 transition-colors">poojasrinirmalamanickam@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-white/5">
                                    <Mail className="w-4 h-4 text-cyan-400" />
                                </div>
                                <a href="mailto:deepthitheeran@gmail.com" className="hover:text-cyan-400 transition-colors">deepthitheeran@gmail.com</a>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="text-slate-500 hover:text-white hover:bg-cyan-600 transition-all p-2.5 bg-slate-800 rounded-xl shadow-sm border border-white/5">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-lg mb-8 tracking-tight">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400 font-bold">
                            <li><Link to="/features" className="hover:text-cyan-400 transition-colors">Core Features</Link></li>
                            <li><Link to="/integrations" className="hover:text-cyan-400 transition-colors">Smart Integrations</Link></li>
                            <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors">Our Plans</Link></li>
                            <li><Link to="/documentation" className="hover:text-cyan-400 transition-colors">Support Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-lg mb-8 tracking-tight">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400 font-bold">
                            <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-cyan-400 transition-colors">Join the Team</Link></li>
                            <li><Link to="/blog" className="hover:text-cyan-400 transition-colors">Latest News</Link></li>
                            <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Get in Touch</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-lg mb-8 tracking-tight">Stay Updated</h4>
                        <p className="text-sm text-slate-400 mb-6 font-bold">Subscribe for the latest system updates and AI insights.</p>
                        {isSubscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Subscribed!</span>
                            </motion.div>
                        ) : (
                            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full px-5 py-3 bg-slate-800 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-semibold text-white placeholder-slate-500"
                                />
                                <button className="w-full py-3 btn-primary text-sm shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold hover:shadow-cyan-500/40 transition-all">
                                    Join Newsletter
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 font-bold tracking-tight">© 2026 AquaSentry AI. All Rights Reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-500 font-medium tracking-tight">
                        <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
