import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath, stripLanguage, localizePath } from '../languageRoutes';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // שפות זמינות: he, en, ru. השפה הנוכחית נקבעת לפי הכתובת.
  const language = getLanguageFromPath(location.pathname);

  const handleLanguageChange = (e) => {
    // מעבר לאותו עמוד בשפה שנבחרה, למשל /en/projects -> /ru/projects.
    // אין צורך לרענן את הדף – App מסנכרן את i18next לפי הכתובת החדשה.
    const target = localizePath(stripLanguage(location.pathname), e.target.value);
    navigate(`${target}${location.search}${location.hash}`);
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10 text-center"
        aria-label={t('language_select_label')}
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
