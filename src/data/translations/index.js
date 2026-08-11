/**
 * TRANSLATIONS DICTIONARY EXPORTER
 */
import { englishTranslations } from './english.js';
import { hindiTranslations } from './hindi.js';
import { marathiTranslations } from './marathi.js';

export const TRANSLATIONS = {
  en: englishTranslations,
  hi: hindiTranslations,
  mr: marathiTranslations,
};

export function getTranslation(lang = 'en') {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
