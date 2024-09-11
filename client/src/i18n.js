import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "CalendarTitle": "Calendar"
    }
  },
  es: {
    translation: {
      "CalendarTitle": "Calendario"
    }
  },
  // Add more languages here
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
