import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import spaceship from '../spaceship.png';


// הגדרות מהירויות ותדירויות
const SPELL_SPEED = 400;
const ENEMY_SPEED_MIN = 50;
const ENEMY_SPEED_MAX = 150;
const ENEMY_SPAWN_INTERVAL = 1500;
const COLLISION_DISTANCE = 30;
const ENEMY_BULLET_SPEED = 200;
const ENEMY_SHOOT_PROBABILITY = 0.5; // הסתברות לירי בשנייה לכל אויב
const METEOR_SPAWN_INTERVAL = 3000; // כל 3 שניות
const HEART_SPAWN_INTERVAL = 5000; // כל 5 שניות
const INVULNERABILITY_TIME = 500; // זמן בלתי חדיר במיליסקנד לאחר פגיעה

// משתנה שמאפשר להוסיף סיבוב נוסף למטאור (במעלות). שנה את הערך לפי הצורך.
const METEOR_ROTATION_OFFSET = -45; // לדוגמה, שנה ל-15 לקבלת סיבוב נוסף של 15 מעלות

// פונקציה לחישוב מרחק בין שתי נקודות
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// מערך נתונים עבור כוכבי הלכת – ודא שהתמונות קיימות בתיקייה ../planets/
const planetData = [
  { name: 'Mercury', src: require('../planets/mercury.png') },
  { name: 'Venus', src: require('../planets/venus.png') },
  { name: 'Earth', src: require('../planets/earth.png') },
  { name: 'Mars', src: require('../planets/mars.png') },
  { name: 'Jupiter', src: require('../planets/jupiter.png') },
  { name: 'Saturn', src: require('../planets/saturn.png') },
  { name: 'Uranus', src: require('../planets/uranus.png') },
  { name: 'Neptune', src: require('../planets/neptune.png') },
];

// פונקציה להחזרת כוכב לכת אקראי בגודל קבוע עם "עומק" אקראי (ללא שינוי בגודל התמונה)
const getRandomPlanet = (containerWidth, containerHeight) => {
  const randomPlanet = planetData[Math.floor(Math.random() * planetData.length)];
  const size = 40; // גודל קבוע
  const img = new Image();
  img.src = randomPlanet.src;
  // ערך עומק אקראי בין 0.5 (רחוק) ל-1.0 (קרוב)
  const depth = 0.5 + Math.random() * 0.5;
  return {
    name: randomPlanet.name,
    img: img,
    x: Math.random() * (containerWidth - size),
    y: -Math.random() * (containerHeight / 2),
    size: size,
    speed: (12 + Math.random() * 70) * depth,
    depth: depth,
  };
};

// פונקציה להחזרת מטאור אקראי – אין סיבוב פנימי, אך ניתן להוסיף סיבוב נוסף לפי METEOR_ROTATION_OFFSET
const getRandomMeteor = (containerWidth, containerHeight) => {
  const size = 40; // גודל קבוע
  return {
    id: Date.now() + Math.random(),
    x: Math.random() * (containerWidth - size),
    y: -Math.random() * (containerHeight / 2),
    size: size,
    speed: 80 + Math.random() * 40,
    dx: -20 + Math.random() * 40,
    rotation: 0,          // ללא סיבוב פנימי
    rotationSpeed: 0,     // ללא סיבוב פנימי
  };
};

// פונקציה להחזרת לב נופל (falling heart)
const getRandomHeart = (containerWidth, containerHeight) => {
  const size = 20; // גודל לב קטן
  return {
    id: Date.now() + Math.random(),
    x: Math.random() * (containerWidth - size),
    y: -Math.random() * (containerHeight / 2),
    size: size,
    speed: 60 + Math.random() * 20,
  };
};

const MagicGame = () => {
  const { t } = useTranslation();
  
  // משתני משחק
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // מערכים עבור יריות, אויבים, יריות אויב והתפוצצויות
  const spellsRef = useRef([]);
  const enemiesRef = useRef([]);
  const enemyBulletsRef = useRef([]);
  const explosionsRef = useRef([]);

  // מערך כוכבים (רקע)
  const starsRef = useRef([]);
  // מערך "כוכבי לכת פעילים" – מציגים 3 בכל זמן נתון
  const activePlanetsRef = useRef([]);
  // מערך מטאורים
  const meteorsRef = useRef([]);
  // מערך לבבות נופלים
  const heartsRef = useRef([]);

  // הגדרת meteorImgRef
  const meteorImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = require('../planets/meteor.png');
    meteorImgRef.current = img;
  }, []);

  // מניעת פגיעות חוזרות
  const invulnerableUntilRef = useRef(0);

  // מיקום החללית (מעודכן לפי תנועת העכבר)
  const playerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 100 });

  // רפרנסים לקאנבס ולמיכל, עם הגדרת גובה 90vh
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.9,
  });

  // אתחול מערך הכוכבים – 60 כוכבים, opacity 0.6
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * containerSize.width,
        y: Math.random() * containerSize.height,
        size: 1 + Math.random() * 2,
        speed: 10 + Math.random() * 10,
      });
    }
    starsRef.current = stars;
  }, [containerSize]);

  // אתחול "כוכבי הלכת הפעילים" – 3 כוכבי לכת
  useEffect(() => {
    activePlanetsRef.current = [
      getRandomPlanet(containerSize.width, containerSize.height),
      getRandomPlanet(containerSize.width, containerSize.height),
      getRandomPlanet(containerSize.width, containerSize.height)
    ];
  }, [containerSize]);

  // יצירת מטאורים – בכל METEOR_SPAWN_INTERVAL, יווצרו 1 עד 3 מטאורים
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const spawnMeteors = () => {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        meteorsRef.current.push(getRandomMeteor(containerSize.width, containerSize.height));
      }
    };
    const interval = setInterval(spawnMeteors, METEOR_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [containerSize.width, containerSize.height, gameOver, gameStarted]);

  // יצירת לבבות נופלים – בכל HEART_SPAWN_INTERVAL, יווצר לב אם אין לב במערכת
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const spawnHeart = () => {
      if (heartsRef.current.length < 1) {
        heartsRef.current.push(getRandomHeart(containerSize.width, containerSize.height));
      }
    };
    const interval = setInterval(spawnHeart, HEART_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [containerSize.width, containerSize.height, gameOver, gameStarted]);

  // עדכון גודל הקאנבס בעת שינוי חלון
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight * 0.9;
      setContainerSize({ width: newWidth, height: newHeight });
      if (canvasRef.current) {
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // טעינת תמונת החללית
  const spaceshipImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = spaceship;
    spaceshipImgRef.current = img;
  }, []);

  // מאזין לתנועת העכבר – עדכון מיקום החללית
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(e.clientX - rect.left, containerSize.width - 40));
      const y = Math.max(40, Math.min(e.clientY - rect.top, containerSize.height - 40));
      playerPosRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [containerSize]);

  // מאזין ללחיצה – יורה קסם אם המשחק התחיל
  useEffect(() => {
    const handleClick = () => {
      if (!gameStarted) return;
      spellsRef.current.push({
        id: Date.now(),
        x: playerPosRef.current.x,
        y: playerPosRef.current.y - 40,
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [gameStarted]);

  // יצירת אויבים – מופעלת רק לאחר התחלת המשחק
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const spawnEnemy = () => {
      if (enemiesRef.current.length > 20) return;
      enemiesRef.current.push({
        id: Date.now(),
        x: 40 + Math.random() * (containerSize.width - 80),
        y: -50,
        speed: ENEMY_SPEED_MIN + Math.random() * (ENEMY_SPEED_MAX - ENEMY_SPEED_MIN),
        type: Math.floor(Math.random() * 3),
      });
    };
    const interval = setInterval(spawnEnemy, ENEMY_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [containerSize.width, containerSize.height, gameOver, gameStarted]);

  // לולאת המשחק – מעדכנת מיקומים ובודקת התנגשות
  const lastTimeRef = useRef(null);
  const gameLoop = useCallback((time) => {
    if (gameOver || !gameStarted) return;
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    // עדכון כוכבים – תנועה איטית למטה, ואתחול כאשר עוברים את הקצה (+100)
    starsRef.current.forEach(star => {
      star.y += star.speed * deltaTime;
      if (star.y > containerSize.height + 100) {
        star.y = 0;
        star.x = Math.random() * containerSize.width;
      }
    });

    // עדכון כוכבי הלכת הפעילים – הם נעים למטה; כאשר אחד מהם עובר את הקצה, מוחלף באחד חדש
    activePlanetsRef.current = activePlanetsRef.current.map(planet => {
      planet.y += planet.speed * deltaTime;
      if (planet.y > containerSize.height + 100) {
        return getRandomPlanet(containerSize.width, containerSize.height);
      }
      return planet;
    });

    // עדכון מטאורים – תנועה ללא סיבוב, ואתחול מחדש כאשר עוברים את הקצה
    meteorsRef.current = meteorsRef.current.map(meteor => {
      meteor.y += meteor.speed * deltaTime;
      meteor.x += meteor.dx * deltaTime;
      return meteor;
    }).filter(meteor => meteor.y < containerSize.height + meteor.size + 100);

    // עדכון לבבות נופלים – תנועה, ואתחול כאשר עוברים את הקצה
    heartsRef.current = heartsRef.current.map(heart => {
      heart.y += heart.speed * deltaTime;
      return heart;
    }).filter(heart => heart.y < containerSize.height + heart.size + 100);

    // עדכון יריות החללית
    spellsRef.current = spellsRef.current
      .map(spell => ({ ...spell, y: spell.y - SPELL_SPEED * deltaTime }))
      .filter(spell => spell.y > -50);

    // עדכון אויבים וירי אויב – יריות של יריב יוצאות ממרכזו + 40
    enemiesRef.current.forEach(enemy => {
      enemy.y += enemy.speed * deltaTime;
      if (Math.random() < ENEMY_SHOOT_PROBABILITY * deltaTime) {
        enemyBulletsRef.current.push({
          id: Date.now() + Math.random(),
          x: enemy.x,
          y: enemy.y + 40,
          dx: 0,
          dy: 1,
          speed: ENEMY_BULLET_SPEED,
        });
      }
    });
    enemiesRef.current = enemiesRef.current.filter(enemy => enemy.y < containerSize.height + 100);

    // עדכון יריות אויב
    enemyBulletsRef.current = enemyBulletsRef.current
      .map(bullet => ({
        ...bullet,
        x: bullet.x + bullet.dx * bullet.speed * deltaTime,
        y: bullet.y + bullet.dy * bullet.speed * deltaTime,
      }))
      .filter(bullet =>
        bullet.x >= -50 && bullet.x <= containerSize.width + 50 &&
        bullet.y >= -50 && bullet.y <= containerSize.height + 100
      );

    // בדיקת התנגשות קסמים עם אויבים
    const collidedSpellIds = new Set();
    enemiesRef.current = enemiesRef.current.filter(enemy => {
      let hit = false;
      spellsRef.current.forEach(spell => {
        if (distance(spell, enemy) < COLLISION_DISTANCE) {
          hit = true;
          collidedSpellIds.add(spell.id);
        }
      });
      if (hit) {
        explosionsRef.current.push({
          id: Date.now() + Math.random(),
          x: enemy.x,
          y: enemy.y,
          start: Date.now(),
        });
        setScore(prev => prev + 1);
      }
      return !hit;
    });
    spellsRef.current = spellsRef.current.filter(spell => !collidedSpellIds.has(spell.id));

    // בדיקת התנגשות קסמים עם מטאורים – אם יורים עליהם, הם מתפוצצים
    meteorsRef.current = meteorsRef.current.filter(meteor => {
      let hit = false;
      spellsRef.current.forEach(spell => {
        if (distance(spell, meteor) < COLLISION_DISTANCE) {
          hit = true;
        }
      });
      if (hit) {
        explosionsRef.current.push({
          id: Date.now() + Math.random(),
          x: meteor.x,
          y: meteor.y,
          start: Date.now(),
        });
        setScore(prev => prev + 1);
        return false;
      }
      return true;
    });

    // בדיקת התנגשות יריות אויב עם החללית (סף 15)
    if (time > invulnerableUntilRef.current) {
      let collisionDetected = false;
      enemyBulletsRef.current = enemyBulletsRef.current.filter(bullet => {
        if (distance(bullet, playerPosRef.current) < 15) {
          collisionDetected = true;
          return false;
        }
        return true;
      });
      if (collisionDetected) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
        invulnerableUntilRef.current = time + INVULNERABILITY_TIME;
      }
    }

    // בדיקת התנגשות מטאורים עם החללית (סף 30)
    meteorsRef.current = meteorsRef.current.filter(meteor => {
      if (distance(meteor, playerPosRef.current) < 30) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
        explosionsRef.current.push({
          id: Date.now() + Math.random(),
          x: meteor.x,
          y: meteor.y,
          start: Date.now(),
        });
        return false;
      }
      return true;
    });

    // בדיקת התנגשות לבבות נופלים עם החללית (סף 20) – אם נלכד, מוסיפים לב אחד
    heartsRef.current = heartsRef.current.filter(heart => {
      if (distance(heart, playerPosRef.current) < 20) {
        setLives(prev => prev + 1);
        return false;
      }
      return true;
    });

    // בדיקת התנגשות בין המטוס של השחקן לבין המטוס היריב
    enemiesRef.current = enemiesRef.current.filter(enemy => {
      if (distance(enemy, playerPosRef.current) < 30) {
        explosionsRef.current.push({
          id: Date.now() + Math.random(),
          x: enemy.x,
          y: enemy.y,
          start: Date.now(),
        });
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
        return false;
      }
      return true;
    });

    // הסרת התפוצצויות ישנות (גיל מעל 800ms)
    explosionsRef.current = explosionsRef.current.filter(exp => Date.now() - exp.start < 800);

    draw();
    requestAnimationFrame(gameLoop);
  }, [containerSize, gameOver, gameStarted]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ציור כוכבים – opacity 0.6
    starsRef.current.forEach(star => {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור כוכבי לכת – מציגים 3 פעילים, עם שקיפות על פי העומק
    activePlanetsRef.current.forEach(planet => {
      if (planet.img.complete) {
        ctx.save();
        ctx.globalAlpha = planet.depth;
        ctx.drawImage(planet.img, planet.x, planet.y, planet.size, planet.size);
        ctx.restore();
      }
    });

    // ציור מטאורים – מציגים מטאורים ללא סיבוב (ניתן להוסיף סיבוב נוסף לפי METEOR_ROTATION_OFFSET)
    meteorsRef.current.forEach(meteor => {
      ctx.save();
      ctx.translate(meteor.x + meteor.size/2, meteor.y + meteor.size/2);
      ctx.rotate(((meteor.rotation + METEOR_ROTATION_OFFSET) * Math.PI) / 180);
      if (meteorImgRef.current && meteorImgRef.current.complete) {
        ctx.drawImage(meteorImgRef.current, -meteor.size/2, -meteor.size/2, meteor.size, meteor.size);
      } else {
        ctx.fillStyle = "gray";
        ctx.fillRect(-meteor.size/2, -meteor.size/2, meteor.size, meteor.size);
      }
      ctx.restore();
    });

    // ציור לבבות נופלים – מציירים את האימוג'י "❤️"
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    heartsRef.current.forEach(heart => {
      ctx.fillText("❤️", heart.x, heart.y);
    });

    // ציור יריות החללית (כדורים כחולים)
    spellsRef.current.forEach(spell => {
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור אויבים עם להבה בזנב – נגדיר להם פילטר אדום-צהוב
    enemiesRef.current.forEach(enemy => {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.rotate(Math.PI);
      const flameGradient = ctx.createLinearGradient(0, 30, 0, 50);
      flameGradient.addColorStop(0, "rgba(255,200,0,1)");
      flameGradient.addColorStop(1, "rgba(255,0,0,0)");
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.ellipse(0, 40, 10, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "sepia(1) saturate(5000%) hue-rotate(0deg) brightness(1.1)";
      ctx.drawImage(spaceshipImgRef.current, -20, -20, 40, 40);
      ctx.filter = "none";
      ctx.restore();
    });

    // ציור יריות אויב (כדורים אדומים)
    enemyBulletsRef.current.forEach(bullet => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור התפוצצויות – גרדיאנט מעגלי בולט יותר
    explosionsRef.current.forEach(exp => {
      const age = Date.now() - exp.start;
      const progress = age / 800;
      const radius = 15 + progress * 20;
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${1 - progress})`);
      gradient.addColorStop(0.3, `rgba(255,100,0,${0.8 - progress * 0.8})`);
      gradient.addColorStop(1, "rgba(0,212,255,0)");
      ctx.fillStyle = gradient;
      ctx.arc(exp.x, exp.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור החללית של השחקן עם פילטר בגווני כחול
    if (spaceshipImgRef.current) {
      ctx.save();
      ctx.translate(playerPosRef.current.x, playerPosRef.current.y);
      const flameGradient = ctx.createLinearGradient(0, 20, 0, 60);
      flameGradient.addColorStop(0, "rgba(255,200,0,1)");
      flameGradient.addColorStop(1, "rgba(255,0,0,0)");
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.ellipse(0, 40, 10, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "sepia(1) saturate(5000%) hue-rotate(190deg) brightness(1.1)";
      ctx.drawImage(spaceshipImgRef.current, -20, -20, 40, 40);
      ctx.filter = "none";
      ctx.restore();
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      lastTimeRef.current = null;
      requestAnimationFrame(gameLoop);
    }
  }, [gameLoop, gameOver, gameStarted]);

  const restartGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    spellsRef.current = [];
    enemiesRef.current = [];
    enemyBulletsRef.current = [];
    explosionsRef.current = [];
    meteorsRef.current = [];
    heartsRef.current = [];
    invulnerableUntilRef.current = 0;
    lastTimeRef.current = null;
  };

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[90vh] overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at center, #001f3f 0%, #004080 50%, #005f99 100%)',
        cursor: gameStarted ? 'none' : 'default',
      }}
    >
      <canvas
        ref={canvasRef}
        width={containerSize.width}
        height={containerSize.height}
        className="w-full h-full"
      />
      {!gameStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500">
          <h1 className="text-6xl text-white font-extrabold mb-6">
            {t('magicGame_startPrompt_title', 'האם אתה מוכן לגלות קסם?')}
          </h1>
          <p className="text-2xl text-white mb-10">
            {t('magicGame_startPrompt_text', 'לחץ על "התחל" ותצטרף למסע מרהיב בחלל...')}
          </p>
          <button
            className="px-6 py-3 text-2xl font-bold rounded bg-blue-400 text-white hover:bg-blue-500"
            onClick={startGame}
          >
            {t('magicGame_startPrompt_button', 'התחל')}
          </button>
        </div>
      )}
      {gameStarted && (
        <>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-10 py-5 rounded-3xl bg-blue-900 bg-opacity-90 border-4 border-blue-400 text-white font-extrabold text-4xl shadow-2xl">
            Score: {score}
          </div>
          <div className ="absolute top-4 left-4 z-50 text-4xl flex items-center" dir="ltr"> 
            <span className="mr-2 text-white font-bold">Lives:</span>
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i} style={{ marginRight: 5 }}>❤️</span>
            ))}
          </div>
        </>
      )}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="p-10 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #004080, #005f99)' }}>
            <h1 className="text-6xl text-white font-extrabold mb-6">Game Over</h1>
            <button
              className="px-6 py-3 text-2xl font-bold rounded bg-blue-400 text-white hover:bg-blue-500"
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicGame;
