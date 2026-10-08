import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://alon-shaul-dev.com';

// מטא-דאטה לכל עמוד: כותרת, תיאור ו-canonical בשפה הנבחרת.
// React 19 מעביר את התגיות <title>, <meta> ו-<link> ל-<head> באופן מובנה, ללא ספרייה חיצונית.
// page – שם העמוד במפתחות התרגום (seo_<page>_title / seo_<page>_description)
// path – הנתיב הקנוני של העמוד, ללא לוכסן בסוף (מלבד דף הבית)
// noindex – לעמוד "לא נמצא": מבקש ממנועי חיפוש לא לאנדקס אותו, ואין לו כתובת קנונית
const Seo = ({ page, path, noindex = false }) => {
  const { t } = useTranslation();

  // ברירות המחדל הסטטיות ב-index.html מיועדות לסורקים שאינם מריצים JavaScript.
  // מרגע שהעמוד מספק תגיות משלו מסירים אותן, כדי שלא יהיו כותרת או תיאור כפולים.
  useLayoutEffect(() => {
    document.head.querySelectorAll('[data-seo-default]').forEach((element) => element.remove());
  }, []);

  return (
    <>
      <title>{t(`seo_${page}_title`)}</title>
      <meta name="description" content={t(`seo_${page}_description`)} />
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <link rel="canonical" href={`${SITE_URL}${path}`} />
      )}
    </>
  );
};

export default Seo;
