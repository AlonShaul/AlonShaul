// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguageFromPath, getDirection } from './languageRoutes';
import { resources } from './i18nResources';

// השפה נקבעת לפי כתובת ה-URL (ללא קידומת = עברית, /en = אנגלית, /ru = רוסית),
// ולא לפי שפת הדפדפן או localStorage – כך השפה נכונה כבר בציור הראשון.
const initialLanguage = getLanguageFromPath(window.location.pathname);
document.documentElement.lang = initialLanguage;
document.documentElement.dir = getDirection(initialLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
