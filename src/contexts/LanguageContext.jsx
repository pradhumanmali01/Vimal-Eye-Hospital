/**
 * LANGUAGE CONTEXT & PROVIDER
 */
import React, { createContext, useState, useContext } from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/ai/constants';
import { getTranslation } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const switchLanguage = (code) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === code)) {
      setLang(code);
    }
  };

  const texts = getTranslation(lang);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, texts, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
