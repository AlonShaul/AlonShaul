import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicBackground from '../components/DynamicBackground';
import Seo from '../components/Seo';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

// שמות הטכנולוגיות נשארים זהים בכל שפה (שמות קניינים), ולכן אינם עוברים דרך i18n -
// בדיוק כמו מערך ה-tech בכל פרויקט ב-data/projects.js.
const SKILL_GROUPS = [
  { labelKey: 'profile_skills_frontend_label', items: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'] },
  { labelKey: 'profile_skills_backend_label', items: ['Node.js', 'Express', 'Python'] },
  { labelKey: 'profile_skills_databases_label', items: ['MongoDB', 'SQL'] },
  { labelKey: 'profile_skills_tools_label', items: ['Git'] },
];

const skillChipClass =
  'rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ' +
  'dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200';

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
        <section className="py-16 bg-gray-100 dark:bg-gray-800 relative z-10">
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

                {/* כישורים טכניים - מקובצים לפי תחום, שמות הטכנולוגיות עצמם לא מתורגמים */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.55 }}
                >
                  <h2 className="text-xl font-bold text-blue-700 dark:text-white mb-3">
                    {t('profile_skills_title')}
                  </h2>
                  <div className="space-y-3">
                    {SKILL_GROUPS.map((group) => (
                      <div key={group.labelKey}>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
                          {t(group.labelKey)}
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <li key={item} className={skillChipClass}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* השכלה */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <h2 className="text-xl font-bold text-blue-700 dark:text-white mb-2">
                    {t('profile_education_title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('profile_education_degree')}
                  </p>
                </motion.div>

                {/* קישורי רשתות – מוצגים אחד מתחת לשני */}
                <motion.div
                  className="flex flex-col space-y-4 mt-4 items-start"
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
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Profile;
