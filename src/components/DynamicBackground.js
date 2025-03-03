import React from 'react';
import { motion } from 'framer-motion';

const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* עיגול גרדיאנטי 1 */}
      <motion.div 
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 150, 0], y: [0, -120, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "8%", left: "12%" }}
      />
      {/* עיגול גרדיאנטי 2 */}
      <motion.div 
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -180, 0], y: [0, 180, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "45%", left: "65%" }}
      />
      {/* עיגול גרדיאנטי 3 */}
      <motion.div 
        className="absolute rounded-full"
        style={{
          width: 150,
          height: 150,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 80, 0], y: [0, 80, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "75%", left: "25%" }}
      />
      {/* עיגול גרדיאנטי 4 */}
      <motion.div 
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "60%", left: "10%" }}
      />
      {/* עיגול גרדיאנטי 5 */}
      <motion.div 
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -80, 0], y: [0, 80, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "85%", left: "55%" }}
      />
    </div>
  );
};

export default DynamicBackground;
