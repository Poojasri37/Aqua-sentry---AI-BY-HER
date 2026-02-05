import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
        // Update direction for Arabic
        document.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-white/20 transition-colors">
                <Globe className="w-4 h-4 text-gray-600" />
                <select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    className="bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer appearance-none pr-4"
                    style={{ backgroundImage: 'none' }} // Hide default arrow if custom styling is needed, simplified here
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code} className="text-gray-900">
                            {lang.native}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default LanguageSelector;
