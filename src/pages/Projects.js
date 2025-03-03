import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicTriangles from '../components/DynamicTriangles';
import moveMentorImg from '../project/Project 1 - MoveMentor.png';
import toDoListImg from '../project/Project 2 - To Do List.png';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: 'backIn' },
  },
};

const Projects = () => {
  const { t } = useTranslation();

  // הגדרת נתוני הפרויקטים עם מפתחות תרגום
  const projects = [
    {
      id: 1,
      titleKey: 'project_title_moveMentor',
      descriptionKey: 'project_description_moveMentor',
      defaultTitle: 'מנטור תנועה: מערכת שיקום מותאמת אישית',
      defaultDescription:
        'מערכת שיקום מותאמת אישית לשיקום פיזי, הכוללת תוכניות אימון אישיות, צ\'אטבוט אינטואיטיבי, מערכת אימייל מתקדמת ומעקב סטטיסטי. הפרויקט בנוי בטכנולוגיות React, Node.js, MongoDB, TailwindCSS, HTML, CSS, JavaScript, Chart.js, SendGrid ו-Render.',
      link: 'https://github.com/AlonShaul/MoveMentor.git',
      image: moveMentorImg,
    },
    {
      id: 2,
      titleKey: 'project_title_toDoList',
      descriptionKey: 'project_description_toDoList',
      defaultTitle: 'To Do List Project: אפליקציה לניהול משימות יומיות',
      defaultDescription:
        'אפליקציה שנוצרה על מנת לעזור בניהול המשימות היומיות, הכוללת אפשרות להוספת משימה ומחיקת משימה. האפליקציה עובדת בשיתוף עם MongoDB לאחסון נתונים, כך שניתן להמשיך לבצע פעולות גם לאחר סגירת האפליקציה.',
      link: 'https://github.com/AlonShaul/To-Do-List-Project.git',
      image: toDoListImg,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* רקע דינמי עם משולשים */}
      <DynamicTriangles />

      {/* תוכן עמוד הפרויקטים */}
      <motion.div
        className="pt-24"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <section className="py-16 bg-gray-50 dark:bg-gray-900 relative z-10" id="projects">
          <div className="container mx-auto px-4">
            {/* כותרת עמוד עם אנימציית כניסה */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-extrabold font-serif text-blue-700 dark:text-white">
                {t('projects_title', 'הפרויקטים שלי')}
              </h2>
              <motion.div
                className="mt-4 w-24 h-1 bg-blue-700 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '6rem' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            {/* Grid עם כרטיסי פרויקטים – אנימציית stagger */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {projects.map((project) => (
                <motion.a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  // שינוי רוחב המלבן: 100% במובייל וב-md קבוע של 700px
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition duration-300 hover:shadow-3xl w-full md:w-[700px]"
                >
                  {/* מיכל תמונה עם overlay והנפשת תמונה */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.img
                      src={project.image}
                      alt={t(project.titleKey, project.defaultTitle)}
                      className="w-full h-48 object-fill"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-30 transition duration-300"
                    />
                  </motion.div>
                  <div className="p-4 text-center">
                    <h3 className="text-2xl font-semibold font-serif mb-2 dark:text-white">
                      {t(project.titleKey, project.defaultTitle)}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-serif">
                      {t(project.descriptionKey, project.defaultDescription)}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Projects;
