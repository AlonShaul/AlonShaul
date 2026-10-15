import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';

// אלמנטים שנחשבים "אינטראקטיביים" לצורך אפקט ה-hover העדין (שינוי scale קטן בלבד -
// לא צורה/גודל/צבע שונים, כנדרש).
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [tabindex]';

// צורת חץ-סמן מינימלית וגיאומטרית - לא עיגול/נקודה/קרוסהייר. הקצה החד נמצא ב-(3,2),
// כך שה-wrapper מוזז ב-translate(-3px,-2px) כדי שהקצה הזה (לא מרכז ה-SVG) יישב בדיוק
// על קואורדינטת העכבר האמיתית - כפי שסמן מערכת אמיתי מתנהג.
const CURSOR_PATH = 'M3 2L3 17.5L7 13.8L9.5 19.5L12 18.3L9.7 12.8L15 12.5L3 2Z';

const CustomCursor = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isHiddenByParallax, setIsHiddenByParallax] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // זיהוי מצביע-עדין (עכבר/trackpad) לעומת מכשיר מגע-בלבד. נבדק פעם אחת, ומאזין
  // ל-change למקרה של מכשיר היברידי (למשל טאבלט שמתחבר גם לעכבר).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia('(pointer: fine) and (hover: hover)');
    setIsActive(mql.matches);
    const handleChange = (event) => setIsActive(event.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // מעקב מיקום ישיר (useMotionValue, לא React state) - ללא קפיץ/החלקה, תגובה מיידית.
  // מאזיני hover (delegation על document, לא על כל אלמנט בנפרד) לאפקט ה-scale העדין.
  useEffect(() => {
    if (!isActive) return undefined;

    const handleMouseMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const handleMouseOver = (event) => {
      if (event.target.closest(INTERACTIVE_SELECTOR)) setIsHoveringInteractive(true);
    };
    const handleMouseOut = (event) => {
      if (event.target.closest(INTERACTIVE_SELECTOR)) setIsHoveringInteractive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isActive, x, y]);

  // חריג ה-Parallax: מאזינים לאירועים גלובליים פשוטים (לא Context/state ניהולי) -
  // כך ש-Home.js/ParallaxSection לא צריכים לדעת שום דבר על המימוש הפנימי של הסמן,
  // ו-CustomCursor לא צריך לייבא/להכיר את Home.js בכלל.
  useEffect(() => {
    if (!isActive) return undefined;
    const handleHide = () => setIsHiddenByParallax(true);
    const handleShow = () => setIsHiddenByParallax(false);
    window.addEventListener('customcursor:hide', handleHide);
    window.addEventListener('customcursor:show', handleShow);
    return () => {
      window.removeEventListener('customcursor:hide', handleHide);
      window.removeEventListener('customcursor:show', handleShow);
    };
  }, [isActive]);

  // מסתירים את סמן המערכת הרגיל אך ורק כש-isActive==true (הסמן המותאם אכן פעיל) -
  // כך שלעולם לא נוצר מצב של שני הסמנים נעלמים (אם isActive==false, הקלאס הזה
  // לעולם לא מתווסף, וסמן המערכת הרגיל ממשיך לעבוד בדיוק כרגיל - נפילה בטוחה).
  useEffect(() => {
    const root = document.documentElement;
    if (isActive) {
      root.classList.add('custom-cursor-active');
    } else {
      root.classList.remove('custom-cursor-active');
    }
    return () => root.classList.remove('custom-cursor-active');
  }, [isActive]);

  if (!isActive) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x, y, opacity: isHiddenByParallax ? 0 : 1 }}
      transition={{ duration: 0 }}
    >
      <motion.svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        style={{ transform: 'translate(-3px, -2px)' }}
        animate={{ scale: isHoveringInteractive ? 1.15 : 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: 'easeOut' }}
        className="drop-shadow-sm"
      >
        <path
          d={CURSOR_PATH}
          className="fill-gray-900 stroke-gray-400 dark:fill-white dark:stroke-gray-500"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
};

export default CustomCursor;
