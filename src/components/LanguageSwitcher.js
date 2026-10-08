import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath, stripLanguage, localizePath } from '../languageRoutes';

// סדר השפות בתפריט, והתווית הקבועה של כל אחת (לא מתורגמות - כל שפה מוצגת בשמה שלה)
const LANGUAGES = ['he', 'en', 'ru'];
const LABELS = { he: 'עברית', en: 'English', ru: 'Русский' };

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // שפות זמינות: he, en, ru. השפה הנוכחית נקבעת לפי הכתובת.
  const language = getLanguageFromPath(location.pathname);
  // הרכיב הזה יושב בתוך ה-nav שקבוע כ-dir="ltr", ולכן לא ניתן להסתמך על מאפייני CSS
  // לוגיים (start/end) שמגיבים לכיוון המסמך - נדרש מיתוג ידני לפי שפה.
  const isHebrew = language === 'he';

  // תפריט נפתח בנוי-ידנית (לא <select> טבעי) - כדי ששליטה מלאה ב-RTL/LTR ויישור הטקסט
  // לא תהיה תלויה בעיצוב ברירת-המחדל של <option> בדפדפן/מערכת ההפעלה.
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  // סגירה בלחיצה מחוץ לתפריט, ובמקש Escape (עם החזרת פוקוס לכפתור הפותח)
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (lang) => {
    // מעבר לאותו עמוד בשפה שנבחרה, למשל /en/projects -> /ru/projects.
    // אין צורך לרענן את הדף – App מסנכרן את i18next לפי הכתובת החדשה.
    const target = localizePath(stripLanguage(location.pathname), lang);
    navigate(`${target}${location.search}${location.hash}`);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const dir = isHebrew ? 'rtl' : 'ltr';
  const alignClass = isHebrew ? 'text-right' : 'text-left';

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('language_select_label')}
        dir={dir}
        className={`relative bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          isHebrew ? 'pr-10 pl-4' : 'pl-10 pr-4'
        }`}
      >
        {LABELS[language]}
      </button>
      {/* אייקון כדור הארץ - עברית: ימין (ללא שינוי). אנגלית/רוסית: משמאל (מראה) */}
      <div
        className={`pointer-events-none absolute inset-y-0 flex items-center ${
          isHebrew ? 'right-0 pr-3' : 'left-0 pl-3'
        }`}
      >
        <i className="fas fa-globe text-white text-xl"></i>
      </div>

      {isOpen && (
        <div
          role="menu"
          dir={dir}
          aria-label={t('language_select_label')}
          className={`absolute top-full mt-2 min-w-[8rem] rounded-lg bg-blue-600 shadow-lg overflow-hidden z-50 ${
            isHebrew ? 'right-0' : 'left-0'
          }`}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              role="menuitem"
              onClick={() => selectLanguage(lang)}
              className={`block w-full px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 ${alignClass}`}
            >
              {LABELS[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
