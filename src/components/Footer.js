import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4" dir="rtl">
      <div className="container mx-auto text-center text-white">
         {new Date().getFullYear()} © - Alon Shaul
      </div>
    </footer>
  );
};

export default Footer;
