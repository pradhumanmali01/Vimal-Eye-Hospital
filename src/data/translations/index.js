/**
 * TRANSLATIONS DICTIONARY EXPORTER
 */
import { englishTranslations } from './english';
import { hindiTranslations } from './hindi';
import { marathiTranslations } from './marathi';

export const TRANSLATIONS = {
  en: englishTranslations,
  hi: hindiTranslations,
  mr: marathiTranslations,
};

export function getTranslation(lang = 'en') {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
