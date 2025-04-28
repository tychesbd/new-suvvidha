import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the language context
const LanguageContext = createContext();

// Available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'mr', name: 'मराठी' },
];

// Translations for different languages
export const translations = {
  en: {
    home: 'Home',
    services: 'Services',
    aboutUs: 'About Us',
    profile: 'Profile',
    dashboard: 'Dashboard',
    logout: 'Logout',
    signIn: 'Sign In',
    welcome: 'Welcome',
  },
  hi: {
    home: 'होम',
    services: 'सेवाएं',
    aboutUs: 'हमारे बारे में',
    profile: 'प्रोफाइल',
    dashboard: 'डैशबोर्ड',
    logout: 'लॉग आउट',
    signIn: 'साइन इन',
    welcome: 'स्वागत है',
  },
  gu: {
    home: 'હોમ',
    services: 'સેવાઓ',
    aboutUs: 'અમારા વિશે',
    profile: 'પ્રોફાઇલ',
    dashboard: 'ડેશબોર્ડ',
    logout: 'લૉગ આઉટ',
    signIn: 'સાઇન ઇન',
    welcome: 'સ્વાગત છે',
  },
  mr: {
    home: 'होम',
    services: 'सेवा',
    aboutUs: 'आमच्याबद्दल',
    profile: 'प्रोफाइल',
    dashboard: 'डॅशबोर्ड',
    logout: 'लॉग आउट',
    signIn: 'साइन इन',
    welcome: 'स्वागत आहे',
  },
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to change language
  const changeLanguage = (code) => {
    setLanguage(code);
  };

  // Get translations for current language
  const getTranslation = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};