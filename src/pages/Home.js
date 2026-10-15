import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import MagicGame from '../components/MagicGame';
import Seo from '../components/Seo';
import { localizePath } from '../languageRoutes';

// import MonsterSideRunnerGame from '../components/MonsterSideRunnerGame';

const Dynamic3DBackground = () => {
  // prefers-reduced-motion: משביתים את הסיבוב/הקנה-מידה האינסופיים, משאירים את הצורות
  // עצמן גלויות (רק סטטיות) - שומר על הזהות הוויזואלית בלי תנועה מתמשכת.
  const prefersReducedMotion = useReducedMotion();
  const staticTransition = { duration: 0 };
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <motion.div
        className="absolute"
        style={{
          width: "120px",
          height: "150px",
          background: "linear-gradient(45deg, #1e40af, #3b82f6)",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
          transformStyle: "preserve-3d",
          top: "5%",
          left: "10%"
        }}
        animate={prefersReducedMotion ? undefined : { rotateX: 360, rotateY: 360, rotateZ: 360 }}
        transition={prefersReducedMotion ? staticTransition : { duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "200px",
          height: "200px",
          background: "linear-gradient(45deg, #3b82f6, #93c5fd)",
          borderRadius: "10px",
          boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
          transformStyle: "preserve-3d",
          top: "60%",
          left: "70%"
        }}
        animate={prefersReducedMotion ? undefined : { rotateX: -360, rotateY: 360, rotateZ: -360 }}
        transition={prefersReducedMotion ? staticTransition : { duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "100px",
          height: "100px",
          background: "linear-gradient(45deg, #1e40af, #60a5fa)",
          borderRadius: "10px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          transformStyle: "preserve-3d",
          top: "80%",
          left: "5%"
        }}
        animate={prefersReducedMotion ? undefined : { rotateX: 360, rotateY: -360, rotateZ: 360 }}
        transition={prefersReducedMotion ? staticTransition : { duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "120px",
          height: "120px",
          background: "rgba(59, 130, 246, 0.15)",
          boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)",
          top: "30%",
          left: "80%"
        }}
        animate={prefersReducedMotion ? undefined : { scale: [0.8, 1.2, 0.8], rotate: [0, 180, 0] }}
        transition={prefersReducedMotion ? staticTransition : { duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "80px",
          height: "80px",
          background: "rgba(30, 64, 175, 0.15)",
          boxShadow: "0 0 20px rgba(30, 64, 175, 0.3)",
          top: "70%",
          left: "40%"
        }}
        animate={prefersReducedMotion ? undefined : { scale: [1.1, 0.9, 1.1], rotate: [0, -180, 0] }}
        transition={prefersReducedMotion ? staticTransition : { duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const language = i18n.language;

  // פונקציה שמפצלת טקסט לפי נקודה ומוסיפה שבירת שורה לאחר כל משפט (למעט האחרון)
  const formatQuote = (quote) =>
    quote
      .split('.')
      .filter((sentence) => sentence.trim() !== '')
      .map((sentence, index, arr) => (
        <span key={index}>
          {sentence.trim()}
          {index !== arr.length - 1 && '.'}
          <br />
        </span>
      ));

  // כפתורי קריאה-לפעולה: שני הכפתורים משתפים עכשיו class זהה לחלוטין (מילוי כחול) -
  // כולל w-56 קבוע משותף (רוחב שנבחר כך שהמחרוזת הארוכה ביותר בשלוש השפות -
  // "Связаться со мной" - נשארת בשורה אחת בנוחות) - כך ששני הכפתורים זהים
  // במידות בכל שפה, לא רק בעיצוב. רק הטקסט והיעד שונים ביניהם. היעד מחושב דרך
  // localizePath הקיים, כך שהניתוב הרב-לשוני לא נפגע. flex-wrap בהורה דואג
  // שבמובייל צר הכפתורים פשוט נערמים זה מתחת לזה בלי גלישה אופקית.
  const heroCTAClass =
    "inline-flex w-56 items-center justify-center rounded-full bg-blue-700 px-6 py-3 text-base font-semibold text-white text-center shadow-md transition-colors duration-200 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";
  const heroCTAs = (
    <motion.div
      className="mt-6 flex flex-wrap gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.8 }}
    >
      <Link to={localizePath('/projects', language)} className={heroCTAClass}>
        {t('home_cta_projects')}
      </Link>
      <Link to={localizePath('/contact', language)} className={heroCTAClass}>
        {t('home_cta_contact')}
      </Link>
    </motion.div>
  );

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 bg-transparent text-gray-900 dark:text-white">
      {isHebrew ? (
        <>
          {/* עבור השפה העברית – אין שינוי */}
          <div className="md:w-1/2" dir="rtl">
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              {t('home_header_titleName')}
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold mt-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              {t('home_header_subtitle')}
            </motion.h2>
            <motion.p
              className="max-w-lg text-lg italic mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              {formatQuote(t('home_header_quote'))}
            </motion.p>
            {heroCTAs}
          </div>
          <div className="md:w-1/4 flex justify-center items-center mb-6 md:mb-0">
            <motion.img
              src="/alon-shaul-1280.webp"
              srcSet="/alon-shaul-640.webp 640w, /alon-shaul-960.webp 960w, /alon-shaul-1280.webp 1280w"
              sizes="(min-width: 768px) 25vw, 100vw"
              width="1280"
              height="801"
              fetchPriority="high"
              alt="Alon Shaul"
              className="rounded-full border-4 border-white shadow-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
        </>
      ) : (
        <>
          {/* עבור אנגלית ורוסית – סדר הרכיבים זהה לעברית (הטקסט מוצג באותו מיקום) */}
          <div className="md:w-1/2 text-left mt-16 md:mt-0" dir="ltr">
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              {t('home_header_titleName')}
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold mt-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              {t('home_header_subtitle')}
            </motion.h2>
            <motion.p
              className="max-w-lg text-lg italic mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              {formatQuote(t('home_header_quote'))}
            </motion.p>
            {heroCTAs}
          </div>
          <div className="md:w-1/4 flex justify-center items-center mb-6 md:mb-0">
            <motion.img
              src="/alon-shaul-1280.webp"
              srcSet="/alon-shaul-640.webp 640w, /alon-shaul-960.webp 960w, /alon-shaul-1280.webp 1280w"
              sizes="(min-width: 768px) 25vw, 100vw"
              width="1280"
              height="801"
              fetchPriority="high"
              alt="Alon Shaul"
              className="rounded-full border-4 border-white shadow-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
        </>
      )}
    </section>
  );
};

const SkillsSection = () => {
  const { t } = useTranslation();
  return (
    <section id="skills" className="py-16 bg-transparent text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {t('home_skills_title')}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/React.png" alt="React" width="512" height="512" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">React</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_react_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/Nodejs.png" alt="Node.js" width="2560" height="1568" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">Node.js</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_node_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/Tailwind.png" alt="Tailwind CSS" width="2048" height="1229" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">Tailwind CSS</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_tailwind_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <div className="flex space-x-reverse space-x-2 mb-3">
                <img src="/icons/HTML.png" alt="HTML" width="512" height="512" className="w-10 h-10" />
                <img src="/icons/CSS.png" alt="CSS" width="512" height="512" className="w-10 h-10" />
                <img src="/icons/JS.png" alt="JS" width="980" height="980" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">HTML/CSS/JS</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_htmlcssjs_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/MongoDB.png" alt="MongoDB" width="256" height="256" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">MongoDB</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_mongo_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/Python.png" alt="Python" width="512" height="512" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">Python</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_python_text')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ParallaxSection = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const handleMouseMove = (e) => {
    // prefers-reduced-motion: לא מעדכנים את ערכי העכבר, כך שהכרטיס לא זז/מסתובב בכלל
    if (prefersReducedMotion) return;
    x.set(e.clientX - window.innerWidth / 2);
    y.set(e.clientY - window.innerHeight / 2);
  };

  const bubbles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, index) => ({
        id: index,
        size: 20 + Math.random() * 40,
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        amplitudeX: 5 + Math.random() * 15,
        amplitudeY: 5 + Math.random() * 15,
        duration: 3 + Math.random() * 2,
      })),
    []
  );

  // כותרת החץ (Idea -> Development -> Product) נשארת LTR תמיד - אותו דפוס
  // כמו החתימה המקבילה ב-BuildAlon, כדי שסדר החצים תמיד יזרום משמאל לימין.
  //
  // סמן העכבר הרגיל מוסתר רק בתוך הסקשן הזה (cursor-none) - ב-CSS, cursor יורש
  // כברירת מחדל לכל הצאצאים שלא מגדירים ערך cursor משלהם, כך שזה מכסה את כל
  // השטח (בועות/כרטיס/טקסט) מבלי לגעת בשום מקום אחר בעמוד. לא מוחל במצב
  // prefers-reduced-motion - שם ממילא אין מעקב עכבר, כך שהסתרת הסמן תהיה חסרת
  // תועלת ורק תבלבל. במגע/מובייל אין בכלל סמן מערכת מתמשך, אז לכלל הזה אין השפעה.
  //
  // הסמן המותאם הגלובלי (CustomCursor.js) לא מיובא/משוכפל כאן בכלל - התקשורת
  // היחידה היא שני אירועי DOM גלובליים פשוטים (customcursor:hide/show), כך
  // שהקטע הזה לא צריך לדעת שום דבר על המימוש הפנימי של הסמן הגלובלי.
  const handleParallaxEnter = () => {
    if (prefersReducedMotion) return;
    window.dispatchEvent(new CustomEvent('customcursor:hide'));
  };
  const handleParallaxLeave = () => {
    if (prefersReducedMotion) return;
    window.dispatchEvent(new CustomEvent('customcursor:show'));
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 text-white ${
        prefersReducedMotion ? '' : 'cursor-none'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleParallaxEnter}
      onMouseLeave={handleParallaxLeave}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-white opacity-10"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
          }}
          animate={prefersReducedMotion ? undefined : { x: [0, bubble.amplitudeX, 0], y: [0, bubble.amplitudeY, 0] }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: bubble.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="p-8 rounded-lg shadow-xl bg-blue-800 bg-opacity-75"
        style={{ x, y, rotate }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <h2 className="text-4xl font-bold text-center" dir="ltr">{t('home_parallax_title')}</h2>
        <p className="mt-4 max-w-md text-center text-lg">
          {t('home_parallax_text')}
        </p>
      </motion.div>
    </section>
  );
};

const CursorTrail = () => {
  // prefers-reduced-motion: שני ה-effects לא נרשמים בכלל - trails נשאר ריק לצמיתות,
  // כך שהרכיב לא מרנדר שום דבר, בלי צורך בלוגיקת תנאי נוספת ב-return.
  const prefersReducedMotion = useReducedMotion();
  const [trails, setTrails] = useState([]);
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const handleMouseMove = (e) => {
      setTrails((prev) => [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const interval = setInterval(() => {
      setTrails((prev) => prev.filter((t) => Date.now() - t.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);
  return (
    <>
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="fixed w-3 h-3 bg-blue-700 rounded-full pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ top: trail.y, left: trail.x, transform: "translate(-50%, -50%)" }}
        />
      ))}
    </>
  );
};

const Home = () => {
  return (
    <div className="relative font-sans overflow-hidden">
      <Seo page="home" path="/" />
      <CursorTrail />
      <Dynamic3DBackground />
      <HeroSection />
      <SkillsSection />
      <ParallaxSection />
      {/* כאן נוסף משחק הקסם */}
      <MagicGame />
      {/* כאן נוסף המשחק החדש */}
      {/* <MonsterSideRunnerGame /> */}
      {/* Footer removed to avoid duplication */}
    </div>
  );
};

export default Home;
