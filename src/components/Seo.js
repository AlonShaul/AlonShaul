import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, X_DEFAULT_LANGUAGE, getLanguageFromPath, localizePath } from '../languageRoutes';

const SITE_URL = 'https://alon-shaul-dev.com';

// מטא-דאטה לכל עמוד: כותרת, תיאור, canonical וקישורי hreflang בשפה של הכתובת.
// React 19 מעביר את התגיות <title>, <meta> ו-<link> ל-<head> באופן מובנה, ללא ספרייה חיצונית.
// page – שם העמוד במפתחות התרגום (seo_<page>_title / seo_<page>_description)
// path – הנתיב של העמוד ללא קידומת שפה וללא לוכסן בסוף (מלבד דף הבית)
// noindex – לעמוד "לא נמצא": מבקש ממנועי חיפוש לא לאנדקס אותו, ואין לו canonical או hreflang
const Seo = ({ page, path, noindex = false }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const language = getLanguageFromPath(pathname);

  // ברירות המחדל הסטטיות ב-index.html מיועדות לסורקים שאינם מריצים JavaScript.
  // מרגע שהעמוד מספק תגיות משלו מסירים אותן, כדי שלא יהיו כותרת או תיאור כפולים.
  useLayoutEffect(() => {
    document.head.querySelectorAll('[data-seo-default]').forEach((element) => element.remove());
  }, []);

  // הכתובת המלאה של העמוד בשפה נתונה, למשל https://alon-shaul-dev.com/en/projects
  const urlFor = (targetLanguage) => `${SITE_URL}${localizePath(path, targetLanguage)}`;

  return (
    <>
      <title>{t(`seo_${page}_title`)}</title>
      <meta name="description" content={t(`seo_${page}_description`)} />
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <>
          {/* כל גרסת שפה היא הקנונית של עצמה, ומפנה לשתי האחרות ול-x-default */}
          <link rel="canonical" href={urlFor(language)} />
          {LANGUAGES.map((alternate) => (
            <link key={alternate} rel="alternate" hrefLang={alternate} href={urlFor(alternate)} />
          ))}
          <link rel="alternate" hrefLang="x-default" href={urlFor(X_DEFAULT_LANGUAGE)} />
        </>
      )}
    </>
  );
};

export default Seo;
