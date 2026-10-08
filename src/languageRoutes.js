// שפת האתר נקבעת לפי כתובת ה-URL:
// עברית היא ברירת המחדל וללא קידומת (/, /projects), אנגלית תחת /en ורוסית תחת /ru.
export const DEFAULT_LANGUAGE = 'he';
export const LANGUAGES = ['he', 'en', 'ru'];
// השפה שמנועי חיפוש יציגו למי ששפתו אינה אחת מהשלוש (hreflang="x-default")
export const X_DEFAULT_LANGUAGE = 'en';

const PREFIXED_LANGUAGES = LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE);

const firstSegment = (pathname) => (pathname.split('/')[1] || '').toLowerCase();

// השפה שהכתובת מייצגת. כל כתובת ללא קידומת שפה נתמכת היא עברית.
export const getLanguageFromPath = (pathname) => {
  const segment = firstSegment(pathname);
  return PREFIXED_LANGUAGES.includes(segment) ? segment : DEFAULT_LANGUAGE;
};

// הנתיב ללא קידומת השפה: /en/projects -> /projects, /ru -> /
export const stripLanguage = (pathname) => {
  if (!PREFIXED_LANGUAGES.includes(firstSegment(pathname))) return pathname || '/';
  const rest = pathname.split('/').slice(2).join('/');
  return `/${rest}`;
};

// הנתיב המקביל בשפה אחרת: ('/projects', 'en') -> /en/projects, ('/', 'ru') -> /ru
export const localizePath = (path, language) => {
  if (language === DEFAULT_LANGUAGE) return path;
  return path === '/' ? `/${language}` : `/${language}${path}`;
};

export const getDirection = (language) => (language === 'he' ? 'rtl' : 'ltr');
