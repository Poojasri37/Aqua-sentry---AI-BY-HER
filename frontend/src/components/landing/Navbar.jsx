import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg h-16 border-b border-gray-100' : 'bg-transparent h-20'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 bg-gradient-to-br from-gov-blue-700 to-gov-blue-900 rounded-lg shadow-md group-hover:shadow-blue-500/50 transition-all">
                            <Droplets className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            AquaSentry
                        </span>
                    </div>

                    {/* Login Button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLoginClick}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gov-blue-700 to-gov-blue-900 text-white font-bold text-sm shadow-md hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
