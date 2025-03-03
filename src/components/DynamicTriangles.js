import React from 'react';
import { motion } from 'framer-motion';

const DynamicTriangles = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Triangle 1 */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 100,
          height: 100,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 100, 0], y: [0, -40, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "15%", left: "75%" }}
      />
      {/* Triangle 2 */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 120,
          height: 120,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -100, 0], y: [0, 50, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "65%", left: "20%" }}
      />
      {/* Triangle 3 */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 80,
          height: 80,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 60, 0], y: [0, 60, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "80%", left: "50%" }}
      />
      {/* Triangle 4 */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 90,
          height: 90,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 120, 0], y: [0, -60, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "30%", left: "10%" }}
      />
      {/* Triangle 5 */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 110,
          height: 110,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -80, 0], y: [0, 60, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "40%", left: "80%" }}
      />
      {/* Triangle 6 */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 70,
          height: 70,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 50, 0], y: [0, -50, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "75%", left: "60%" }}
      />
      {/* Triangle 7 (New) */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 130,
          height: 130,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, 120, 0], y: [0, -80, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "50%", left: "50%" }}
      />
      {/* Triangle 8 (New) */}
      <motion.div
        className="absolute rounded"
        style={{
          width: 60,
          height: 60,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)"
        }}
        animate={{ x: [0, -40, 0], y: [0, 20, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        initial={{ top: "25%", left: "30%" }}
      />
    </div>
  );
};

export default DynamicTriangles;
