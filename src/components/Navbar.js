import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const baseClass =
    "relative text-white font-rubik font-semibold tracking-wider text-xl transition-transform duration-300 hover:-translate-y-1 group";
  const activeClass = "text-yellow-400";

  const linkVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.1 }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.nav
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed w-full z-50 bg-gradient-to-r from-blue-500 to-blue-700 backdrop-blur-md shadow-lg"
          dir="ltr"
          style={{ userSelect: "none" }}  // <-- ביטול אפשרות הבחירה
        >
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            {/* קבוצת שמאל: לוגו, ThemeToggle, LanguageSwitcher */}
            <div className="flex items-center gap-6">
              <motion.div
                variants={linkVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <Link
                  to="/"
                  className="text-white hover:text-black text-2xl font-orbitron uppercase tracking-widest"
                >
                  Alon Shaul
                </Link>
              </motion.div>
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            {/* קבוצת ניווט – גרסת דסקטופ */}
            <div className="hidden md:flex flex-row-reverse space-x-6 space-x-reverse">
              {["home", "profile", "projects", "contact"].map((item) => (
                <motion.div
                  key={item}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  className="relative"
                >
                  <NavLink
                    to={item === "home" ? "/" : `/${item}`}
                    end={item === "home"}
                    className={({ isActive }) =>
                      `${baseClass} ${isActive ? activeClass : ""}`
                    }
                  >
                    {t(item)}
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
                  </NavLink>
                </motion.div>
              ))}
            </div>
            {/* תפריט המבורגר – גרסת מובייל */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none"
              >
                {menuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* תפריט נפתח למובייל */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="md:hidden bg-blue-600"
              >
                <div className="flex flex-col items-center space-y-4 py-4">
                  {["home", "profile", "projects", "contact"].map((item) => (
                    <NavLink
                      key={item}
                      to={item === "home" ? "/" : `/${item}`}
                      end={item === "home"}
                      className={({ isActive }) =>
                        `${baseClass} ${isActive ? activeClass : ""}`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {t(item)}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
