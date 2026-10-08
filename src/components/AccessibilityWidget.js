import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AccessibilityWidget = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // הגדרות התאמת תוכן
  const [textSize, setTextSize] = useState(1);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [highlightHeadings, setHighlightHeadings] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);
  // הגדרות התאמת ניגודיות
  const [invertContrast, setInvertContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  const toggleWidget = () => setIsOpen(!isOpen);

  // handlers להתאמת תוכן
  const increaseText = () => setTextSize(prev => Math.min(prev + 0.1, 2));
  const decreaseText = () => setTextSize(prev => Math.max(prev - 0.1, 0.8));
  const toggleHighlightLinks = () => setHighlightLinks(prev => !prev);
  const toggleHighlightHeadings = () => setHighlightHeadings(prev => !prev);
  const toggleStopAnimations = () => setStopAnimations(prev => !prev);

  // handlers להתאמת ניגודיות
  const toggleInvertContrast = () => setInvertContrast(prev => !prev);
  const toggleGrayscale = () => setGrayscale(prev => !prev);

  const resetSettings = () => {
    setTextSize(1);
    setHighlightLinks(false);
    setHighlightHeadings(false);
    setStopAnimations(false);
    setInvertContrast(false);
    setGrayscale(false);
  };

  // עדכון גודל טקסט ב-root
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize * 100}%`;
  }, [textSize]);

  // עדכון מחלקות בהתאם להגדרות
  useEffect(() => {
    invertContrast
      ? document.documentElement.classList.add('invert-contrast')
      : document.documentElement.classList.remove('invert-contrast');
  }, [invertContrast]);

  useEffect(() => {
    grayscale
      ? document.documentElement.classList.add('grayscale')
      : document.documentElement.classList.remove('grayscale');
  }, [grayscale]);

  useEffect(() => {
    highlightLinks
      ? document.documentElement.classList.add('highlight-links')
      : document.documentElement.classList.remove('highlight-links');
  }, [highlightLinks]);

  useEffect(() => {
    highlightHeadings
      ? document.documentElement.classList.add('highlight-headings')
      : document.documentElement.classList.remove('highlight-headings');
  }, [highlightHeadings]);

  useEffect(() => {
    stopAnimations
      ? document.documentElement.classList.add('stop-animations')
      : document.documentElement.classList.remove('stop-animations');
  }, [stopAnimations]);

  return (
    // ממקמים בצד שמאל ובאמצע הגובה; כיוון הטקסט לפי השפה
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50" dir={i18n.dir()}>
      <button
        onClick={toggleWidget}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label={t('a11y_open')}
      >
        <i className="fas fa-universal-access"></i>
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-700 rounded shadow-lg w-80 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {t('a11y_title')}
          </h2>
          {/* חלק 1: התאמת ניגודיות */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {t('a11y_contrast_heading')}
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={toggleInvertContrast}
                className={`flex items-center gap-2 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  invertContrast ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
                aria-label={t('a11y_invert')}
              >
                <i className="fas fa-adjust text-xl"></i>
                <span>{t('a11y_invert')}</span>
              </button>
              <button
                onClick={toggleGrayscale}
                className={`flex items-center gap-2 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  grayscale ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
                aria-label={t('a11y_grayscale')}
              >
                <i className="fas fa-filter text-xl"></i>
                <span>{t('a11y_grayscale')}</span>
              </button>
            </div>
          </div>
          {/* חלק 2: התאמת תוכן */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {t('a11y_content_heading')}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={increaseText}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={t('a11y_text_increase')}
              >
                <i className="fas fa-search-plus text-xl"></i>
                <span>{t('a11y_text_increase')}</span>
              </button>
              <button
                onClick={decreaseText}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={t('a11y_text_decrease')}
              >
                <i className="fas fa-search-minus text-xl"></i>
                <span>{t('a11y_text_decrease')}</span>
              </button>
              <button
                onClick={toggleHighlightLinks}
                className={`flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  highlightLinks ? 'bg-blue-600 text-white' : ''
                }`}
                aria-label={t('a11y_highlight_links')}
              >
                <i className="fas fa-link text-xl"></i>
                <span>{t('a11y_highlight_links')}</span>
              </button>
              <button
                onClick={toggleHighlightHeadings}
                className={`flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  highlightHeadings ? 'bg-blue-600 text-white' : ''
                }`}
                aria-label={t('a11y_highlight_headings')}
              >
                <i className="fas fa-heading text-xl"></i>
                <span>{t('a11y_highlight_headings')}</span>
              </button>
              <button
                onClick={toggleStopAnimations}
                className={`flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  stopAnimations ? 'bg-blue-600 text-white' : ''
                }`}
                aria-label={t('a11y_stop_animations')}
              >
                <i className="fas fa-pause text-xl"></i>
                <span>{t('a11y_stop_animations')}</span>
              </button>
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 bg-red-500 text-white w-full h-12 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label={t('a11y_reset')}
              >
                <i className="fas fa-undo text-xl"></i>
                <span>{t('a11y_reset')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
