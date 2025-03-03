import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicBackground from '../components/DynamicBackground';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  return (
    <div className="relative overflow-hidden">
      {/* רקע דינמי עם עיגולים */}
      <DynamicBackground />
      {/* הזחה מלמעלה כדי שלא תהיה חפיפה עם ה-navbar */}
      <motion.div
        className="pt-24"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <section className="py-16 bg-gray-100 dark:bg-gray-800 relative z-10">
          {/* הגדרת כיוון בהתאם לשפה */}
          <div className="container mx-auto px-4" dir={isHebrew ? "rtl" : "ltr"}>
            {/* כותרת "אודותי" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className={isHebrew ? "text-center mb-8" : "text-center mb-8"}
            >
              <h2 className="text-5xl font-extrabold text-blue-700 dark:text-white">
                {t('profile_title')}
              </h2>
              <motion.div
                className="mt-2 w-24 h-1 bg-blue-700 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '6rem' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
              <motion.div 
                className="md:w-1/3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <img 
                  src="/AlonShaul.png" 
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
                {/* קישורי רשתות – מוצגים אחד מתחת לשני */}
                <motion.div 
                  className={`flex flex-col space-y-4 mt-4 ${isHebrew ? "items-start" : "items-start"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  <motion.a 
                    href="https://www.linkedin.com/in/yourprofile" 
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
                    href="https://github.com/yourusername" 
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
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Profile;
