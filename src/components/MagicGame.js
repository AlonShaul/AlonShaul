import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import spaceship from '../spaceship.png';
import pauseIcon from '../planets/pause.png';
import restartIcon from '../planets/Restart.png';
import resumeIcon from '../planets/Resume.png';

// ייבוא סאונדים
import addHeartSound from '../planets/AddHeart.mp3';
import gameOverSound from '../planets/GameOver.mp3';
import enemyBoomSound from '../planets/EnemyBoom.mp3';
import userBoomSound from '../planets/UserBoom.mp3';
import takeoffSound from '../planets/Takeoff.mp3';
import fireSound from '../planets/Fire.mp3';
import superExplosionUserSound from '../planets/SuperExplosionUser.mp3';

// הגדרות מהירויות ותדירויות
const SPELL_SPEED = 400;
const ENEMY_SPEED_MIN = 50;
const ENEMY_SPEED_MAX = 150;
const ENEMY_SPAWN_INTERVAL = 1500;
const COLLISION_DISTANCE = 30;
const ENEMY_BULLET_SPEED = 200;
const ENEMY_SHOOT_PROBABILITY = 0.5;
const METEOR_SPAWN_INTERVAL = 3000;
const HEART_SPAWN_INTERVAL = 5000;
const INVULNERABILITY_TIME = 500;

const METEOR_ROTATION_OFFSET = -45;
const GAME_OVER_DELAY = 20;

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

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

const getRandomPlanet = (containerWidth, containerHeight) => {
  const randomPlanet = planetData[Math.floor(Math.random() * planetData.length)];
  const size = 40;
  const img = new Image();
  img.src = randomPlanet.src;
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

const getRandomMeteor = (containerWidth, containerHeight) => {
  const size = 40;
  return {
    id: Date.now() + Math.random(),
    x: Math.random() * (containerWidth - size),
    y: -Math.random() * (containerHeight / 2),
    size: size,
    speed: 80 + Math.random() * 40,
    dx: -20 + Math.random() * 40,
    rotation: 0,
    rotationSpeed: 0,
  };
};

const getRandomHeart = (containerWidth, containerHeight) => {
  const size = 20;
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
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerWidth <= 768 ? window.innerHeight * 0.9 : window.innerHeight * 0.9,
  });

  const spellsRef = useRef([]);
  const enemiesRef = useRef([]);
  const enemyBulletsRef = useRef([]);
  const explosionsRef = useRef([]);
  const starsRef = useRef([]);
  const activePlanetsRef = useRef([]);
  const meteorsRef = useRef([]);
  const heartsRef = useRef([]);
  
  const meteorImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = require('../planets/meteor.png');
    meteorImgRef.current = img;
  }, []);

  const invulnerableUntilRef = useRef(0);
  const playerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 100 });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // אתחול כוכבים
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

  // אתחול כוכבי לכת – 3 כוכבים
  useEffect(() => {
    activePlanetsRef.current = [
      getRandomPlanet(containerSize.width, containerSize.height),
      getRandomPlanet(containerSize.width, containerSize.height),
      getRandomPlanet(containerSize.width, containerSize.height)
    ];
  }, [containerSize]);

  useEffect(() => {
    if (gameOver || !gameStarted || paused) return;
    const spawnMeteors = () => {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        meteorsRef.current.push(getRandomMeteor(containerSize.width, containerSize.height));
      }
    };
    const interval = setInterval(spawnMeteors, METEOR_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [containerSize.width, containerSize.height, gameOver, gameStarted, paused]);

  useEffect(() => {
    if (gameOver || !gameStarted || paused) return;
    const spawnHeart = () => {
      if (heartsRef.current.length < 1) {
        heartsRef.current.push(getRandomHeart(containerSize.width, containerSize.height));
      }
    };
    const interval = setInterval(spawnHeart, HEART_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [containerSize.width, containerSize.height, gameOver, gameStarted, paused]);

  useEffect(() => {
    if (gameOver || !gameStarted || paused) return;
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
  }, [containerSize.width, containerSize.height, gameOver, gameStarted, paused]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const mobile = newWidth <= 768;
      setIsMobile(mobile);
      const newHeight = mobile ? window.innerHeight * 0.8 : window.innerHeight * 0.9;
      setContainerSize({ width: newWidth, height: newHeight });
      if (canvasRef.current) {
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const spaceshipImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = spaceship;
    spaceshipImgRef.current = img;
  }, []);

  const lastMouseMoveRef = useRef(Date.now());
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastMouseMoveRef.current = Date.now();
      if (paused) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(e.clientX - rect.left, containerSize.width - 40));
      const y = Math.max(40, Math.min(e.clientY - rect.top, containerSize.height - 40));
      playerPosRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [containerSize, paused]);

  // במצב טלפון – עדכון מיקום החללית לפי לחיצה, וירי קסם (fire) ללא ניגון סאונד במובייל
  useEffect(() => {
    const handleClick = (e) => {
      if (!gameStarted || paused || gameOver) return;
      if (isMobile && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(40, Math.min(e.clientX - rect.left, containerSize.width - 40));
        const y = Math.max(40, Math.min(e.clientY - rect.top, containerSize.height - 40));
        playerPosRef.current = { x, y };
      }
      spellsRef.current.push({
        id: Date.now(),
        x: playerPosRef.current.x,
        y: playerPosRef.current.y - 40,
      });
      // ניגון סאונד "fire" רק במצב מחשב
      if (!isMobile) {
        const fireAudio = new Audio(fireSound);
        fireAudio.volume = 0.05;
        fireAudio.play();
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [gameStarted, paused, gameOver, isMobile, containerSize]);

  // Auto Pause: אם אין תנועת עכבר במשך 60 שניות
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStarted && !paused && Date.now() - lastMouseMoveRef.current >= 60000) {
        setPaused(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, paused]);

  // עצירת המשחק כאשר המשתמש עובר ללשונית אחרת
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPaused(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (((gameStarted || countdown !== null) && !paused && !gameOver)) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [gameStarted, countdown, paused, gameOver]);

  const lastTimeRefAnim = useRef(null);
  const animationFrameIdRef = useRef(null);
  const gameLoop = useCallback((time) => {
    if (((!gameStarted && countdown === null) || gameOver) || paused) {
      lastTimeRefAnim.current = null;
      return;
    }
    if (!lastTimeRefAnim.current) lastTimeRefAnim.current = time;
    const deltaTime = (time - lastTimeRefAnim.current) / 1000;
    lastTimeRefAnim.current = time;

    // עדכון כוכבים
    starsRef.current.forEach(star => {
      star.y += star.speed * deltaTime;
      if (star.y > containerSize.height + 100) {
        star.y = 0;
        star.x = Math.random() * containerSize.width;
      }
    });

    // עדכון כוכבי לכת
    activePlanetsRef.current = activePlanetsRef.current.map(planet => {
      planet.y += planet.speed * deltaTime;
      if (planet.y > containerSize.height + 100) {
        return getRandomPlanet(containerSize.width, containerSize.height);
      }
      return planet;
    });

    // עדכון מטאורים
    meteorsRef.current = meteorsRef.current.map(meteor => {
      meteor.y += meteor.speed * deltaTime;
      meteor.x += meteor.dx * deltaTime;
      return meteor;
    }).filter(meteor => meteor.y < containerSize.height + meteor.size + 100);

    // עדכון לבבות
    heartsRef.current = heartsRef.current.map(heart => {
      heart.y += heart.speed * deltaTime;
      return heart;
    }).filter(heart => heart.y < containerSize.height + heart.size + 100);

    // עדכון יריות החללית
    spellsRef.current = spellsRef.current
      .map(spell => ({ ...spell, y: spell.y - SPELL_SPEED * deltaTime }))
      .filter(spell => spell.y > -50);

    // עדכון אויבים וירי אויב
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

    // התנגשות קסמים עם אויבים
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
        const boomAudio = new Audio(enemyBoomSound);
        boomAudio.play();
        setScore(prev => prev + 1);
      }
      return !hit;
    });
    spellsRef.current = spellsRef.current.filter(spell => !collidedSpellIds.has(spell.id));

    // התנגשות קסמים עם מטאורים
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
        const boomAudio = new Audio(enemyBoomSound);
        boomAudio.play();
        return false;
      }
      return true;
    });

    // התנגשות יריות אויב עם החללית
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
          if (newLives <= 0 && !gameOver) {
            const superAudio = new Audio(superExplosionUserSound);
            superAudio.play();
            superAudio.addEventListener('ended', () => {
              setTimeout(() => {
                new Audio(gameOverSound).play();
              }, GAME_OVER_DELAY);
            });
            setGameOver(true);
          } else {
            const boomAudio = new Audio(userBoomSound);
            boomAudio.play();
          }
          return newLives;
        });
        invulnerableUntilRef.current = time + INVULNERABILITY_TIME;
      }
    }

    // התנגשות מטאורים עם החללית
    meteorsRef.current = meteorsRef.current.filter(meteor => {
      if (distance(meteor, playerPosRef.current) < 30) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0 && !gameOver) {
            const superAudio = new Audio(superExplosionUserSound);
            superAudio.play();
            superAudio.addEventListener('ended', () => {
              setTimeout(() => {
                new Audio(gameOverSound).play();
              }, GAME_OVER_DELAY);
            });
            setGameOver(true);
          } else {
            const boomAudio = new Audio(userBoomSound);
            boomAudio.play();
          }
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

    // התנגשות לבבות עם החללית
    heartsRef.current = heartsRef.current.filter(heart => {
      if (distance(heart, playerPosRef.current) < 20) {
        const heartAudio = new Audio(addHeartSound);
        heartAudio.play();
        setLives(prev => prev + 1);
        return false;
      }
      return true;
    });

    // התנגשות בין אויב לחללית
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
          if (newLives <= 0 && !gameOver) {
            const superAudio = new Audio(superExplosionUserSound);
            superAudio.play();
            superAudio.addEventListener('ended', () => {
              setTimeout(() => {
                new Audio(gameOverSound).play();
              }, GAME_OVER_DELAY);
            });
            setGameOver(true);
          } else {
            const boomAudio = new Audio(userBoomSound);
            boomAudio.play();
          }
          return newLives;
        });
        return false;
      }
      return true;
    });

    explosionsRef.current = explosionsRef.current.filter(exp => Date.now() - exp.start < 800);

    draw();
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  }, [containerSize, gameOver, gameStarted, paused, countdown, isMobile]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ציור כוכבים
    starsRef.current.forEach(star => {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור כוכבי לכת
    activePlanetsRef.current.forEach(planet => {
      if (planet.img.complete) {
        ctx.save();
        ctx.globalAlpha = planet.depth;
        ctx.drawImage(planet.img, planet.x, planet.y, planet.size, planet.size);
        ctx.restore();
      }
    });

    // ציור מטאורים
    meteorsRef.current.forEach(meteor => {
      ctx.save();
      ctx.translate(meteor.x + meteor.size / 2, meteor.y + meteor.size / 2);
      ctx.rotate(((meteor.rotation + METEOR_ROTATION_OFFSET) * Math.PI) / 180);
      if (meteorImgRef.current && meteorImgRef.current.complete) {
        ctx.drawImage(meteorImgRef.current, -meteor.size / 2, -meteor.size / 2, meteor.size, meteor.size);
      } else {
        ctx.fillStyle = "gray";
        ctx.fillRect(-meteor.size / 2, -meteor.size / 2, meteor.size, meteor.size);
      }
      ctx.restore();
    });

    // ציור לבבות
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    heartsRef.current.forEach(heart => {
      ctx.fillText("❤️", heart.x, heart.y);
    });

    // ציור יריות החללית
    spellsRef.current.forEach(spell => {
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור אויבים – העיצוב נלקח מהקוד שסיפקת (עיצוב עם גווני אדום-צהוב)
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

    // ציור יריות אויב
    enemyBulletsRef.current.forEach(bullet => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // ציור התפוצצויות
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

    // ציור החללית של השחקן
    if (spaceshipImgRef.current) {
      ctx.save();
      ctx.translate(playerPosRef.current.x, playerPosRef.current.y);
      if (isMobile) {
        // במצב מובייל – עיצוב החללית יהיה זהה לעיצוב האויב (גווני צהוב-אדום)
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
      } else {
        // במצב מחשב – העיצוב הקיים
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
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    if ((gameStarted || countdown !== null) && !gameOver && !paused) {
      lastTimeRefAnim.current = null;
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameStarted, gameOver, paused, gameLoop, countdown]);

  const startCountdown = () => {
    setCountdown(3);
    const takeoffAudio = new Audio(takeoffSound);
    takeoffAudio.play();
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        setGameStarted(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const startGame = () => {
    startCountdown();
  };

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
    lastTimeRefAnim.current = null;
    setGameStarted(false);
    startCountdown();
  };

  useEffect(() => {
    if (gameOver) {
      // אין צורך בפעולות נוספות בעת סיום המשחק.
    }
  }, [gameOver]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isMobile ? "h-full" : "h-[90vh]"} overflow-hidden select-none`}
      style={{
        background: 'radial-gradient(ellipse at center, #001f3f 0%, #004080 50%, #005f99 100%)',
        cursor: (((gameStarted || countdown !== null) && !paused && !gameOver) ? 'none' : 'default')
      }}
    >
      <canvas
        ref={canvasRef}
        width={containerSize.width}
        height={containerSize.height}
        className="w-full h-full"
      />
      {/* מסך התחלה */}
      {!gameStarted && countdown === null && !gameOver && (
        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${isMobile ? "text-center" : ""}`}>
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
      {/* ספירת האחור */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <h1
            className="text-8xl font-extrabold animate-bounce"
            style={{
              background: "linear-gradient(90deg, #3366ff, #3366cc)",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            {countdown}
          </h1>
        </div>
      )}
      {gameStarted && !gameOver && (
        <>
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${isMobile ? "px-4 py-2 rounded-xl border-2 border-blue-400 text-white font-extrabold text-2xl text-center" : "px-10 py-5 rounded-3xl bg-blue-900 bg-opacity-90 border-4 border-blue-400 text-white font-extrabold text-4xl shadow-2xl"}`}>
            Score: {score}
          </div>
          <div className="absolute top-4 left-4 z-50 text-4xl flex items-center" dir="ltr">
            <span className="mr-2 text-white font-bold">Lives:</span>
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i} style={{ marginRight: 5 }}>❤️</span>
            ))}
          </div>
          <div className="absolute top-4 right-4 z-50">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500"
              onClick={() => setPaused(true)}
            >
              <img src={pauseIcon} alt="Pause" className="w-8 h-8" />
            </button>
          </div>
        </>
      )}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="p-10 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #004080, #005f99)' }}>
            <h1 className="text-6xl text-white font-extrabold mb-6">Game Over</h1>
            <button
              className="px-6 py-3 text-2xl font-bold rounded bg-blue-400 hover:bg-blue-500 text-white"
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        </div>
      )}
      {paused && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="p-10 rounded-xl text-center bg-gradient-to-br from-blue-700 to-blue-500">
            <h1 className="text-6xl text-white font-extrabold mb-8">Paused</h1>
            <div className="flex flex-col gap-4 items-center">
              <button
                className="w-48 h-12 flex flex-row items-center justify-between px-4 rounded bg-blue-400 hover:bg-blue-500 text-white text-xl"
                onClick={() => setPaused(false)}
              >
                <img src={resumeIcon} alt="Resume" className="w-6 h-6" />
                <span>Resume</span>
              </button>
              <button
                className="w-48 h-12 flex flex-row items-center justify-between px-4 rounded bg-blue-400 hover:bg-blue-500 text-white text-xl"
                onClick={() => { restartGame(); setPaused(false); }}
              >
                <img src={restartIcon} alt="Restart" className="w-6 h-6" />
                <span>Restart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicGame;
