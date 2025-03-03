// import React, { useState, useEffect, useMemo } from 'react';
// import { motion } from 'framer-motion';

// const MagicSection = () => {
//   const [explosions, setExplosions] = useState([]);

//   // חלקיקי רקע (ambient) נעים בכל האזור
//   const ambientParticles = useMemo(() => {
//     return Array.from({ length: 15 }).map((_, index) => ({
//       id: index,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: 10 + Math.random() * 20,
//       offsetX: (Math.random() - 0.5) * 30,
//       offsetY: (Math.random() - 0.5) * 30,
//       duration: 4 + Math.random() * 3,
//     }));
//   }, []);

//   // מאזין ללחיצות על כל הרקע
//   const handleClick = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const newExplosion = { id: Date.now(), x, y };
//     setExplosions(prev => [...prev, newExplosion]);
//   };

//   // מסירים את האפקטים לאחר 1 שנייה
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setExplosions(prev => prev.filter(exp => Date.now() - exp.id < 1000));
//     }, 100);
//     return () => clearInterval(interval);
//   }, []);

//   // פונקציה שמייצרת אפקט התפוצצות (ריפל + חלקיקי burst) בנקודת הלחיצה
//   const renderExplosion = (explosion) => {
//     // יוצרים סט של 12 חלקיקים עם כיוונים אקראיים
//     const particles = Array.from({ length: 12 }).map((_, i) => {
//       const angle = Math.random() * 2 * Math.PI;
//       const distance = 30 + Math.random() * 20;
//       const dx = Math.cos(angle) * distance;
//       const dy = Math.sin(angle) * distance;
//       return (
//         <motion.div
//           key={`p-${explosion.id}-${i}`}
//           className="absolute rounded-full bg-blue-400"
//           style={{
//             width: 6,
//             height: 6,
//             top: explosion.y,
//             left: explosion.x,
//             transform: "translate(-50%, -50%)",
//           }}
//           initial={{ x: 0, y: 0, opacity: 1 }}
//           animate={{ x: dx, y: dy, opacity: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         />
//       );
//     });

//     return (
//       <React.Fragment key={explosion.id}>
//         {/* אפקט גל מתפשט */}
//         <motion.div
//           className="absolute rounded-full border border-blue-300"
//           style={{
//             top: explosion.y,
//             left: explosion.x,
//             transform: "translate(-50%, -50%)",
//           }}
//           initial={{ scale: 0, opacity: 0.8 }}
//           animate={{ scale: 3, opacity: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         />
//         {particles}
//       </React.Fragment>
//     );
//   };

//   return (
//     <section
//       onClick={handleClick}
//       className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700"
//     >
//       {/* חלקיקי רקע נעים */}
//       {ambientParticles.map(particle => (
//         <motion.div
//           key={particle.id}
//           className="absolute rounded-full bg-blue-500 opacity-20"
//           style={{
//             width: particle.size,
//             height: particle.size,
//             top: `${particle.y}%`,
//             left: `${particle.x}%`,
//           }}
//           animate={{ x: [0, particle.offsetX, 0], y: [0, particle.offsetY, 0] }}
//           transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut" }}
//         />
//       ))}

//       {/* אפקטי התפוצצות בלחיצה */}
//       {explosions.map(exp => renderExplosion(exp))}

//       {/* טקסט הנחיה */}
//       <motion.div
//         className="absolute z-10 text-white text-3xl font-bold select-none"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         לחץ בכל מקום לשחרר קסם!
//       </motion.div>
//     </section>
//   );
// };

// export default MagicSection;
