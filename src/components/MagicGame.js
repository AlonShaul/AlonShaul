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

// משתנה שמאפשר להוסיף סיבוב נוסף למטאור (במעלות)
const METEOR_ROTATION_OFFSET = -45;

// משתנה שמגדיר את הדילאיי (במילישניות) בין סיום סאונד הפיצוץ לסאונד GameOver
const GAME_OVER_DELAY = 20;

// פונקציה לחישוב מרחק בין שתי נקודות
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

// פונקציה לבחירת כוכב לכת אקראי, תוך התעלמות מכוכבים שכבר מופיעים
const getUniqueRandomPlanet = (containerWidth, containerHeight, excludedNames = []) => {
  const availablePlanets = planetData.filter(planet => !excludedNames.includes(planet.name));
  const chosenPlanet = availablePlanets.length > 0 
    ? availablePlanets[Math.floor(Math.random() * availablePlanets.length)]
    : planetData[Math.floor(Math.random() * planetData.length)];
  const size = 40;
  const img = new Image();
  img.src = chosenPlanet.src;
  const depth = 0.5 + Math.random() * 0.5;
  return {
    name: chosenPlanet.name,
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
  
  // זיהוי מצב נייד לפי רוחב החלון
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // שימוש ב־ref עבור isMobile כדי למנוע הכללה במערך התלויות של useCallback
  const isMobileRef = useRef(isMobile);
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerWidth <= 768 ? window.innerHeight * 0.9 : window.innerHeight * 0.9,
  });

  // Refs עבור אלמנטים ומשתנים במשחק
  const spellsRef = useRef([]);
  const enemiesRef = useRef([]);
  const enemyBulletsRef = useRef([]);
  const explosionsRef = useRef([]);
  const starsRef = useRef([]);
  const activePlanetsRef = useRef([]);
  const meteorsRef = useRef([]);
  const heartsRef = useRef([]);
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // בריכת סאונד לשיפור ביצועים במצב נייד
  const preloadedSoundPoolRef = useRef(null);
  const SOUND_POOL_SIZE = 3;
  useEffect(() => {
    if (isMobile) {
      preloadedSoundPoolRef.current = {
        fire: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(fireSound)),
        enemyBoom: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(enemyBoomSound)),
        userBoom: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(userBoomSound)),
        addHeart: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(addHeartSound)),
        superExplosion: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(superExplosionUserSound)),
        gameOver: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(gameOverSound)),
        takeoff: Array.from({ length: SOUND_POOL_SIZE }, () => new Audio(takeoffSound)),
      };
    }
  }, [isMobile]);

  // פונקציה להפעלת סאונד – המשתמשת בבריכת הסאונד במצב נייד
  const playSound = useCallback((soundKey) => {
    if (isMobileRef.current && preloadedSoundPoolRef.current && preloadedSoundPoolRef.current[soundKey]) {
      const pool = preloadedSoundPoolRef.current[soundKey];
      const soundInstance = pool.find(audio => audio.paused) || pool[0];
      soundInstance.currentTime = 0;
      soundInstance.play();
    } else {
      let src;
      switch(soundKey) {
        case 'fire': src = fireSound; break;
        case 'enemyBoom': src = enemyBoomSound; break;
        case 'userBoom': src = userBoomSound; break;
        case 'addHeart': src = addHeartSound; break;
        case 'superExplosion': src = superExplosionUserSound; break;
        case 'gameOver': src = gameOverSound; break;
        case 'takeoff': src = takeoffSound; break;
        default: return;
      }
      const audio = new Audio(src);
      audio.play();
    }
  }, []); // לא כוללים isMobile בזכות השימוש ב-isMobileRef

  const meteorImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = require('../planets/meteor.png');
    meteorImgRef.current = img;
  }, []);

  const invulnerableUntilRef = useRef(0);
  const playerPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 100 });

  const spaceshipImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = spaceship;
    spaceshipImgRef.current = img;
  }, []);

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

  useEffect(() => {
    activePlanetsRef.current = [
      getUniqueRandomPlanet(containerSize.width, containerSize.height, []),
      getUniqueRandomPlanet(containerSize.width, containerSize.height, [activePlanetsRef.current[0]?.name]),
      getUniqueRandomPlanet(containerSize.width, containerSize.height, activePlanetsRef.current.slice(0,1).map(p => p.name))
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
      playSound('fire');
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [gameStarted, paused, gameOver, isMobile, containerSize, playSound]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStarted && !paused && Date.now() - lastMouseMoveRef.current >= 60000) {
        setPaused(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, paused]);

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

    starsRef.current.forEach(star => {
      star.y += star.speed * deltaTime;
      if (star.y > containerSize.height + 100) {
        star.y = 0;
        star.x = Math.random() * containerSize.width;
      }
    });

    activePlanetsRef.current = activePlanetsRef.current.map((planet, index, arr) => {
      if (planet.y > containerSize.height + 100) {
        const otherPlanets = arr.filter((_, i) => i !== index).map(p => p.name);
        return getUniqueRandomPlanet(containerSize.width, containerSize.height, otherPlanets);
      }
      return planet;
    });
    activePlanetsRef.current.forEach(planet => {
      planet.y += planet.speed * deltaTime;
    });

    meteorsRef.current = meteorsRef.current.map(meteor => {
      meteor.y += meteor.speed * deltaTime;
      meteor.x += meteor.dx * deltaTime;
      return meteor;
    }).filter(meteor => meteor.y < containerSize.height + meteor.size + 100);

    heartsRef.current = heartsRef.current.map(heart => {
      heart.y += heart.speed * deltaTime;
      return heart;
    }).filter(heart => heart.y < containerSize.height + heart.size + 100);

    spellsRef.current = spellsRef.current
      .map(spell => ({ ...spell, y: spell.y - SPELL_SPEED * deltaTime }))
      .filter(spell => spell.y > -50);

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
        playSound('enemyBoom');
        setScore(prev => prev + 1);
      }
      return !hit;
    });
    spellsRef.current = spellsRef.current.filter(spell => !collidedSpellIds.has(spell.id));

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
        playSound('enemyBoom');
        return false;
      }
      return true;
    });

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
            playSound('superExplosion');
            setTimeout(() => {
              playSound('gameOver');
            }, GAME_OVER_DELAY);
            setGameOver(true);
          } else {
            playSound('userBoom');
          }
          return newLives;
        });
        invulnerableUntilRef.current = time + INVULNERABILITY_TIME;
      }
    }

    meteorsRef.current = meteorsRef.current.filter(meteor => {
      if (distance(meteor, playerPosRef.current) < 30) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0 && !gameOver) {
            playSound('superExplosion');
            setTimeout(() => {
              playSound('gameOver');
            }, GAME_OVER_DELAY);
            setGameOver(true);
          } else {
            playSound('userBoom');
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

    heartsRef.current = heartsRef.current.filter(heart => {
      if (distance(heart, playerPosRef.current) < 20) {
        playSound('addHeart');
        setLives(prev => prev + 1);
        return false;
      }
      return true;
    });

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
            playSound('superExplosion');
            setTimeout(() => {
              playSound('gameOver');
            }, GAME_OVER_DELAY);
            setGameOver(true);
          } else {
            playSound('userBoom');
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
  }, [containerSize, gameOver, gameStarted, paused, countdown, playSound]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    starsRef.current.forEach(star => {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    activePlanetsRef.current.forEach(planet => {
      if (planet.img.complete) {
        ctx.save();
        ctx.globalAlpha = planet.depth;
        ctx.drawImage(planet.img, planet.x, planet.y, planet.size, planet.size);
        ctx.restore();
      }
    });

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

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    heartsRef.current.forEach(heart => {
      ctx.fillText("❤️", heart.x, heart.y);
    });

    spellsRef.current.forEach(spell => {
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

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

    enemyBulletsRef.current.forEach(bullet => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

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
    playSound('takeoff');
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
      // אין צורך בפעולות נוספות כאן.
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
