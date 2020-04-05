import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locale/en_EN';
import translationRU from './locale/ru_RU';

const resources = {
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  }
};

const lng = localStorage.getItem('lang') || 'ru';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng,
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
});

export default i18n;
