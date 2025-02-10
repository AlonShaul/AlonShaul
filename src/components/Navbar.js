import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 py-4" dir="ltr">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="text-white font-bold text-2xl">
          Alon Shaul
        </Link>
        <div className="space-x-reverse space-x-6">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}>
            ראשי
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}>
            פרופיל
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}>
            פרויקטים
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}>
            צור קשר
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
