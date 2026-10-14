import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicBackground from '../components/DynamicBackground';
import Seo from '../components/Seo';
import BuildAlon from '../components/BuildAlon';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  return (
    <div className="relative overflow-hidden">
      <Seo page="profile" path="/profile" />
      {/* רקע דינמי עם עיגולים */}
      <DynamicBackground />
      {/* הזחה מלמעלה כדי שלא תהיה חפיפה עם ה-navbar */}
      <motion.div
        className="pt-24"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* הוסר bg-gray-100/dark:bg-gray-800 שכיסה את הרקע המונפש (DynamicBackground,
            שממוקם ב-z-10 שלילי) - התוכן עצמו (הכרטיס הלבן/אפור) כבר אטום בפני עצמו */}
        <section className="py-16 relative z-10">
          {/* הגדרת כיוון בהתאם לשפה */}
          <div className="container mx-auto px-4" dir={isHebrew ? "rtl" : "ltr"}>
            {/* כותרת "אודותי" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl font-extrabold text-blue-700 dark:text-white">
                {t('profile_title')}
              </h1>
              <motion.div
                className="mt-2 w-24 h-1 bg-blue-700 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '6rem' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            {/* כרטיס "אודות" פשוט ומצומצם: תמונה + טקסט + השכלה + קישורים בלבד.
                פרופורציות התמונה/הכרטיס משוחזרות במדויק מ-commit c4e5ad7 (לפני כל שינויי
                ה-Profile redesign): md:w-1/3 יחסי (לא רוחב קבוע), ללא aspect-ratio מאולץ,
                h-full נגזר מגובה התוכן הטקסטואלי - שחזרתי כעת תוכן קצר (אודות+השכלה+קישורים
                בלבד, בלי טכנולוגיות) כך שהגובה המקורי המצומצם חוזר באופן טבעי. */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
              <motion.div
                className="md:w-1/3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <img
                  src="/alon-shaul-1280.webp"
                  srcSet="/alon-shaul-640.webp 640w, /alon-shaul-960.webp 960w, /alon-shaul-1280.webp 1280w"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  width="1280"
                  height="801"
                  alt="Alon Shaul"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <motion.p
                  className={isHebrew ? "text-right text-gray-700 dark:text-gray-300 text-lg mb-4" : "text-left text-gray-700 dark:text-gray-300 text-lg mb-4"}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {t('profile_text')}
                </motion.p>

                {/* השכלה */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <h2 className="text-lg font-bold text-blue-700 dark:text-white mb-1">
                    {t('profile_education_title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('profile_education_degree')}
                  </p>
                </motion.div>

                {/* קישורי רשתות – מוצגים אחד מתחת לשני */}
                <motion.div
                  className="flex flex-col space-y-4 items-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  <motion.a
                    href="https://www.linkedin.com/in/alonshaul/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    style={{ fontFamily: "Merriweather, serif", transformOrigin: "center" }}
                  >
                    <FaLinkedin size={38} className={isHebrew ? "ml-2" : "mr-2"} />
                    <span className="font-semibold text-xl">LinkedIn</span>
                  </motion.a>
                  <motion.a
                    href="https://github.com/AlonShaul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-500 hover:text-black"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    style={{ fontFamily: "Merriweather, serif", transformOrigin: "center" }}
                  >
                    <FaGithub size={38} className={isHebrew ? "ml-2" : "mr-2"} />
                    <span className="font-semibold text-xl">GitHub</span>
                  </motion.a>
                </motion.div>
              </div>
            </div>

            {/* BUILD ALON - חתימה אישית אינטראקטיבית, נפרדת מכרטיס האודות */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <BuildAlon />
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Profile;
