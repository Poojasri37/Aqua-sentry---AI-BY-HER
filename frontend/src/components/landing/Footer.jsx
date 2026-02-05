import React from 'react';
import { Twitter, Github, Linkedin, Droplets, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 relative overflow-hidden">
            {/* Glow effect at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gov-green-100/30 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-1.5 bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-md">
                                <Droplets className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">AquaSentry</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Empowering communities with smart water monitoring solutions. ensuring safety, sustainability, and efficiency.
                        </p>
                        <div className="text-gray-700 text-sm mb-6 space-y-2">
                            <div className="flex items-center gap-2 group">
                                <Mail className="w-4 h-4 text-gov-green-600" />
                                <a href="mailto:poojasrinirmalamanickam@gmail.com" className="hover:text-gov-green-700 transition-colors italic">poojasrinirmalamanickam@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-2 group">
                                <Mail className="w-4 h-4 text-gov-green-600" />
                                <a href="mailto:deepthitheeran@gmail.com" className="hover:text-gov-green-700 transition-colors italic">deepthitheeran@gmail.com</a>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="text-gray-500 hover:text-gov-green-700 transition-colors p-2 bg-gray-50 rounded-lg">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/features" className="hover:text-gov-green-700 transition-colors">Features</Link></li>
                            <li><Link to="/integrations" className="hover:text-gov-green-700 transition-colors">Integrations</Link></li>
                            <li><Link to="/pricing" className="hover:text-gov-green-700 transition-colors">Pricing</Link></li>
                            <li><Link to="/documentation" className="hover:text-gov-green-700 transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/about" className="hover:text-gov-green-700 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-gov-green-700 transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-gov-green-700 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-gov-green-700 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-gray-600 mb-4 font-medium">Subscribe for system updates</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gov-green-500 transition-colors"
                            />
                            <button className="px-4 py-2 bg-gov-green-700 text-white rounded-lg text-sm font-bold hover:bg-gov-green-800 transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600 italic">
                    <p>© 2026 AquaSentry. Precision Water Management for the Future.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
