// frontend/src/components/WaveSeparator.js
import React from 'react';
import { motion } from 'framer-motion';

const WaveSeparator = ({ color = "#ffffff", flip = false }) => {
  return (
    <div className={`relative ${flip ? 'rotate-180' : ''}`}>
      <svg
        className="w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          fill={color}
          d="M0,160L48,149.3C96,139,192,117,288,112C384,107,480,117,576,138.7C672,160,768,192,864,202.7C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default WaveSeparator;
