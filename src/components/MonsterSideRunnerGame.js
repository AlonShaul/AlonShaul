import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import monsterSprite from '../planets/monsterSprite.png';
import pauseIcon from '../planets/pause.png';
import resumeIcon from '../planets/Resume.png';
import restartIcon from '../planets/Restart.png';

// ייבוא תמונות
import obstacle1Img from '../planets/obstacle 1.png';
import obstacle2Img from '../planets/obstacle 2.png';
import cloud1 from '../planets/cloud1.png';
import cloud2 from '../planets/cloud2.png';
import cloud3 from '../planets/cloud3.png';
import eagleImage from '../planets/eagle.png';

// ייבוא קבצי צלילים
import damageSound1 from '../planets/GetDamage 1.mp3';
import damageSound2 from '../planets/GetDamage 2.mp3';
import damageSound3 from '../planets/GetDamage 3.mp3';
import lifeGainSoundFile from '../planets/AddHeart.mp3';
import gameOverSoundFile from '../planets/GameOver.mp3';
import jumpSoundFile from '../planets/Jump.mp3';
import coinSoundFile from '../planets/Coin.mp3';
import takeoffSoundFile from '../planets/Takeoff.mp3';

// מערך הצלילים לפגיעות – נעבור עליהם בסדר עוקב
const damageSoundFiles = [damageSound1, damageSound2, damageSound3];

const GRAVITY = 1500;
const JUMP_VELOCITY = -600;
const PLAYER_SPEED = 300;
const OBSTACLE_SPEED = 200;
const OBSTACLE_SPAWN_INTERVAL = 2000;
const COIN_SPAWN_INTERVAL = 3000;
const HEART_SPAWN_INTERVAL = 10000;
const EAGLE_SPAWN_INTERVAL = 10000;

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const GROUND_LEVEL = 500;

const DISTANCE_PER_SECOND = 0.05;

// פונקציה ליצירת מכשול – כעת עם בחירה אקראית בין שני סוגי מכשולים
const getRandomObstacle = (canvasWidth) => {
  const minSize = 40;
  const maxSize = 80;
  const size = minSize + Math.random() * (maxSize - minSize);
  const type = Math.random() < 0.5 ? 1 : 2; // 50% לכל סוג
  return {
    id: Date.now() + Math.random(),
    x: canvasWidth,
    y: GROUND_LEVEL - size,
    width: size,
    height: size,
    damageDone: false,
    type,
  };
};

const getRandomCoin = (canvasWidth) => {
  const size = 35;
  return {
    id: Date.now() + Math.random(),
    x: canvasWidth,
    y: GROUND_LEVEL - size - Math.random() * 150,
    size,
    collected: false,
  };
};

const getRandomHeart = (canvasWidth) => {
  const size = 35;
  return {
    id: Date.now() + Math.random(),
    x: canvasWidth,
    y: GROUND_LEVEL - size - Math.random() * 150,
    size,
    collected: false,
  };
};

const cloudImages = [cloud1, cloud2, cloud3];

const getRandomCloud = (canvasWidth, canvasHeight) => {
  const img = new Image();
  img.src = cloudImages[Math.floor(Math.random() * cloudImages.length)];
  const scale = 0.5 + Math.random() * 0.5;
  return {
    id: Date.now() + Math.random(),
    img,
    x: Math.random() * canvasWidth,
    y: Math.random() * (canvasHeight / 2),
    width: 200 * scale,
    height: 120 * scale,
    speed: 20 + Math.random() * 30,
  };
};

const getRandomEagle = (canvasWidth, canvasHeight) => {
  return {
    id: Date.now() + Math.random(),
    x: canvasWidth,
    baseY: Math.random() * (GROUND_LEVEL - 150) + 50,
    amplitude: 20 + Math.random() * 30,
    frequency: 2 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
    speed: 100 + Math.random() * 50,
    damageDone: false,
    width: 80,
    height: 50,
  };
};

const MonsterSideRunnerGame = () => {
  const { t } = useTranslation();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coinBags, setCoinBags] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // gameStarted יהיה true רק לאחר סיום ספירת האחור
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  // countdown יהיה פעיל בזמן ספירת האחור (גם בהפעלה ראשונית וגם בריסטרט)
  const [countdown, setCountdown] = useState(null);
  const [isMobile] = useState(window.innerWidth <= 768);
  const [canvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.9,
  });
  const { width, height } = canvasSize;

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const lastTimeRef = useRef(null);
  const elapsedTimeRef = useRef(0);

  const obstaclesRef = useRef([]);
  const coinsRef = useRef([]);
  const heartsRef = useRef([]);
  const eaglesRef = useRef([]);
  const cloudsRef = useRef([]);

  const monsterRef = useRef({
    x: 100,
    y: GROUND_LEVEL - PLAYER_HEIGHT,
    velocityY: 0,
    direction: 0,
    onGround: true,
    jumpCount: 0,
  });

  // ניהול אינדקס הצלילים לפגיעות
  const damageSoundIndexRef = useRef(0);

  // טעינת תמונת המפלצת
  const monsterImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = monsterSprite;
    monsterImgRef.current = img;
  }, []);

  // טעינת תמונות המכשולים – שני סוגים
  const obstacle1ImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = obstacle1Img;
    obstacle1ImgRef.current = img;
  }, []);

  const obstacle2ImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = obstacle2Img;
    obstacle2ImgRef.current = img;
  }, []);

  const eagleImgRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = eagleImage;
    eagleImgRef.current = img;
  }, []);

  // טעינת הצלילים לשאר האירועים
  const lifeGainSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const jumpSoundRef = useRef(null);
  const coinSoundRef = useRef(null);
  useEffect(() => {
    lifeGainSoundRef.current = new Audio(lifeGainSoundFile);
    gameOverSoundRef.current = new Audio(gameOverSoundFile);
    jumpSoundRef.current = new Audio(jumpSoundFile);
    coinSoundRef.current = new Audio(coinSoundFile);
  }, []);

  useEffect(() => {
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push(getRandomCloud(width, height));
    }
    cloudsRef.current = clouds;
  }, [width, height]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!(gameStarted || countdown !== null) || paused) return;
      if (e.code === "ArrowLeft") {
        monsterRef.current.direction = -1;
      }
      if (e.code === "ArrowRight") {
        monsterRef.current.direction = 1;
      }
      if (e.code === "Space") {
        if (monsterRef.current.jumpCount < 2) {
          monsterRef.current.velocityY = JUMP_VELOCITY;
          monsterRef.current.onGround = false;
          monsterRef.current.jumpCount += 1;
          if (jumpSoundRef.current) {
            jumpSoundRef.current.currentTime = 0;
            jumpSoundRef.current.play();
          }
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        monsterRef.current.direction = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, countdown, paused]);

  // הפעלות האינטרוולים (מכשולים, מטבעות, לבבות, נשרים) מופעלות רק לאחר שהמשחק התחיל (לא בזמן ספירת האחור)
  useEffect(() => {
    if (gameStarted && !paused && !gameOver) {
      const obstacleInterval = setInterval(() => {
        obstaclesRef.current.push(getRandomObstacle(width));
      }, OBSTACLE_SPAWN_INTERVAL);
      return () => clearInterval(obstacleInterval);
    }
  }, [gameStarted, paused, gameOver, width]);

  useEffect(() => {
    if (gameStarted && !paused && !gameOver) {
      const coinInterval = setInterval(() => {
        coinsRef.current.push(getRandomCoin(width));
      }, COIN_SPAWN_INTERVAL);
      return () => clearInterval(coinInterval);
    }
  }, [gameStarted, paused, gameOver, width]);

  useEffect(() => {
    if (gameStarted && !paused && !gameOver) {
      const heartInterval = setInterval(() => {
        heartsRef.current.push(getRandomHeart(width));
      }, HEART_SPAWN_INTERVAL);
      return () => clearInterval(heartInterval);
    }
  }, [gameStarted, paused, gameOver, width]);

  useEffect(() => {
    if (gameStarted && !paused && !gameOver) {
      const eagleInterval = setInterval(() => {
        if (elapsedTimeRef.current >= 15) {
          eaglesRef.current.push(getRandomEagle(width, height));
        }
      }, EAGLE_SPAWN_INTERVAL);
      return () => clearInterval(eagleInterval);
    }
  }, [gameStarted, paused, gameOver, width, height]);

  useEffect(() => {
    if (gameOver && gameOverSoundRef.current) {
      gameOverSoundRef.current.currentTime = 0;
      gameOverSoundRef.current.play();
    }
  }, [gameOver]);

  // הפעלת ה-gameLoop גם בזמן ספירת האחור (כאשר gameStarted עדיין false) וגם כאשר המשחק בפעולה
  const gameLoop = useCallback((time) => {
    if (!(gameStarted || countdown !== null) || paused) {
      lastTimeRef.current = null;
      return;
    }
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    elapsedTimeRef.current += deltaTime;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // ציור רקע המשחק
    ctx.fillStyle = "#a0d8f1";
    ctx.fillRect(0, 0, width, height);

    const sunX = 120, sunY = 120, sunRadius = 70;
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, "#fffec1");
    sunGradient.addColorStop(0.5, "#fff071");
    sunGradient.addColorStop(1, "rgba(255, 240, 113, 0)");
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    cloudsRef.current = cloudsRef.current.map(cloud => {
      cloud.x -= cloud.speed * deltaTime;
      if (cloud.x + cloud.width < 0) {
        return getRandomCloud(width, height);
      }
      return cloud;
    });
    cloudsRef.current.forEach(cloud => {
      if (cloud.img && cloud.img.complete) {
        ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
      }
    });

    ctx.fillStyle = "#6d4c41";
    ctx.fillRect(0, GROUND_LEVEL, width, height - GROUND_LEVEL);

    const monster = monsterRef.current;
    monster.x += monster.direction * PLAYER_SPEED * deltaTime;
    if (monster.x < 0) monster.x = 0;
    if (monster.x > width - PLAYER_WIDTH) monster.x = width - PLAYER_WIDTH;
    monster.velocityY += GRAVITY * deltaTime;
    monster.y += monster.velocityY * deltaTime;
    if (monster.y >= GROUND_LEVEL - PLAYER_HEIGHT) {
      monster.y = GROUND_LEVEL - PLAYER_HEIGHT;
      monster.velocityY = 0;
      monster.onGround = true;
      monster.jumpCount = 0;
    }

    if (monsterImgRef.current && monsterImgRef.current.complete) {
      ctx.drawImage(
        monsterImgRef.current,
        0, 0,
        monsterImgRef.current.width,
        monsterImgRef.current.height,
        monster.x,
        monster.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    } else {
      ctx.fillStyle = "blue";
      ctx.fillRect(monster.x, monster.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    }

    obstaclesRef.current = obstaclesRef.current
      .map(obstacle => {
        obstacle.x -= OBSTACLE_SPEED * deltaTime;
        return obstacle;
      })
      .filter(obstacle => obstacle.x + obstacle.width > 0);
    obstaclesRef.current.forEach(obstacle => {
      // בחירת תמונת מכשול בהתאם לסוג
      if (
        (obstacle.type === 1 && obstacle1ImgRef.current && obstacle1ImgRef.current.complete) ||
        (obstacle.type === 2 && obstacle2ImgRef.current && obstacle2ImgRef.current.complete)
      ) {
        const imgToUse = obstacle.type === 1 ? obstacle1ImgRef.current : obstacle2ImgRef.current;
        ctx.drawImage(imgToUse, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } else {
        ctx.fillStyle = "rgb(180,60,60)";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
      if (
        !obstacle.damageDone &&
        monster.x < obstacle.x + obstacle.width &&
        monster.x + PLAYER_WIDTH > obstacle.x &&
        monster.y < obstacle.y + obstacle.height &&
        monster.y + PLAYER_HEIGHT > obstacle.y
      ) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            const currentIndex = damageSoundIndexRef.current;
            const audio = new Audio(damageSoundFiles[currentIndex]);
            audio.currentTime = 0;
            audio.play();
            damageSoundIndexRef.current = (currentIndex + 1) % damageSoundFiles.length;
            audio.onended = () => {
              if (gameOverSoundRef.current) {
                gameOverSoundRef.current.currentTime = 0;
                gameOverSoundRef.current.play();
              }
              setGameOver(true);
            };
          } else {
            const currentIndex = damageSoundIndexRef.current;
            const audio = new Audio(damageSoundFiles[currentIndex]);
            audio.currentTime = 0;
            audio.play();
            damageSoundIndexRef.current = (currentIndex + 1) % damageSoundFiles.length;
          }
          return newLives;
        });
        obstacle.damageDone = true;
      }
    });

    coinsRef.current = coinsRef.current
      .map(coin => {
        coin.x -= OBSTACLE_SPEED * deltaTime;
        return coin;
      })
      .filter(coin => coin.x + coin.size > 0);
    coinsRef.current.forEach(coin => {
      ctx.font = "28px Arial";
      ctx.textAlign = "center";
      ctx.fillText("💰", coin.x + coin.size / 2, coin.y + coin.size / 2);
      if (
        monster.x < coin.x + coin.size &&
        monster.x + PLAYER_WIDTH > coin.x &&
        monster.y < coin.y + coin.size &&
        monster.y + PLAYER_HEIGHT > coin.y
      ) {
        setCoinBags(prev => prev + 1);
        coin.collected = true;
        if (coinSoundRef.current) {
          coinSoundRef.current.currentTime = 0;
          coinSoundRef.current.play();
        }
      }
    });
    coinsRef.current = coinsRef.current.filter(coin => !coin.collected);

    heartsRef.current = heartsRef.current
      .map(heart => {
        heart.x -= OBSTACLE_SPEED * deltaTime;
        return heart;
      })
      .filter(heart => heart.x + heart.size > 0);
    heartsRef.current.forEach(heart => {
      ctx.font = "28px Arial";
      ctx.textAlign = "center";
      ctx.fillText("❤️", heart.x + heart.size / 2, heart.y + heart.size / 2);
      if (
        monster.x < heart.x + heart.size &&
        monster.x + PLAYER_WIDTH > heart.x &&
        monster.y < heart.y + heart.size &&
        monster.y + PLAYER_HEIGHT > heart.y
      ) {
        setLives(prev => prev + 1);
        heart.collected = true;
        if (lifeGainSoundRef.current) {
          lifeGainSoundRef.current.currentTime = 0;
          lifeGainSoundRef.current.play();
        }
      }
    });
    heartsRef.current = heartsRef.current.filter(heart => !heart.collected);

    eaglesRef.current = eaglesRef.current
      .map(eagle => {
        eagle.x -= eagle.speed * deltaTime;
        eagle.y = eagle.baseY + eagle.amplitude * Math.sin(eagle.frequency * elapsedTimeRef.current + eagle.phase);
        return eagle;
      })
      .filter(eagle => eagle.x + eagle.width > 0);
    eaglesRef.current.forEach(eagle => {
      if (eagleImgRef.current && eagleImgRef.current.complete) {
        ctx.drawImage(eagleImgRef.current, eagle.x, eagle.y, eagle.width, eagle.height);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(eagle.x, eagle.y, eagle.width, eagle.height);
      }
      if (
        !eagle.damageDone &&
        monster.x < eagle.x + eagle.width &&
        monster.x + PLAYER_WIDTH > eagle.x &&
        monster.y < eagle.y + eagle.height &&
        monster.y + PLAYER_HEIGHT > eagle.y
      ) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            const currentIndex = damageSoundIndexRef.current;
            const audio = new Audio(damageSoundFiles[currentIndex]);
            audio.currentTime = 0;
            audio.play();
            damageSoundIndexRef.current = (currentIndex + 1) % damageSoundFiles.length;
            audio.onended = () => {
              if (gameOverSoundRef.current) {
                gameOverSoundRef.current.currentTime = 0;
                gameOverSoundRef.current.play();
              }
              setGameOver(true);
            };
          } else {
            const currentIndex = damageSoundIndexRef.current;
            const audio = new Audio(damageSoundFiles[currentIndex]);
            audio.currentTime = 0;
            audio.play();
            damageSoundIndexRef.current = (currentIndex + 1) % damageSoundFiles.length;
          }
          return newLives;
        });
        eagle.damageDone = true;
      }
    });

    setScore(prev => prev + deltaTime * DISTANCE_PER_SECOND);

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, countdown, paused, width, height]);

  useEffect(() => {
    if ((gameStarted || countdown !== null) && !paused && !gameOver) {
      lastTimeRef.current = null;
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [gameStarted, countdown, paused, gameOver, gameLoop]);

  // הפעלת ספירת האחור – במהלך הספירה הקנבס מוצג עם אפקט כהות,
  // ולאחריה (כשמסיימים את הספירה) מוגדר gameStarted ל־true
  const startCountdown = () => {
    setCountdown(3);
    const takeoffAudio = new Audio(takeoffSoundFile);
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

  // במסך הפתיחה הראשוני, נרצה לשמור את העיצוב המקורי (עם רקע תכלת)
  // ולכן startGame פשוט מפעיל את הספירה (שהקנבס יהיה מוצג עם אפקט כהות)
  const startGame = () => {
    startCountdown();
  };

  // גם בעת Restart מופעלת ספירת האחור מחדש
  const restartGame = () => {
    setScore(0);
    setLives(3);
    setCoinBags(0);
    obstaclesRef.current = [];
    coinsRef.current = [];
    heartsRef.current = [];
    eaglesRef.current = [];
    monsterRef.current = {
      x: 100,
      y: GROUND_LEVEL - PLAYER_HEIGHT,
      velocityY: 0,
      direction: 0,
      onGround: true,
      jumpCount: 0,
    };
    elapsedTimeRef.current = 0;
    setGameOver(false);
    setGameStarted(false);
    startCountdown();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isMobile ? "h-full" : "h-[90vh]"} overflow-hidden select-none`}
      style={{
        cursor: (gameStarted && !paused && !gameOver) ? "none" : "default",
        background: "#a0d8f1",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
        // אם יש ספירה – הקנבס מוצג עם אפקט כהות (מציג את רקע המשחק)
        style={{ filter: countdown !== null ? "brightness(50%)" : "none" }}
      />
      {/* מסך פתיחה – מופיע רק כאשר gameStarted ו-countdown שניהם false/null */}
      {(!gameStarted && !gameOver && countdown === null) && (
        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${isMobile ? "text-center" : ""} bg-gradient-to-br from-blue-800 to-blue-600`}>
          <h1 className="text-6xl text-white font-extrabold mb-6">
            {t("monsterRunner_startPrompt_title", "המפלצת יוצאת לדרך!")}
          </h1>
          <p className="text-2xl text-white mb-10">
            {t("monsterRunner_startPrompt_text", 'לחץ על "התחל" ותתחיל את מסע ההרס של המפלצת!')}
          </p>
          <button
            className="px-6 py-3 text-2xl font-bold rounded bg-blue-400 text-white hover:bg-blue-500"
            onClick={startGame}
          >
            {t("monsterRunner_startPrompt_button", "התחל")}
          </button>
        </div>
      )}
      {/* במצב ספירת האחור – מוצגת אנימציית הספירה מעל קנבס המשחק */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <h1
            className="text-8xl font-extrabold animate-bounce"
            style={{
              background: "linear-gradient(90deg, #0000ff, #0000aa)",
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
            Distance: {score.toFixed(2)} km
          </div>
          <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
            <div className="text-4xl flex items-center" dir="ltr">
              <span className="mr-2 text-white font-bold">Lives:</span>
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i} style={{ marginRight: 5 }}>❤️</span>
              ))}
            </div>
            <div className="text-4xl flex items-center" dir="ltr">
              <span className="mr-2 text-white font-bold">Bags:</span>
              <span className="mr-1">💰</span>
              <span className="text-white">{coinBags}</span>
            </div>
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
      {paused && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="p-10 rounded-xl text-center bg-gradient-to-br from-blue-800 to-blue-600">
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
                onClick={() => {
                  restartGame();
                  setPaused(false);
                }}
              >
                <img src={restartIcon} alt="Restart" className="w-6 h-6" />
                <span>Restart</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="p-10 rounded-xl text-center" style={{ background: "linear-gradient(135deg, #002233, #00334e)" }}>
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
    </div>
  );
};

export default MonsterSideRunnerGame;
