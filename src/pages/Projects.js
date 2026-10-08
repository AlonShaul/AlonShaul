import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicTriangles from '../components/DynamicTriangles';
import ProjectShowcase from '../components/ProjectShowcase';
import projects from '../data/projects';

const Projects = () => {
  const { t } = useTranslation();

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
              className="text-center mb-4"
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

            {/* תצוגת הפרויקטים – קרוסלה עם כרטיס פעיל במרכז */}
            <ProjectShowcase projects={projects} />
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Projects;
