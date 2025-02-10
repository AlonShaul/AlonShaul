import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 mt-8" dir="rtl">
      <div className="container mx-auto text-center text-white">
        © {new Date().getFullYear()} Alon Shaul. כל הזכויות שמורות.
      </div>
    </footer>
  );
};

export default Footer;
