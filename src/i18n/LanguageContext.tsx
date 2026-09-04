import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LanguageOption, TranslationDict } from './types';
import { SUPPORTED_LANGUAGES, translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDict;
  isRTL: boolean;
  currentLanguageOption: LanguageOption;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'fursad_preferred_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'so' || saved === 'en' || saved === 'ar' || saved === 'fr')) {
        return saved as SupportedLanguage;
      }
    } catch {
      // fallback
    }
    return 'en'; // Default language set to English
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const isRTL = language === 'ar';
  const currentLanguageOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES.find(l => l.code === 'en') || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    // Update HTML root attributes for direction and language
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    if (isRTL) {
      document.body.classList.add('rtl-mode');
    } else {
      document.body.classList.remove('rtl-mode');
    }
  }, [language, isRTL]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language] || translations.en,
    isRTL,
    currentLanguageOption,
    availableLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
