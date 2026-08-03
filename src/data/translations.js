/**
 * UNIFIED TRANSLATIONS ENTRY POINT
 */
import { englishTranslations } from './translations/english';
import { hindiTranslations } from './translations/hindi';
import { marathiTranslations } from './translations/marathi';

export const TRANSLATIONS = {
  en: englishTranslations,
  hi: hindiTranslations,
  mr: marathiTranslations,
};

export function getTranslation(lang = 'en') {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

export { englishTranslations, hindiTranslations, marathiTranslations };
