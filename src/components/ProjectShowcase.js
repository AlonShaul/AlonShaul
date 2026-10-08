import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';

// עד מספר זה כל מקטע בפס ההתקדמות לחיץ; מעליו הפס הוא חיווי בלבד
const MAX_TRACK_BUTTONS = 8;
// מספר הטכנולוגיות שמוצגות לפני כפתור "+N"
const MAX_VISIBLE_TECH = 6;
// כרטיס שכן מוקטן, ומוזז כך שנשאר רווח אמיתי בינו לבין הכרטיס הפעיל:
// חצי כרטיס פעיל (50%) + רווח (4%) + חצי כרטיס מוקטן (43%) = 97% מרוחב הכרטיס
const SIDE_SCALE = 0.86;
const SLIDE_SHIFT = 97;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

const mod = (n, m) => ((n % m) + m) % m;

// מעקב אחר כפתור "עצירת אנימציות" של תפריט הנגישות (מוסיף stop-animations ל-<html>)
const useSiteAnimationsStopped = () => {
  const [stopped, setStopped] = useState(() =>
    document.documentElement.classList.contains('stop-animations')
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setStopped(root.classList.contains('stop-animations'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return stopped;
};

// מיקום, גודל ושקיפות של כרטיס לפי המרחק שלו מהכרטיס הפעיל
const slideState = (offset, range, sign) => {
  const isActive = offset === 0;
  const isVisible = offset >= range.lo && offset <= range.hi;
  return {
    x: `${offset * sign * SLIDE_SHIFT}%`,
    scale: isActive ? 1 : SIDE_SCALE,
    opacity: isActive ? 1 : isVisible ? 0.45 : 0,
  };
};

const navButtonClass =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-700 shadow-md ' +
  'transition duration-200 hover:scale-105 hover:border-blue-700 hover:bg-blue-700 hover:text-white active:scale-95 motion-reduce:transform-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ' +
  'dark:border-white/10 dark:bg-gray-800 dark:text-white dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:focus-visible:ring-offset-gray-900';

const chipClass =
  'rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ' +
  'dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200';

const NavButton = ({ direction, isRTL, label, onClick }) => {
  // "הקודם" נמצא בצד ההתחלה: שמאל ב-LTR, ימין ב-RTL
  const pointsLeft = (direction === 'prev') !== isRTL;
  const Icon = pointsLeft ? FaChevronLeft : FaChevronRight;
  return (
    <button type="button" onClick={onClick} aria-label={label} className={navButtonClass}>
      <Icon aria-hidden="true" />
    </button>
  );
};

const ProjectShowcase = ({ projects }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const sign = isRTL ? -1 : 1;

  const prefersReducedMotion = useReducedMotion();
  const siteAnimationsStopped = useSiteAnimationsStopped();
  const reduceMotion = prefersReducedMotion || siteAnimationsStopped;

  const total = projects.length;
  // position הוא מונה רציף (לא מוגבל ל-0..total-1) כדי שהקרוסלה תוכל להסתובב בלי סוף
  const [position, setPosition] = useState(0);
  const [expandedTech, setExpandedTech] = useState(null);
  const previousPosition = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    previousPosition.current = position;
  }, [position]);

  const activeIndex = mod(position, total);
  const canNavigate = total > 1;

  // אילו שכנים גלויים: עם 2 פרויקטים רק "הבא", עם 3 ומעלה אחד מכל צד
  const range = total >= 3 ? { lo: -1, hi: 1 } : total === 2 ? { lo: 0, hi: 1 } : { lo: 0, hi: 0 };
  // כרטיס שקוף נוסף מכל צד, כדי שכרטיס שנכנס לתצוגה יונפש פנימה ולא יקפוץ
  const buffer = canNavigate ? 1 : 0;
  const slots = [];
  for (let slot = position + range.lo - buffer; slot <= position + range.hi + buffer; slot++) {
    slots.push(slot);
  }

  const paginate = useCallback(
    (delta) => {
      if (total < 2 || delta === 0) return;
      setExpandedTech(null);
      setPosition((current) => current + delta);
    },
    [total]
  );

  const goTo = (index) => {
    let delta = index - activeIndex;
    if (total === 2) {
      // עם 2 פרויקטים השני תמיד מוצג בצד "הבא"
      delta = delta === 0 ? 0 : 1;
    } else {
      if (delta > total / 2) delta -= total;
      if (delta < -total / 2) delta += total;
    }
    paginate(delta);
  };

  const handleKeyDown = (event) => {
    if (!canNavigate) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      paginate(sign);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      paginate(-sign);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(total - 1);
    }
  };

  const handleDragEnd = (_event, info) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > SWIPE_DISTANCE || Math.abs(velocity.x) > SWIPE_VELOCITY) {
      // גרירה לכיוון ההתחלה מביאה את הפרויקט הבא
      paginate(offset.x < 0 ? sign : -sign);
    }
    // הקליק שמגיע מיד אחרי שחרור הגרירה לא אמור להפעיל קישור או מעבר
    setTimeout(() => {
      dragged.current = false;
    }, 0);
  };

  const slideTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 240, damping: 30, mass: 0.9 };

  const activeTitle = t(projects[activeIndex].titleKey);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('projects_carousel_label')}
      dir={isRTL ? 'rtl' : 'ltr'}
      onKeyDown={handleKeyDown}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {t('projects_status', { current: activeIndex + 1, total })}: {activeTitle}
      </p>

      <div className="relative overflow-hidden py-10">
        <motion.div
          className={`relative isolate grid touch-pan-y select-none ${
            canNavigate ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
          drag={canNavigate ? 'x' : false}
          dragSnapToOrigin
          dragDirectionLock
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={handleDragEnd}
        >
          {slots.map((slot) => {
            const offset = slot - position;
            const index = mod(slot, total);
            const project = projects[index];
            const isActive = offset === 0;
            const isVisible = offset >= range.lo && offset <= range.hi;
            const title = t(project.titleKey);
            const tech = project.tech || [];
            const isExpanded = expandedTech === project.id;
            const shownTech = isExpanded ? tech : tech.slice(0, MAX_VISIBLE_TECH);
            const hiddenTechCount = tech.length - MAX_VISIBLE_TECH;

            return (
              <motion.div
                key={slot}
                role="group"
                aria-roledescription="slide"
                aria-label={`${t('projects_status', { current: index + 1, total })}: ${title}`}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 flex w-[84%] max-w-[980px] justify-self-center sm:w-[72%] lg:w-[54%] xl:w-[68%] ${
                  isActive ? '' : isVisible ? 'cursor-pointer' : 'pointer-events-none'
                }`}
                style={{ zIndex: isActive ? 20 : isVisible ? 10 : 0 }}
                initial={slideState(slot - previousPosition.current, range, sign)}
                animate={slideState(offset, range, sign)}
                transition={slideTransition}
                onClick={
                  !isActive && isVisible
                    ? () => {
                        if (!dragged.current) paginate(offset);
                      }
                    : undefined
                }
              >
                {/* מובייל/טאבלט: תמונה למעלה ותוכן מתחת. דסקטופ רחב (xl): תמונה בצד ותוכן לצידה */}
                <article
                  inert={!isActive}
                  className={`flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white transition-shadow duration-500 dark:border-white/10 dark:bg-gray-800 xl:flex-row ${
                    isActive ? 'group/card shadow-2xl' : 'pointer-events-none shadow-md'
                  }`}
                >
                  {/* התמונה ממלאת את המסגרת בלי עיוות (object-cover) לפי נקודת המיקוד של הפרויקט */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 xl:aspect-[4/3] xl:w-[54%] xl:shrink-0">
                    <img
                      src={project.image}
                      srcSet={project.imageSrcSet}
                      sizes={project.imageSrcSet ? '(min-width: 1024px) 540px, (min-width: 640px) 72vw, 84vw' : undefined}
                      alt={t('projects_image_alt', { title })}
                      loading={isActive ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                      style={{
                        objectPosition: project.imagePosition || '50% 50%',
                        transformOrigin: project.imagePosition || '50% 50%',
                      }}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-4 p-6 text-start md:p-8 xl:justify-center">
                    <h3 className="break-words font-serif text-2xl font-bold leading-tight text-gray-900 dark:text-white md:text-3xl xl:text-2xl 2xl:text-3xl">
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base xl:text-sm 2xl:text-base">
                      {t(project.descriptionKey)}
                    </p>

                    {tech.length > 0 && (
                      <ul aria-label={t('projects_tech_label')} className="flex flex-wrap gap-2">
                        {shownTech.map((name) => (
                          <li key={name} className={chipClass}>
                            {name}
                          </li>
                        ))}
                        {hiddenTechCount > 0 && (
                          <li>
                            <button
                              type="button"
                              aria-label={t('projects_show_all_tech')}
                              aria-expanded={isExpanded}
                              tabIndex={isActive ? 0 : -1}
                              onClick={() => setExpandedTech(isExpanded ? null : project.id)}
                              className={`${chipClass} transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-blue-500/20`}
                            >
                              {isExpanded ? '−' : `+${hiddenTechCount}`}
                            </button>
                          </li>
                        )}
                      </ul>
                    )}

                    <div className="mt-auto pt-2 xl:mt-0">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isActive ? 0 : -1}
                        draggable={false}
                        onClick={(event) => {
                          if (dragged.current) event.preventDefault();
                        }}
                        className="group/cta inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                      >
                        <FaGithub aria-hidden="true" className="text-base" />
                        <span>{t('projects_view_github')}</span>
                        <span className="sr-only">
                          : {title} ({t('projects_new_tab')})
                        </span>
                        <FaArrowRight
                          aria-hidden="true"
                          className="text-xs transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transform-none rtl:rotate-180 rtl:group-hover/cta:-translate-x-1"
                        />
                      </a>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </motion.div>

        {/* דהייה עדינה בקצוות, כדי שהכרטיסים השכנים ייעלמו ברכות */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 w-4 bg-gradient-to-r from-gray-50 to-transparent rtl:bg-gradient-to-l dark:from-gray-900 lg:w-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-0 w-4 bg-gradient-to-l from-gray-50 to-transparent rtl:bg-gradient-to-r dark:from-gray-900 lg:w-20"
        />
      </div>

      {canNavigate && (
        <div className="flex items-center justify-center gap-5">
          <NavButton direction="prev" isRTL={isRTL} label={t('projects_prev')} onClick={() => paginate(-1)} />

          {/* פס התקדמות: מקטע אחד לכל פרויקט, והמחוון מחליק אל הפרויקט הפעיל */}
          <div className="group/track relative h-8 w-40 sm:w-56">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-gray-300 transition-all duration-300 group-hover/track:h-1.5 dark:bg-gray-700"
            >
              <motion.div
                className="absolute inset-y-0 start-0 rounded-full bg-blue-600 dark:bg-blue-400"
                style={{ width: `${100 / total}%` }}
                initial={false}
                animate={{ x: `${sign * activeIndex * 100}%` }}
                transition={slideTransition}
              />
            </div>

            {total <= MAX_TRACK_BUTTONS && (
              <div className="absolute inset-0 flex">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`${t('projects_go_to', { current: index + 1 })}: ${t(project.titleKey)}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    className="h-full flex-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                ))}
              </div>
            )}
          </div>

          <NavButton direction="next" isRTL={isRTL} label={t('projects_next')} onClick={() => paginate(1)} />
        </div>
      )}
    </section>
  );
};

export default ProjectShowcase;
