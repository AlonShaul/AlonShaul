import React, { useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageSwitcher = () => {
  // שפות זמינות: he, en, ru; ברירת מחדל: עברית
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'he');

  useEffect(() => {
    // שינוי שפת המערכת והגדרת כיוון המסמך בהתאם
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // אין צורך לרענן את הדף – i18next יעודכן ויעביר את המפתחות
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10 text-center"
        aria-label="בחירת שפה"
      >
        <option value="he" className="text-center">עברית</option>
        <option value="en" className="text-center">English</option>
        <option value="ru" className="text-center">Русский</option>
      </select>
      {/* אייקון כדור הארץ בתוך התיבה */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <i className="fas fa-globe text-white text-xl"></i>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
