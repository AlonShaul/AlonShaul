import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import { getLanguageFromPath, localizePath } from '../languageRoutes';

// עמוד "לא נמצא" – מוצג עבור כל כתובת שאינה אחד מעמודי האתר
const NotFound = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  // כפתור החזרה מוביל לדף הבית של השפה הנוכחית
  const language = getLanguageFromPath(useLocation().pathname);

  return (
    <motion.div
      className="pt-24"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <Seo page="notFound" noindex />
      <section className="py-16 bg-white dark:bg-gray-900 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 text-center">
          <p aria-hidden="true" className="text-8xl font-extrabold text-blue-700/20 dark:text-white/20">
            404
          </p>
          <h1 className="mt-2 text-4xl font-bold text-blue-700 dark:text-white mb-4">
            {t('notFound_title')}
          </h1>
          {/* קו תחתון אנימטיבי מתחת לכותרת, כמו בשאר העמודים */}
          <motion.div
            className="mt-2 w-24 h-1 bg-blue-700 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: '6rem' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <p className="mt-6 max-w-md mx-auto text-lg text-gray-600 dark:text-gray-300">
            {t('notFound_text')}
          </p>
          <Link
            to={localizePath('/', language)}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            {t('notFound_home')}
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default NotFound;
