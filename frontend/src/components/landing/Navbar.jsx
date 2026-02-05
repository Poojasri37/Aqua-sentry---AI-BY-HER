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
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md h-16' : 'bg-white/95 h-20'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 bg-gradient-to-br from-gov-green-600 to-gov-green-800 rounded-lg">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            AquaSentry<span className="text-gov-green-700">.AI</span>
                        </span>
                    </div>

                    {/* Login Button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLoginClick}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gov-green-600 to-gov-green-700 text-white font-medium text-sm hover:shadow-lg hover:from-gov-green-700 hover:to-gov-green-800 transition-all transform hover:-translate-y-0.5"
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
