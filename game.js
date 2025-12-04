

const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let gameState = {
  running: false,
  score: 0,
  speed: 3,
  playerX: 2, 
  obstacles: [],
  roads: [],
  frame: 0,
  gameOver: false
};

const CAR_WIDTH = 40;
const CAR_HEIGHT = 60;
const ROAD_WIDTH = 400;
const ROAD_X = (760 - ROAD_WIDTH) / 2;
const LANES = [
  ROAD_X + 50,
  ROAD_X + 150,
  ROAD_X + 250,
  ROAD_X + 350
];

function initRoads() {
  gameState.roads = [];
  for (let i = -100; i < 500; i += 40) {
    gameState.roads.push({ y: i });
  }
}

function createObstacle() {
  const types = [
    { name: 'cono', color: '#ff6b00', width: 30, height: 30, points: 5 },
    { name: 'barril', color: '#ff0000', width: 35, height: 40, points: 10 },
    { name: 'auto', color: '#3b82f6', width: 40, height: 60, points: 20 }
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const lane = Math.floor(Math.random() * 4);

  return {
    lane: lane,
    x: LANES[lane],
    y: -50,
    width: type.width,
    height: type.height,
    color: type.color,
    type: type.name,
    points: type.points
  };
}

function drawRoad() {
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, 760, 400);

  ctx.fillStyle = '#7cb342';
  ctx.fillRect(0, 0, ROAD_X, 400);
  ctx.fillRect(ROAD_X + ROAD_WIDTH, 0, 760 - (ROAD_X + ROAD_WIDTH), 400);

  ctx.fillStyle = '#404040';
  ctx.fillRect(ROAD_X, 0, ROAD_WIDTH, 400);

  ctx.fillStyle = '#ffffff';
  gameState.roads.forEach(road => {
    ctx.fillRect(ROAD_X + 10, road.y, 5, 30);
    ctx.fillRect(ROAD_X + ROAD_WIDTH - 15, road.y, 5, 30);
    
    ctx.fillRect(ROAD_X + 133, road.y, 4, 25);
    ctx.fillRect(ROAD_X + 267, road.y, 4, 25);
  });
}

function drawPlayer() {
  const x = LANES[gameState.playerX] - CAR_WIDTH / 2;
  const y = 300;

  ctx.fillStyle = '#10b981';
  ctx.fillRect(x, y, CAR_WIDTH, CAR_HEIGHT);

  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(x + 5, y + 5, 30, 15);
  ctx.fillRect(x + 5, y + 40, 30, 15);

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 2, y + CAR_HEIGHT - 5, 8, 5);
  ctx.fillRect(x + CAR_WIDTH - 10, y + CAR_HEIGHT - 5, 8, 5);

  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, CAR_WIDTH, CAR_HEIGHT);
}

function drawObstacle(obs) {
  ctx.fillStyle = obs.color;
  
  if (obs.type === 'cono') {
    ctx.beginPath();
    ctx.moveTo(obs.x + obs.width / 2, obs.y);
    ctx.lineTo(obs.x, obs.y + obs.height);
    ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(obs.x + 5, obs.y + obs.height - 10, obs.width - 10, 5);
  } else if (obs.type === 'barril') {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(obs.x, obs.y + obs.height / 2 - 2, obs.width, 4);
  } else {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, 15);
    ctx.fillRect(obs.x + 5, obs.y + obs.height - 20, obs.width - 10, 15);
  }
}

function drawHUD() {
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.fillRect(10, 10, 200, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText(`Puntuación: ${gameState.score}`, 20, 35);
  ctx.fillText(`Velocidad: ${gameState.speed.toFixed(1)}`, 20, 60);
  
  const speedPercent = (gameState.speed - 2) / 6;
  if (speedPercent < 0.3) {
    ctx.fillStyle = '#22c55e';
  } else if (speedPercent < 0.7) {
    ctx.fillStyle = '#fbbf24';
  } else {
    ctx.fillStyle = '#ef4444';
  }
  ctx.fillRect(20, 70, speedPercent * 180, 10);
}

function checkCollision(obs) {
  const playerY = 300;
  
  if (obs.lane === gameState.playerX) {
    return (
      obs.y + obs.height > playerY &&
      obs.y < playerY + CAR_HEIGHT
    );
  }
  
  return false;
}

function updateGame() {
  if (!gameState.running || gameState.gameOver) return;

  gameState.frame++;

  gameState.roads.forEach(road => {
    road.y += gameState.speed;
    if (road.y > 420) {
      road.y = -40;
    }
  });

  if (gameState.frame % Math.max(60 - Math.floor(gameState.score / 50), 30) === 0) {
    gameState.obstacles.push(createObstacle());
  }

  gameState.obstacles = gameState.obstacles.filter(obs => {
    obs.y += gameState.speed;

    if (checkCollision(obs)) {
      endGame();
      return false;
    }

    if (obs.y > 380 && !obs.scored) {
      gameState.score += obs.points;
      obs.scored = true;
    }

    return obs.y < 450;
  });

  if (gameState.frame % 300 === 0 && gameState.speed < 8) {
    gameState.speed += 0.2;
  }
}

function drawGame() {
  if (!ctx) return;

  drawRoad();
  gameState.obstacles.forEach(drawObstacle);
  drawPlayer();
  drawHUD();

  if (gameState.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 760, 400);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡JUEGO TERMINADO!', 380, 150);

    ctx.font = 'bold 28px Arial';
    ctx.fillText(`Puntuación Final: ${gameState.score}`, 380, 200);

    ctx.font = '18px Arial';
    ctx.fillText('Presiona "Iniciar Juego" para volver a intentar', 380, 250);
    ctx.textAlign = 'left';
  }
}

function gameLoop() {
  updateGame();
  drawGame();

  if (gameState.running) {
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameState.gameOver = true;
  gameState.running = false;

  const playerName = document.getElementById('gamePlayerName').value.trim();
  
  if (playerName) {
    saveToGameRanking({
      name: playerName,
      doc: '',
      type: 'Juego',
      score: gameState.score,
      date: new Date().toISOString()
    });

    if (typeof loadRank === 'function') {
      loadRank();
    }
  }

  updateGameStatus('⛔ Colisión! Puntuación: ' + gameState.score);
  updateGameScore(gameState.score);
}

function saveToGameRanking(entry) {
  let rank = JSON.parse(localStorage.getItem('boshRank') || '[]');
  rank.push(entry);
  localStorage.setItem('boshRank', JSON.stringify(rank));
}

function updateGameStatus(text) {
  const statusEl = document.getElementById('gameStatus');
  if (statusEl) {
    statusEl.textContent = 'Estado: ' + text;
  }
}

function updateGameScore(score) {
  const scoreEl = document.getElementById('gameScore');
  if (scoreEl) {
    scoreEl.textContent = 'Puntuación: ' + score;
  }
}

function startGame() {
  const playerName = document.getElementById('gamePlayerName').value.trim();
  
  if (!playerName) {
    alert('⚠️ Por favor ingresa tu nombre para jugar');
    return;
  }

  gameState = {
    running: true,
    score: 0,
    speed: 3,
    playerX: 2, 
    obstacles: [],
    roads: [],
    frame: 0,
    gameOver: false
  };

  initRoads();
  updateGameStatus('🚗 En curso...');
  updateGameScore(0);
  
  gameLoop();
}

document.addEventListener('keydown', function(e) {
  if (!gameState.running || gameState.gameOver) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (gameState.playerX > 0) {
      gameState.playerX--;
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (gameState.playerX < 3) {
      gameState.playerX++;
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startGame');
  
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  if (ctx) {
    drawRoad();
    drawPlayer();
    
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(100, 120, 560, 160);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎮 SIMULADOR DE RUTA SEGURA', 380, 160);
    
    ctx.font = '18px Arial';
    ctx.fillText('Usa ← y → para cambiar de carril', 380, 200);
    ctx.fillText('Evita obstáculos y mantén una conducción segura', 380, 230);
    ctx.fillText('¡Ingresa tu nombre y presiona "Iniciar Juego"!', 380, 260);
    ctx.textAlign = 'left';
  }
});