import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, X_DEFAULT_LANGUAGE, getLanguageFromPath, localizePath } from '../languageRoutes';

const SITE_URL = 'https://alon-shaul-dev.com';

// מיפוי קוד שפה -> og:locale (לא תרגום UI - פורמט טכני קבוע לפי תקן Open Graph)
const OG_LOCALE = { he: 'he_IL', en: 'en_US', ru: 'ru_RU' };

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

  // תגיות ה-Open Graph/Twitter הסטטיות שב-index.html אינן מסומנות ב-data-seo-default
  // (הן תמיד תוכן דף הבית). במקום לרנדר תגיות <meta> חדשות - שהיו נוצרות *בנוסף* לקיימות
  // ויוצרות כפילות - מעדכנים כאן את אותן תגיות קיימות במקום, בעזרת ה-content התרגום הנכון
  // לעמוד/לשפה הנוכחיים. זה רץ מחדש בכל ניווט בין עמודים בתוך ה-SPA, בדיוק כמו title/description.
  useLayoutEffect(() => {
    if (noindex) return undefined;

    const title = t(`seo_${page}_title`);
    const description = t(`seo_${page}_description`);
    const url = urlFor(language);

    const updateMeta = (selector, content) => {
      const element = document.head.querySelector(selector);
      if (element) element.setAttribute('content', content);
    };

    updateMeta('meta[property="og:locale"]', OG_LOCALE[language]);
    updateMeta('meta[property="og:url"]', url);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, path, language, noindex]);

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
