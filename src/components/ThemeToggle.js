import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  // בעת טעינת הקומפוננטה, בדוק את localStorage ועדכן את מצב הנושא
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div onClick={toggleTheme} className="cursor-pointer flex items-center">
      {/* סליידר עם גודל מוקטן */}
      <div
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* הכפתור עם האייקון */}
        <div
          className={`absolute top-1 left-1 w-4 h-4 flex items-center justify-center transition-transform duration-300 ${
            isDark ? 'translate-x-6' : ''
          }`}
        >
          {isDark ? (
            // במצב חושך, הראה אייקון ירח (מעיד לעבור למצב אור)
            <img src="/icons/moon.png" alt="מצב חושך" className="w-4 h-4" />
          ) : (
            // במצב אור, הראה אייקון שמש (מעיד לעבור למצב חושך)
            <img src="/icons/sun.png" alt="מצב אור" className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
