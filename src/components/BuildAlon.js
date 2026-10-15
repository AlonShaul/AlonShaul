import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ארבעת ה"צמתים" החזותיים סביב המרכז - אלו אינם הסברי טכנולוגיה, אלא ייצוג חזותי-אישי
// לאופן העבודה שלי. השמות נשארים תמיד באנגלית (חתימה/מותג אישי), לא עוברים דרך i18n.
// כל הצמתים מעוגנים כעת ב-50%/50% (מרכז מוחלט) ומוזזים ע"י transform: translate עם
// calc(...var(--r)...) - משתנה CSS יחיד (--r) ששולט ברדיוס של כל ארבעת הצמתים גם יחד,
// כך שהגיאומטריה סימטרית באמת (לא 4 offsets נפרדים שצריך "לכוון בעין"). --r עצמו
// מוגדר רספונסיבית (ערך אחד למובייל, ערך אחר מ-sm ומעלה) על ה-wrapper של הסצנה.
const NODES = [
  { id: 'code', label: 'CODE', transform: 'translate(-50%, calc(-50% - var(--r)))', line: { x2: 100, y2: 33 } },
  { id: 'create', label: 'CREATE', transform: 'translate(calc(-50% + var(--r)), -50%)', line: { x2: 167, y2: 100 } },
  { id: 'learn', label: 'LEARN', transform: 'translate(-50%, calc(-50% + var(--r)))', line: { x2: 100, y2: 167 } },
  { id: 'build', label: 'BUILD', transform: 'translate(calc(-50% - var(--r)), -50%)', line: { x2: 33, y2: 100 } },
];

// toward/depth נשארים מפתח->ערך נפרד (לא קשורים לרדיוס הגיאומטרי הסטטי - אלו היסטים
// יחסיים לאנימציית build ולפרלקסה, לא למיקום המנוחה עצמו).
const BUILD_TOWARD = { code: { x: 0, y: 72 }, create: { x: -86, y: 0 }, learn: { x: 0, y: -72 }, build: { x: 86, y: 0 } };
const PARALLAX_DEPTH = { code: 11, create: 15, learn: 10, build: 14 };

const nodeButtonClass =
  'flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full border bg-white text-[0.65rem] sm:text-sm ' +
  'font-bold tracking-wide text-blue-700 shadow-md transition-colors duration-200 ' +
  'border-blue-200 dark:border-blue-400/30 dark:bg-gray-800 dark:text-blue-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-700';

// כוכבים מפוזרים על פני כל שטח התכונה - ללא שינוי ממקודם (מספר/בהירות/פיזור נשארים זהים).
const STAR_COUNT = 48;

// כל כוכב מורכב משתי שכבות - "הילה" מטושטשת (glow) ו"גרעין" חד במרכזה - כדי להיראות
// כמקור אור אמיתי, לא כנקודת CSS שטוחה. גוון הליבה/ההילה הוא slate (אפור עם נימה
// כחלחלה עדינה, לא אפור/שחור טהור) במצב בהיר, ולבן במצב כהה - כנדרש.
const STAR_CORE_CLASS = 'bg-slate-700 dark:bg-white';
const STAR_HALO_CLASS = 'bg-slate-500/60 dark:bg-white/70';
const STAR_SPARKLE_CLASS = 'stroke-slate-700 dark:stroke-white fill-slate-700 dark:fill-white';

// מידות הילה/גרעין (px) לפי שכבה - שלוש הרמות מהמשימה:
// faint="כוכבים רחוקים קטנים", medium="כוכבים בוהקים בינוניים", bright=מועמדים ל-sparkle.
const STAR_VISUAL_BY_TIER = {
  faint: { halo: 4, core: 1 },
  medium: { halo: 6.5, core: 1.6 },
  bright: { halo: 9, core: 2.3 },
};
// רק מספר קטן וקבוע של כוכבים (מתוך שכבת ה-bright) מקבלים גם קרני "נצנוץ" בת 4 חודים.
const MAX_SPARKLE_STARS = 5;

const BuildAlon = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const sceneRef = useRef(null);
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );
  const [hoveredId, setHoveredId] = useState(null);
  const [isBuilt, setIsBuilt] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const centerX = useTransform(mx, (v) => v * 5);
  const centerY = useTransform(my, (v) => v * 5);
  const codeX = useTransform(mx, (v) => v * PARALLAX_DEPTH.code);
  const codeY = useTransform(my, (v) => v * PARALLAX_DEPTH.code);
  const createX = useTransform(mx, (v) => v * PARALLAX_DEPTH.create);
  const createY = useTransform(my, (v) => v * PARALLAX_DEPTH.create);
  const learnX = useTransform(mx, (v) => v * PARALLAX_DEPTH.learn);
  const learnY = useTransform(my, (v) => v * PARALLAX_DEPTH.learn);
  const buildX = useTransform(mx, (v) => v * PARALLAX_DEPTH.build);
  const buildY = useTransform(my, (v) => v * PARALLAX_DEPTH.build);
  const parallaxByNode = useMemo(
    () => ({
      code: { x: codeX, y: codeY },
      create: { x: createX, y: createY },
      learn: { x: learnX, y: learnY },
      build: { x: buildX, y: buildY },
    }),
    [codeX, codeY, createX, createY, learnX, learnY, buildX, buildY]
  );

  const stars = useMemo(() => {
    let sparkleAssigned = 0;
    return Array.from({ length: STAR_COUNT }, (_, index) => {
      const roll = Math.random();
      let tier;
      let baseOpacity;
      if (roll < 0.6) {
        tier = 'faint';
        baseOpacity = 0.12 + Math.random() * 0.25;
      } else if (roll < 0.85) {
        tier = 'medium';
        baseOpacity = 0.3 + Math.random() * 0.3;
      } else {
        tier = 'bright';
        baseOpacity = 0.55 + Math.random() * 0.3;
      }
      const sparkle = tier === 'bright' && sparkleAssigned < MAX_SPARKLE_STARS;
      if (sparkle) sparkleAssigned += 1;
      return {
        id: index,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        tier,
        sparkle,
        twinkles: Math.random() < 0.22,
        baseOpacity,
        duration: 2.5 + Math.random() * 3,
        delay: Math.random() * 4,
      };
    });
  }, []);

  const enableMouseParallax = !isTouch && !prefersReducedMotion;
  const enableAutoFloat = isTouch && !prefersReducedMotion;

  const handleMouseMove = (event) => {
    if (!enableMouseParallax || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const toggleBuild = () => setIsBuilt((prev) => !prev);

  return (
    // אין יותר רקע/גבול/צל כרטיס - רק wrapper "בלתי נראה" לצורכי מיקום, גובה שמור
    // (תואם לגובה כרטיס ה"אודות"), מעקב עכבר, הכלת הכוכבים, ונגישות. הכוכבים/הסצנה
    // נראים ישירות על רקע העמוד.
    <div className="relative overflow-hidden p-6 sm:p-10 md:flex md:min-h-96 md:flex-col md:items-center md:justify-center">
      {stars.map((star) => {
        const visual = STAR_VISUAL_BY_TIER[star.tier];
        const sparkleSpan = visual.halo * 1.9;
        return (
          <motion.div
            key={star.id}
            aria-hidden="true"
            className="absolute"
            style={{
              top: star.top,
              left: star.left,
              width: visual.halo,
              height: visual.halo,
              opacity: star.baseOpacity,
            }}
            animate={
              star.twinkles && !prefersReducedMotion
                ? star.sparkle
                  ? {
                      opacity: [star.baseOpacity, Math.min(star.baseOpacity + 0.4, 1), star.baseOpacity],
                      scale: [1, 1.08, 1],
                    }
                  : { opacity: [star.baseOpacity, Math.min(star.baseOpacity + 0.35, 1), star.baseOpacity] }
                : undefined
            }
            transition={
              star.twinkles && !prefersReducedMotion
                ? { duration: star.duration, repeat: Infinity, ease: 'easeInOut', delay: star.delay }
                : undefined
            }
          >
            {/* הילה - עיגול מטושטש, רחב מהגרעין, נותן תחושת "זוהר" סביב הכוכב */}
            <div className={`absolute inset-0 rounded-full blur-[1px] ${STAR_HALO_CLASS}`} />
            {/* גרעין - נקודה חדה וקטנה במרכז ההילה, "המרכז הבוהק" של הכוכב */}
            <div
              className={`absolute inset-0 m-auto rounded-full ${STAR_CORE_CLASS}`}
              style={{ width: visual.core, height: visual.core }}
            />
            {/* נצנוץ 4-חודים - רק על מספר קטן וקבוע של כוכבי bright (star.sparkle) */}
            {star.sparkle && (
              <svg
                viewBox="0 0 20 20"
                className="absolute"
                style={{
                  width: sparkleSpan,
                  height: sparkleSpan,
                  top: (visual.halo - sparkleSpan) / 2,
                  left: (visual.halo - sparkleSpan) / 2,
                }}
              >
                <path
                  d="M10 1.5V7.5M10 12.5V18.5M1.5 10H7.5M12.5 10H18.5"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  className={STAR_SPARKLE_CLASS}
                />
                <circle cx="10" cy="10" r="1.6" className={STAR_SPARKLE_CLASS} />
              </svg>
            )}
          </motion.div>
        );
      })}

      <div className="relative z-10 mx-auto">
        {/* רמז אינטראקציה יחיד, עדין ומשני - עכשיו מעל ההרכב, לא מתחתיו. דוהה כשהזהות
            הסופית נחשפת (isBuilt), כדי לא "להתנגש" חזותית עם הפאנל הסופי. */}
        <motion.p
          className="mb-4 text-center text-xs text-gray-400 dark:text-gray-500"
          animate={{ opacity: isBuilt ? 0 : 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          {t('build_alon_hint')}
        </motion.p>

        {/* --r: רדיוס משותף יחיד לכל ארבעת הצמתים - 6rem (96px) במובייל, 8.125rem (130px)
            מ-sm ומעלה. גדל מהותית לעומת הגרסה הקודמת (ולא רק אופקית הפעם), ונבדק מתמטית
            שלא נוגע בגבול הסצנה גם בהיסט הפרלקסה/hover המקסימלי. הסצנה גם רבועה כעת
            (לא רק רחבה) כדי לתת רדיוס שווה לכל הכיוונים - שינוי גובה זה נדרש מבנית בשביל
            הגיאומטריה השווה שהתבקשה, לא שינוי עיצובי שרירותי. */}
        <div
          ref={sceneRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-72 w-72 sm:h-96 sm:w-96 [--r:6rem] sm:[--r:8.125rem]"
        >
          {/* קווי חיבור - בזמן hover/טרם ה-build מודגשים; ברגע שה-build מתרחש כולם דוהים
              יחד לשקיפות 0 (לא נשארים "דולקים" מאחורי הפאנל הסופי), וחוזרים לקדמותם
              בצורה סימטרית כשחוזרים למצב AS הרגיל. */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {NODES.map((node) => {
              const isHoverActive = hoveredId === node.id;
              return (
                <motion.line
                  key={node.id}
                  x1="100"
                  y1="100"
                  x2={node.line.x2}
                  y2={node.line.y2}
                  strokeWidth={isHoverActive ? 2 : 1.2}
                  strokeLinecap="round"
                  className={isHoverActive ? 'stroke-blue-500 dark:stroke-blue-400' : 'stroke-gray-300 dark:stroke-gray-600'}
                  animate={{ opacity: isBuilt ? 0 : isHoverActive ? 1 : 0.5 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
                />
              );
            })}
          </svg>

          {/* זוהר רך מאחורי המרכז */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div
              className={`h-24 w-24 rounded-full blur-2xl transition-all duration-700 ${
                isBuilt ? 'scale-150 bg-blue-500/60' : 'bg-blue-400/30'
              }`}
            />
          </div>

          {/* ארבעת הצמתים - עיגון קבוע ב-50%/50% + translate עם --r המשותף -> שכבת
              פרלקסה -> שכבת כפתור עם אנימציית build */}
          {NODES.map((node) => (
            <div
              key={node.id}
              className="absolute top-1/2 left-1/2"
              style={{ transform: node.transform }}
            >
              <motion.div
                style={
                  enableMouseParallax
                    ? { x: parallaxByNode[node.id].x, y: parallaxByNode[node.id].y }
                    : undefined
                }
                animate={
                  enableAutoFloat
                    ? { x: [0, 5, -5, 0], y: [0, -4, 4, 0] }
                    : undefined
                }
                transition={enableAutoFloat ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
              >
                <motion.button
                  type="button"
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId((prev) => (prev === node.id ? null : prev))}
                  onFocus={() => setHoveredId(node.id)}
                  onBlur={() => setHoveredId((prev) => (prev === node.id ? null : prev))}
                  animate={{
                    x: isBuilt ? BUILD_TOWARD[node.id].x : 0,
                    y: isBuilt ? BUILD_TOWARD[node.id].y : 0,
                    opacity: isBuilt ? 0 : 1,
                    scale: isBuilt ? 0.4 : hoveredId === node.id ? 1.06 : 1,
                  }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
                  // iOS Safari: רכיב עם box-shadow+border-radius שמונפש ב-transform בתוך
                  // שכבת-הורה שגם היא מתורגמת (parallax/auto-float) עלול לגרום ל-WebKit
                  // לצייר תיבת-גבולות מלבנית חשופה של ה-compositing layer (באג ידוע).
                  // will-change + backface-visibility:hidden מכריחים שכבה יציבה ותקינה,
                  // בלי לשנות צבע/גודל/מיקום/תזמון.
                  style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  className={`${nodeButtonClass} ${hoveredId === node.id ? 'border-blue-500 dark:border-blue-400' : ''}`}
                  dir="ltr"
                >
                  {node.label}
                </motion.button>
              </motion.div>
            </div>
          ))}

          {/* מרכז הסצנה: מונוגרמת AS, שבלחיצה עליה "בונה" את זהות המפתח */}
          <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
            <motion.button
              type="button"
              onClick={toggleBuild}
              aria-label={t('build_alon_cta_label')}
              aria-pressed={isBuilt}
              style={{ x: centerX, y: centerY }}
              animate={{
                width: isBuilt ? 288 : 96,
                height: isBuilt ? 168 : 96,
                borderRadius: isBuilt ? 24 : 999,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
              className="flex items-center justify-center bg-blue-700 text-white shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-700"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isBuilt ? (
                  <motion.div
                    key="identity"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.35 }}
                    className="px-4 text-center leading-tight"
                    dir="ltr"
                  >
                    <p className="text-lg sm:text-xl font-extrabold tracking-wide">ALON SHAUL</p>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-blue-100">FULL-STACK DEVELOPER</p>
                    <p className="mt-1.5 text-[0.7rem] sm:text-xs text-blue-200">Idea → Code → Product</p>
                  </motion.div>
                ) : (
                  <motion.span
                    key="as"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-orbitron text-2xl font-bold tracking-wider"
                    dir="ltr"
                  >
                    AS
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildAlon;
