import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enAuth from './locales/en/auth.json';
import esAuth from './locales/es/auth.json';
import frAuth from './locales/fr/auth.json';
import hiAuth from './locales/hi/auth.json';
import arAuth from './locales/ar/auth.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { auth: enAuth },
            es: { auth: esAuth },
            fr: { auth: frAuth },
            hi: { auth: hiAuth },
            ar: { auth: arAuth },
        },
        fallbackLng: 'en',
        debug: true,
        ns: ['auth'],
        defaultNS: 'auth',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
