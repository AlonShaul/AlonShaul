import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MagicGame from '../components/MagicGame';
// import MonsterSideRunnerGame from '../components/MonsterSideRunnerGame';

const Dynamic3DBackground = () => {
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
        animate={{ rotateX: 360, rotateY: 360, rotateZ: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
        animate={{ rotateX: -360, rotateY: 360, rotateZ: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
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
        animate={{ rotateX: 360, rotateY: -360, rotateZ: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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
        animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
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
        animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, -180, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

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
          </div>
          <div className="md:w-1/4 flex justify-center items-center mb-6 md:mb-0">
            <motion.img
              src="/AlonShaul.png"
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
          </div>
          <div className="md:w-1/4 flex justify-center items-center mb-6 md:mb-0">
            <motion.img
              src="/AlonShaul.png"
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
            className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/React.png" alt="React" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">React</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_react_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/Nodejs.PNG" alt="Node.js" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">Node.js</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_node_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/Tailwind.png" alt="Tailwind CSS" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">Tailwind CSS</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_tailwind_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <div className="flex space-x-reverse space-x-2 mb-3">
                <img src="/icons/HTML.png" alt="HTML" className="w-10 h-10" />
                <img src="/icons/CSS.png" alt="CSS" className="w-10 h-10" />
                <img src="/icons/JS.png" alt="JS" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">HTML/CSS/JS</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_htmlcssjs_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/MongoDB.png" alt="MongoDB" className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-white">MongoDB</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                {t('home_skills_mongo_text')}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="cursor-pointer bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl dark:hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="flex flex-col items-center">
              <img src="/icons/Python.png" alt="Python" className="w-12 h-12 mb-3" />
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const handleMouseMove = (e) => {
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

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 text-white"
      onMouseMove={handleMouseMove}
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
          animate={{ x: [0, bubble.amplitudeX, 0], y: [0, bubble.amplitudeY, 0] }}
          transition={{ duration: bubble.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="p-8 rounded-lg shadow-xl bg-blue-800 bg-opacity-75"
        style={{ x, y, rotate }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <h2 className="text-4xl font-bold text-center">Dive Into Depth</h2>
        <p className="mt-4 text-lg" dir="ltr">
          Enjoy a dynamic parallax effect that responds to your mouse movements
        </p>
      </motion.div>
    </section>
  );
};

const BeyondHorizonSection = () => {
  const mvX = useMotionValue(0);
  const [gaugeValue, setGaugeValue] = useState(50);
  const needleRotation = useTransform(mvX, [-200, 200], [-45, 45]);

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2;
    const offsetX = e.clientX - centerX;
    const clampedX = Math.max(-200, Math.min(200, offsetX));
    mvX.set(clampedX);
    const gaugeVal = (e.clientX / window.innerWidth) * 100;
    setGaugeValue(gaugeVal.toFixed(0));
  };

  const bubbles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, index) => ({
        id: index,
        size: 30 + Math.random() * 50,
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        amplitudeX: 10 + Math.random() * 20,
        amplitudeY: 10 + Math.random() * 20,
        duration: 4 + Math.random() * 3,
      })),
    []
  );

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
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
          animate={{ x: [0, bubble.amplitudeX, 0], y: [0, bubble.amplitudeY, 0] }}
          transition={{ duration: bubble.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <svg className="absolute" width="300" height="300" viewBox="0 0 300 300">
        <path
          d="M50,250 A100,100 0 0,1 250,250"
          stroke="#ffffff33"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <motion.svg className="absolute" width="300" height="300" viewBox="0 0 300 300">
        <motion.line
          x1="150"
          y1="250"
          x2="150"
          y2="100"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ originX: "50%", originY: "100%", rotate: needleRotation }}
        />
      </motion.svg>
      <motion.div
        className="relative z-10 text-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold mb-2">Energy Level</h2>
        <p className="text-2xl">{gaugeValue}%</p>
        <p className="mt-2 italic">Beyond the Horizon</p>
      </motion.div>
      <motion.div
        className="absolute bg-white rounded-full opacity-20"
        style={{ width: 50, height: 50, top: "10%", left: "10%" }}
        animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
};

const CursorTrail = () => {
  const [trails, setTrails] = useState([]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      setTrails((prev) => [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) => prev.filter((t) => Date.now() - t.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);
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

const ScrollIndicator = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-blue-700 dark:bg-blue-400 z-50"
      style={{ width: `${progress}%` }}
    />
  );
};

const Home = () => {
  return (
    <div className="relative font-sans overflow-hidden">
      <ScrollIndicator />
      <CursorTrail />
      <Dynamic3DBackground />
      <HeroSection />
      <SkillsSection />
      <ParallaxSection />
      <BeyondHorizonSection />
      {/* כאן נוסף משחק הקסם */}
      <MagicGame />
      {/* כאן נוסף המשחק החדש */}
      {/* <MonsterSideRunnerGame /> */}
      {/* Footer removed to avoid duplication */}
    </div>
  );
};

export default Home;
