import React from 'react';
import { motion } from 'framer-motion';

const DynamicSquares = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Square 1 */}
      <motion.div 
        className="absolute"
        style={{
          width: 150,
          height: 150,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "10%", left: "5%" }}
      />
      {/* Square 2 */}
      <motion.div 
        className="absolute"
        style={{
          width: 200,
          height: 200,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -150, 0], y: [0, 150, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "20%", left: "75%" }}
      />
      {/* Square 3 */}
      <motion.div 
        className="absolute"
        style={{
          width: 100,
          height: 100,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 80, 0], y: [0, 80, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "70%", left: "10%" }}
      />
      {/* Square 4 */}
      <motion.div 
        className="absolute"
        style={{
          width: 120,
          height: 120,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 50, 0], y: [0, -50, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "50%", left: "40%" }}
      />
      {/* Square 5 */}
      <motion.div 
        className="absolute"
        style={{
          width: 80,
          height: 80,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -70, 0], y: [0, 70, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "80%", left: "70%" }}
      />
      {/* Square 6 */}
      <motion.div 
        className="absolute"
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 90, 0], y: [0, -90, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "30%", left: "60%" }}
      />
      {/* Square 7 */}
      <motion.div 
        className="absolute"
        style={{
          width: 90,
          height: 90,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -40, 0], y: [0, 40, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "60%", left: "20%" }}
      />
      {/* Square 8 */}
      <motion.div 
        className="absolute"
        style={{
          width: 140,
          height: 140,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 70, 0], y: [0, -70, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "75%", left: "40%" }}
      />
    </div>
  );
};

export default DynamicSquares;
