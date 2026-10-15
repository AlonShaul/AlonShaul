import React, { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AccessibilityWidget from './components/AccessibilityWidget';
import ContactBot from './components/ContactBot'; // הוספת ייבוא של הבוט
import CustomCursor from './components/CustomCursor';
import { getLanguageFromPath, getDirection } from './languageRoutes';

// אותם עמודים בכל קבוצת שפה. כל כתובת אחרת בתוך הקבוצה – עמוד "לא נמצא" באותה שפה.
// כל עמוד חדש צריך גם שורה לכל שפה ב-public/_redirects.
const pageRoutes = () => (
  <>
    <Route index element={<Home />} />
    <Route path="profile" element={<Profile />} />
    <Route path="projects" element={<Projects />} />
    <Route path="contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </>
);

function App() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const language = getLanguageFromPath(pathname);

  // הכתובת היא מקור האמת לשפה: מסנכרנים את i18n ואת <html lang/dir> לפני הציור למסך
  useLayoutEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
  }, [language, i18n]);

  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:rounded focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t('skip_to_content')}
      </a>
      <ScrollIndicator />
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Routes>
          {/* שלוש קבוצות שפה מפורשות: קידומת אחרת (למשל /de או /he) אינה נתיב תקין */}
          <Route path="/">{pageRoutes()}</Route>
          <Route path="/en">{pageRoutes()}</Route>
          <Route path="/ru">{pageRoutes()}</Route>
        </Routes>
      </main>
      <Footer />
      <AccessibilityWidget />
      <ContactBot /> {/* הוספת הבוט לתחתית העמוד */}
      {/* מופע גלובלי יחיד - נשאר קבוע בין ניווטים (App.js לא נטען-מחדש בין routes) */}
      <CustomCursor />
    </div>
  );
}

export default App;
