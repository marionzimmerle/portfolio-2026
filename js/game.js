/* =========================================================================
   game.js — portfolio mini-games (Games launcher + Snake + Cat Runner)
   ========================================================================= */

const PortfolioGames = (() => {
  const instances = new Map();

  function t(text) {
    return window.PortfolioI18n?.t?.(text) || text;
  }

  function currentLanguage() {
    return window.PortfolioI18n?.getLanguage?.() || "en";
  }

  function create(windowEl) {
    const root = windowEl.querySelector("[data-games]");
    if (!root) return null;

    const launcher = root.querySelector("[data-games-launcher]");
    const launchButtons = Array.from(root.querySelectorAll("[data-launch-game]"));
    const backButtons = Array.from(root.querySelectorAll("[data-games-back]"));
    const panels = {
      snake: root.querySelector('[data-game-panel="snake"]'),
      runner: root.querySelector('[data-game-panel="runner"]'),
      breakout: root.querySelector('[data-game-panel="breakout"]'),
      "2048": root.querySelector('[data-game-panel="2048"]')
    };

    const snake = createSnake(root.querySelector("[data-snake-game]"));
    const runner = createRunner(root.querySelector("[data-runner-game]"));
    const breakout = createBreakout(root.querySelector("[data-breakout-game]"));
    const game2048 = create2048(root.querySelector("[data-2048-game]"));
    let active = null;

    function showLauncher() {
      active = null;
      launcher.hidden = false;
      Object.values(panels).forEach((panel) => {
        if (panel) panel.hidden = true;
      });
      snake?.setActive(false);
      runner?.setActive(false);
      breakout?.setActive(false);
      game2048?.setActive(false);
      snake?.pause();
      runner?.pause();
      breakout?.pause();
      game2048?.pause();
    }

    function launch(id) {
      active = id;
      launcher.hidden = true;

      Object.entries(panels).forEach(([panelId, panel]) => {
        panel.hidden = panelId !== id;
      });

      snake?.setActive(id === "snake");
      runner?.setActive(id === "runner");
      breakout?.setActive(id === "breakout");
      game2048?.setActive(id === "2048");

      if (id === "snake") snake?.prepare();
      if (id === "runner") runner?.prepare();
      if (id === "breakout") breakout?.prepare();
      if (id === "2048") game2048?.prepare();
    }

    function onKey(event) {
      if (active === "snake") snake?.onKey(event);
      if (active === "runner") runner?.onKey(event);
      if (active === "breakout") breakout?.onKey(event);
      if (active === "2048") game2048?.onKey(event);
    }

    function onLanguageChange() {
      snake?.refreshText();
      runner?.refreshText();
      breakout?.refreshText();
      game2048?.refreshText();
    }

    launchButtons.forEach((button) => {
      button.addEventListener("click", () => launch(button.dataset.launchGame));
    });

    backButtons.forEach((button) => {
      button.addEventListener("click", showLauncher);
    });

    document.addEventListener("keydown", onKey);
    document.addEventListener("portfolio:language-changed", onLanguageChange);

    showLauncher();

    return {
      destroy() {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("portfolio:language-changed", onLanguageChange);
        snake?.destroy();
        runner?.destroy();
        breakout?.destroy();
        game2048?.destroy();
      }
    };
  }

  function createSnake(root) {
    if (!root) return null;

    const canvas = root.querySelector("[data-snake-canvas]");
    const ctx = canvas.getContext("2d");
    const scoreEl = root.querySelector("[data-snake-score]");
    const bestEl = root.querySelector("[data-snake-best]");
    const messageEl = root.querySelector("[data-snake-message]");
    const restartBtn = root.querySelector("[data-snake-restart]");
    const directionButtons = Array.from(root.querySelectorAll("[data-snake-direction]"));

    const CELL = 16;
    const SIZE = 20;
    const START_SPEED = 190;
    const MIN_SPEED = 75;
    const SPEED_STEP = 8;
    const BEST_KEY = "portfolio.snakeBest.v2";

    let snake = [];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let food = { x: 5, y: 5 };
    let score = 0;
    let best = Number(localStorage.getItem(BEST_KEY)) || 0;
    let timer = null;
    let started = false;
    let ended = false;
    let speed = START_SPEED;
    let active = false;

    bestEl.textContent = best;

    function randomFood() {
      let candidate;
      do {
        candidate = {
          x: Math.floor(Math.random() * SIZE),
          y: Math.floor(Math.random() * SIZE)
        };
      } while (snake.some((part) => part.x === candidate.x && part.y === candidate.y));
      return candidate;
    }

    function reset() {
      clearTimeout(timer);
      snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      direction = { x: 1, y: 0 };
      nextDirection = { x: 1, y: 0 };
      food = randomFood();
      score = 0;
      speed = START_SPEED;
      started = false;
      ended = false;
      scoreEl.textContent = "0";
      messageEl.innerHTML = `<strong>SNAKE</strong><span>${t("Use the arrow keys or WASD to play")}</span>`;
      messageEl.classList.remove("is-hidden");
      draw();
    }

    function prepare() {
      if (!started && !ended) draw();
    }

    function pause() {
      clearTimeout(timer);
      timer = null;
      if (started && !ended) {
        started = false;
        messageEl.innerHTML = `<strong>SNAKE</strong><span>${t("Use the arrow keys or WASD to play")}</span>`;
        messageEl.classList.remove("is-hidden");
      }
    }

    function start() {
      if (!active) return;
      if (ended) reset();
      if (started) return;
      started = true;
      messageEl.classList.add("is-hidden");
      timer = setTimeout(step, speed);
    }

    function setDirection(name) {
      const dirs = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };
      const candidate = dirs[name];
      if (!candidate) return;
      if (candidate.x === -direction.x && candidate.y === -direction.y) return;
      nextDirection = candidate;
      start();
    }

    function step() {
      direction = nextDirection;
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      const hitWall = head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE;
      const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

      if (hitWall || hitSelf) {
        gameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = String(score);

        if (score > best) {
          best = score;
          bestEl.textContent = String(best);
          localStorage.setItem(BEST_KEY, String(best));
        }

        speed = Math.max(MIN_SPEED, speed - SPEED_STEP);
        food = randomFood();
      } else {
        snake.pop();
      }

      draw();
      if (!ended && active) timer = setTimeout(step, speed);
    }

    function gameOver() {
      clearTimeout(timer);
      timer = null;
      ended = true;
      const over = t("GAME OVER");
      const text = currentLanguage() === "fr"
        ? `Score : ${score} — cliquez sur Recommencer`
        : `Score: ${score} — click Restart`;
      messageEl.innerHTML = `<strong>${over}</strong><span>${text}</span>`;
      messageEl.classList.remove("is-hidden");
    }

    function drawPixelApple(x, y) {
      const pixels = [
        [1,0],[2,0],
        [0,1],[1,1],[2,1],[3,1],
        [0,2],[1,2],[2,2],[3,2],
        [1,3],[2,3]
      ];
      ctx.fillStyle = "#D9616D";
      pixels.forEach(([dx, dy]) => ctx.fillRect(x + dx * 3, y + dy * 3, 3, 3));
      ctx.fillStyle = "#5cb05a";
      ctx.fillRect(x + 6, y - 2, 3, 3);
      ctx.fillRect(x + 9, y - 2, 3, 3);
    }

    function drawSnakeHead(part) {
      const x = part.x * CELL + 1;
      const y = part.y * CELL + 1;

      ctx.fillStyle = "#E6D2B4";
      ctx.fillRect(x, y, CELL - 2, CELL - 2);

      ctx.fillStyle = "#1d3042";
      if (direction.x === 1) {
        ctx.fillRect(x + 10, y + 4, 2, 2);
        ctx.fillRect(x + 10, y + 9, 2, 2);
      } else if (direction.x === -1) {
        ctx.fillRect(x + 2, y + 4, 2, 2);
        ctx.fillRect(x + 2, y + 9, 2, 2);
      } else if (direction.y === -1) {
        ctx.fillRect(x + 4, y + 2, 2, 2);
        ctx.fillRect(x + 9, y + 2, 2, 2);
      } else {
        ctx.fillRect(x + 4, y + 10, 2, 2);
        ctx.fillRect(x + 9, y + 10, 2, 2);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f1823";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= SIZE; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(canvas.width, i * CELL);
        ctx.stroke();
      }

      drawPixelApple(food.x * CELL + 2, food.y * CELL + 3);

      snake.forEach((part, index) => {
        if (index === 0) {
          drawSnakeHead(part);
          return;
        }

        const x = part.x * CELL + 1;
        const y = part.y * CELL + 1;
        ctx.fillStyle = "#9BE8D2";
        ctx.fillRect(x, y, CELL - 2, CELL - 2);
      });
    }

    function onKey(event) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const map = {
        ArrowUp: "up",
        z: "up",
        w: "up",
        ArrowDown: "down",
        s: "down",
        ArrowLeft: "left",
        q: "left",
        a: "left",
        ArrowRight: "right",
        d: "right"
      };
      const name = map[key];
      if (!name || !active) return;
      event.preventDefault();
      setDirection(name);
    }

    function refreshText() {
      if (!started || ended) {
        if (ended) {
          gameOver();
        } else {
          messageEl.innerHTML = `<strong>SNAKE</strong><span>${t("Use the arrow keys or WASD to play")}</span>`;
        }
      }
    }

    function setActive(isActive) {
      active = isActive;
    }

    restartBtn.addEventListener("click", reset);
    directionButtons.forEach((button) => {
      button.addEventListener("click", () => setDirection(button.dataset.snakeDirection));
    });

    reset();

    return {
      onKey,
      refreshText,
      setActive,
      prepare,
      pause,
      destroy() {
        clearTimeout(timer);
      }
    };
  }

  function createRunner(root) {
    if (!root) return null;

    const canvas = root.querySelector("[data-runner-canvas]");
    const ctx = canvas.getContext("2d");
    const scoreEl = root.querySelector("[data-runner-score]");
    const bestEl = root.querySelector("[data-runner-best]");
    const messageEl = root.querySelector("[data-runner-message]");
    const restartBtn = root.querySelector("[data-runner-restart]");
    const jumpBtn = root.querySelector("[data-runner-jump]");

    const BEST_KEY = "portfolio.runnerBest.v2";
    const GROUND_Y = 198;

    // Deliberately gentle start. Speed increases only after obstacles are passed.
    const START_SPEED = 2.45;
    const MAX_SPEED = 6.65;
    const SPEED_GAIN_PER_OBSTACLE = 0.22;

    let best = Number(localStorage.getItem(BEST_KEY)) || 0;
    bestEl.textContent = best;

    let active = false;
    let raf = null;
    let lastTime = 0;
    let started = false;
    let ended = false;
    let speed = START_SPEED;
    let score = 0;
    let obstaclesPassed = 0;
    let spawnTimer = 0;
    let obstacles = [];
    let cat = { x: 48, y: GROUND_Y - 28, w: 26, h: 24, vy: 0, onGround: true };

    function reset() {
      cancelAnimationFrame(raf);
      raf = null;
      lastTime = 0;
      started = false;
      ended = false;
      speed = START_SPEED;
      score = 0;
      obstaclesPassed = 0;
      spawnTimer = 1150;
      obstacles = [];
      cat = { x: 48, y: GROUND_Y - 28, w: 26, h: 24, vy: 0, onGround: true };
      scoreEl.textContent = "0";
      messageEl.innerHTML = `<strong>CAT RUNNER</strong><span>${t("Press Space, ↑, or click to jump")}</span>`;
      messageEl.classList.remove("is-hidden");
      draw();
    }

    function prepare() {
      if (!started && !ended) draw();
    }

    function pause() {
      cancelAnimationFrame(raf);
      raf = null;
      if (started && !ended) {
        started = false;
        messageEl.innerHTML = `<strong>CAT RUNNER</strong><span>${t("Press Space, ↑, or click to jump")}</span>`;
        messageEl.classList.remove("is-hidden");
      }
    }

    function start() {
      if (!active) return;
      if (ended) reset();
      if (started) return;
      started = true;
      messageEl.classList.add("is-hidden");
      lastTime = performance.now();
      raf = requestAnimationFrame(loop);
    }

    function jump() {
      start();
      if (!cat.onGround) return;
      cat.vy = -9.25;
      cat.onGround = false;
    }

    function randomObstacleType() {
      const roll = Math.random();
      if (roll < 0.4) return "plant";
      if (roll < 0.78) return "box";
      return "vacuum";
    }

    function obstacleSize(type) {
      if (type === "plant") return { w: 18, h: 24 };
      if (type === "box") return { w: 20, h: 18 };
      return { w: 24, h: 12 };
    }

    function createObstacle() {
      const type = randomObstacleType();
      const size = obstacleSize(type);
      obstacles.push({
        type,
        x: canvas.width + 10,
        y: GROUND_Y - size.h,
        w: size.w,
        h: size.h,
        counted: false
      });

      // Obstacles begin generously spaced. Spacing tightens progressively,
      // but never becomes unfair.
      const baseGap = Math.max(800, 1500 - obstaclesPassed * 22);
      spawnTimer = baseGap + Math.random() * 520;
    }

    function collides(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }

    function update(dt) {
      const frame = dt / 16.6667;

      cat.vy += 0.60 * frame;
      cat.y += cat.vy * frame;
      if (cat.y >= GROUND_Y - cat.h) {
        cat.y = GROUND_Y - cat.h;
        cat.vy = 0;
        cat.onGround = true;
      }

      spawnTimer -= dt;
      if (spawnTimer <= 0) createObstacle();

      obstacles.forEach((obstacle) => {
        obstacle.x -= speed * frame;

        if (!obstacle.counted && obstacle.x + obstacle.w < cat.x) {
          obstacle.counted = true;
          obstaclesPassed += 1;
          score = obstaclesPassed * 10;
          scoreEl.textContent = String(score);

          // Progressive difficulty: speed increases only after clearing an obstacle.
          speed = Math.min(
            MAX_SPEED,
            START_SPEED + obstaclesPassed * SPEED_GAIN_PER_OBSTACLE
          );

          if (score > best) {
            best = score;
            bestEl.textContent = String(best);
            localStorage.setItem(BEST_KEY, String(best));
          }
        }
      });

      obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.w > -8);

      const catHitbox = {
        x: cat.x + 4,
        y: cat.y + 3,
        w: cat.w - 7,
        h: cat.h - 3
      };

      if (obstacles.some((obstacle) => collides(catHitbox, obstacle))) {
        gameOver();
      }
    }

    function loop(time) {
      const dt = Math.min(32, time - lastTime || 16.6667);
      lastTime = time;
      update(dt);
      draw();
      if (!ended && active) raf = requestAnimationFrame(loop);
    }

    function gameOver() {
      cancelAnimationFrame(raf);
      raf = null;
      ended = true;
      const over = t("GAME OVER");
      const text = currentLanguage() === "fr"
        ? `Score : ${score} — cliquez sur Recommencer`
        : `Score: ${score} — click Restart`;
      messageEl.innerHTML = `<strong>${over}</strong><span>${text}</span>`;
      messageEl.classList.remove("is-hidden");
    }

    function px(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }

    function drawCat() {
      const x = Math.round(cat.x);
      const y = Math.round(cat.y);

      // Siamese palette:
      // cream body + dark brown points + blue eyes.
      const cream = "#e6d2b4";
      const creamLight = "#f0dfc5";
      const point = "#5a4039";
      const pointDark = "#3e2c29";
      const blueEye = "#78c7e8";

      // tail
      px(x - 7, y + 11, 7, 3, point);
      px(x - 4, y + 8, 3, 3, point);

      // body
      px(x + 3, y + 9, 14, 9, cream);
      px(x + 15, y + 10, 5, 6, creamLight);

      // legs / paws (dark points)
      px(x + 4, y + 18, 3, 4, point);
      px(x + 12, y + 18, 3, 4, point);

      // head
      px(x + 13, y + 2, 11, 9, cream);

      // ears
      px(x + 14, y, 3, 4, point);
      px(x + 20, y, 3, 4, point);

      // Siamese facial mask
      px(x + 16, y + 4, 8, 6, point);
      px(x + 18, y + 3, 5, 2, point);

      // muzzle highlight
      px(x + 20, y + 8, 4, 2, creamLight);

      // eye
      px(x + 20, y + 5, 2, 2, blueEye);

      // nose
      px(x + 23, y + 8, 1.5, 1.5, pointDark);
    }

    function drawPlant(x, y) {
      px(x + 5, y + 2, 3, 8, "#6db56b");
      px(x + 1, y + 6, 4, 4, "#6db56b");
      px(x + 8, y + 6, 4, 4, "#6db56b");
      px(x + 3, y + 11, 10, 5, "#8d6342");
      px(x + 2, y + 16, 12, 6, "#af7d53");
    }

    function drawBox(x, y) {
      px(x + 1, y + 4, 16, 12, "#c58b58");
      px(x, y + 2, 18, 3, "#d59c67");
      px(x + 8, y + 4, 2, 12, "#af7648");
      px(x + 3, y + 7, 3, 2, "#dca978");
    }

    function drawVacuum(x, y) {
      px(x + 2, y + 5, 18, 5, "#7f8c97");
      px(x + 4, y + 3, 14, 4, "#97a4af");
      px(x + 6, y + 1, 2, 2, "#dfe7ee");
      px(x + 16, y + 10, 4, 2, "#5d6670");
    }

    function drawObstacle(obstacle) {
      const x = Math.round(obstacle.x);
      const y = Math.round(obstacle.y);
      if (obstacle.type === "plant") drawPlant(x, y);
      if (obstacle.type === "box") drawBox(x, y);
      if (obstacle.type === "vacuum") drawVacuum(x, y);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f1823";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#162334";
      ctx.fillRect(0, 0, canvas.width, 154);

      for (let i = 0; i < canvas.width; i += 24) {
        px(i + 8, 22, 2, 2, "rgba(255,255,255,.14)");
        px(i + 18, 48, 2, 2, "rgba(255,255,255,.10)");
      }

      ctx.fillStyle = "#202c38";
      ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
      ctx.fillStyle = "#4f7698";
      ctx.fillRect(0, GROUND_Y - 4, canvas.width, 4);

      for (let i = 0; i < canvas.width; i += 16) {
        px(i, GROUND_Y + 6, 8, 2, "rgba(255,255,255,.06)");
      }

      obstacles.forEach(drawObstacle);
      drawCat();
    }

    function onKey(event) {
      if (!active) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === " " || key === "ArrowUp" || key === "w" || key === "z") {
        event.preventDefault();
        jump();
      }
    }

    function refreshText() {
      if (!started || ended) {
        if (ended) {
          gameOver();
        } else {
          messageEl.innerHTML = `<strong>CAT RUNNER</strong><span>${t("Press Space, ↑, or click to jump")}</span>`;
        }
      }
    }

    function setActive(isActive) {
      active = isActive;
    }

    restartBtn.addEventListener("click", reset);
    jumpBtn?.addEventListener("click", jump);
    canvas.addEventListener("click", jump);

    reset();

    return {
      onKey,
      refreshText,
      setActive,
      prepare,
      pause,
      destroy() {
        cancelAnimationFrame(raf);
      }
    };
  }


  function createBreakout(root) {
    if (!root) return null;

    const canvas = root.querySelector("[data-breakout-canvas]");
    const ctx = canvas.getContext("2d");
    const scoreEl = root.querySelector("[data-breakout-score]");
    const bestEl = root.querySelector("[data-breakout-best]");
    const messageEl = root.querySelector("[data-breakout-message]");
    const restartBtn = root.querySelector("[data-breakout-restart]");
    const launchBtn = root.querySelector("[data-breakout-launch]");
    const directionButtons = Array.from(root.querySelectorAll("[data-breakout-direction]"));

    const BEST_KEY = "portfolio.breakoutBest.v1";
    const PADDLE_Y = 216;
    const PADDLE_W = 54;
    const PADDLE_H = 7;
    const BALL_SIZE = 6;
    const BRICK_ROWS = 5;
    const BRICK_COLS = 8;
    const BRICK_W = 34;
    const BRICK_H = 12;
    const BRICK_GAP = 4;
    const BRICK_START_X = 8;
    const BRICK_START_Y = 24;
    const START_BALL_SPEED = 3.0;
    const MAX_BALL_SPEED = 5.8;

    let active = false;
    let raf = null;
    let lastTime = 0;
    let started = false;
    let ended = false;
    let won = false;
    let score = 0;
    let best = Number(localStorage.getItem(BEST_KEY)) || 0;
    let paddleX = (canvas.width - PADDLE_W) / 2;
    let moveLeft = false;
    let moveRight = false;
    let bricks = [];
    let ball = { x: canvas.width / 2, y: PADDLE_Y - 10, vx: 2.1, vy: -2.2, speed: START_BALL_SPEED };

    bestEl.textContent = String(best);

    function buildBricks() {
      bricks = [];
      for (let row = 0; row < BRICK_ROWS; row += 1) {
        for (let col = 0; col < BRICK_COLS; col += 1) {
          bricks.push({
            x: BRICK_START_X + col * (BRICK_W + BRICK_GAP),
            y: BRICK_START_Y + row * (BRICK_H + BRICK_GAP),
            w: BRICK_W,
            h: BRICK_H,
            row,
            alive: true
          });
        }
      }
    }

    function reset() {
      cancelAnimationFrame(raf);
      raf = null;
      lastTime = 0;
      started = false;
      ended = false;
      won = false;
      score = 0;
      scoreEl.textContent = "0";
      paddleX = (canvas.width - PADDLE_W) / 2;
      moveLeft = false;
      moveRight = false;
      ball = {
        x: canvas.width / 2,
        y: PADDLE_Y - 10,
        vx: 2.1,
        vy: -2.2,
        speed: START_BALL_SPEED
      };
      buildBricks();
      messageEl.innerHTML = `<strong>BREAKOUT</strong><span>${t("Click to launch • use ← → or A/D to move")}</span>`;
      messageEl.classList.remove("is-hidden");
      draw();
    }

    function prepare() {
      if (!started && !ended) draw();
    }

    function pause() {
      cancelAnimationFrame(raf);
      raf = null;
      moveLeft = false;
      moveRight = false;
      if (started && !ended) {
        started = false;
        ball.x = paddleX + PADDLE_W / 2;
        ball.y = PADDLE_Y - 10;
        messageEl.innerHTML = `<strong>BREAKOUT</strong><span>${t("Click to launch • use ← → or A/D to move")}</span>`;
        messageEl.classList.remove("is-hidden");
        draw();
      }
    }

    function launch() {
      if (!active) return;
      if (ended) reset();
      if (started) return;

      started = true;
      messageEl.classList.add("is-hidden");

      const magnitude = Math.hypot(ball.vx, ball.vy) || 1;
      const scale = ball.speed / magnitude;
      ball.vx *= scale;
      ball.vy = -Math.abs(ball.vy * scale);

      lastTime = performance.now();
      raf = requestAnimationFrame(loop);
    }

    function bounceFromPaddle() {
      const relative = (ball.x - (paddleX + PADDLE_W / 2)) / (PADDLE_W / 2);
      const clamped = Math.max(-1, Math.min(1, relative));
      ball.speed = Math.min(MAX_BALL_SPEED, ball.speed + 0.04);
      ball.vx = clamped * ball.speed * 0.9;

      const vertical = Math.sqrt(Math.max(0.6, ball.speed * ball.speed - ball.vx * ball.vx));
      ball.vy = -vertical;
    }

    function update(dt) {
      const frame = dt / 16.6667;

      if (moveLeft) paddleX -= 5.2 * frame;
      if (moveRight) paddleX += 5.2 * frame;
      paddleX = Math.max(4, Math.min(canvas.width - PADDLE_W - 4, paddleX));

      if (!started) {
        ball.x = paddleX + PADDLE_W / 2;
        ball.y = PADDLE_Y - 10;
        return;
      }

      ball.x += ball.vx * frame;
      ball.y += ball.vy * frame;

      if (ball.x <= BALL_SIZE / 2) {
        ball.x = BALL_SIZE / 2;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x >= canvas.width - BALL_SIZE / 2) {
        ball.x = canvas.width - BALL_SIZE / 2;
        ball.vx = -Math.abs(ball.vx);
      }

      if (ball.y <= BALL_SIZE / 2) {
        ball.y = BALL_SIZE / 2;
        ball.vy = Math.abs(ball.vy);
      }

      const ballLeft = ball.x - BALL_SIZE / 2;
      const ballRight = ball.x + BALL_SIZE / 2;
      const ballTop = ball.y - BALL_SIZE / 2;
      const ballBottom = ball.y + BALL_SIZE / 2;

      if (
        ball.vy > 0 &&
        ballBottom >= PADDLE_Y &&
        ballTop <= PADDLE_Y + PADDLE_H &&
        ballRight >= paddleX &&
        ballLeft <= paddleX + PADDLE_W
      ) {
        ball.y = PADDLE_Y - BALL_SIZE / 2;
        bounceFromPaddle();
      }

      for (const brick of bricks) {
        if (!brick.alive) continue;

        const hit =
          ballRight >= brick.x &&
          ballLeft <= brick.x + brick.w &&
          ballBottom >= brick.y &&
          ballTop <= brick.y + brick.h;

        if (!hit) continue;

        brick.alive = false;
        score += 10;
        scoreEl.textContent = String(score);

        if (score > best) {
          best = score;
          bestEl.textContent = String(best);
          localStorage.setItem(BEST_KEY, String(best));
        }

        // Slight speed increase as more bricks are destroyed.
        ball.speed = Math.min(MAX_BALL_SPEED, ball.speed + 0.035);

        // Simple but reliable pixel-style bounce.
        ball.vy *= -1;
        break;
      }

      if (bricks.every((brick) => !brick.alive)) {
        winGame();
        return;
      }

      if (ball.y - BALL_SIZE / 2 > canvas.height) {
        gameOver();
      }
    }

    function loop(time) {
      const dt = Math.min(32, time - lastTime || 16.6667);
      lastTime = time;
      update(dt);
      draw();
      if (!ended && active) raf = requestAnimationFrame(loop);
    }

    function gameOver() {
      cancelAnimationFrame(raf);
      raf = null;
      ended = true;
      won = false;
      messageEl.innerHTML = `<strong>${t("GAME OVER")}</strong><span>${currentLanguage() === "fr" ? `Score : ${score} — cliquez sur Recommencer` : `Score: ${score} — click Restart`}</span>`;
      messageEl.classList.remove("is-hidden");
    }

    function winGame() {
      cancelAnimationFrame(raf);
      raf = null;
      ended = true;
      won = true;
      messageEl.innerHTML = `<strong>${t("YOU WIN!")}</strong><span>${currentLanguage() === "fr" ? `Score : ${score} — cliquez sur Recommencer` : `Score: ${score} — click Restart`}</span>`;
      messageEl.classList.remove("is-hidden");
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f1823";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,.025)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const brickColors = ["#E6D2B4", "#78C7E8", "#49C8BC", "#397FB5", "#EE8A95"];
      bricks.forEach((brick) => {
        if (!brick.alive) return;
        ctx.fillStyle = brickColors[brick.row % brickColors.length];
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);

        ctx.fillStyle = "rgba(255,255,255,.14)";
        ctx.fillRect(brick.x + 2, brick.y + 2, brick.w - 4, 2);
      });

      ctx.fillStyle = "#9be8d2";
      ctx.fillRect(Math.round(paddleX), PADDLE_Y, PADDLE_W, PADDLE_H);

      ctx.fillStyle = "#49c8bc";
      ctx.fillRect(Math.round(paddleX + 4), PADDLE_Y + 2, PADDLE_W - 8, 2);

      ctx.fillStyle = "#C93F58";
      ctx.fillRect(
        Math.round(ball.x - BALL_SIZE / 2),
        Math.round(ball.y - BALL_SIZE / 2),
        BALL_SIZE,
        BALL_SIZE
      );
    }

    function onKey(event) {
      if (!active) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === " " || key === "ArrowUp") {
        event.preventDefault();
        launch();
        return;
      }

      if (key === "ArrowLeft" || key === "a" || key === "q") {
        event.preventDefault();
        moveLeft = true;
        paddleX -= 12;
        if (!started) {
          ball.x = paddleX + PADDLE_W / 2;
          draw();
        }
      }

      if (key === "ArrowRight" || key === "d") {
        event.preventDefault();
        moveRight = true;
        paddleX += 12;
        if (!started) {
          ball.x = paddleX + PADDLE_W / 2;
          draw();
        }
      }
    }

    function onKeyUp(event) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === "ArrowLeft" || key === "a" || key === "q") moveLeft = false;
      if (key === "ArrowRight" || key === "d") moveRight = false;
    }

    function setActive(isActive) {
      active = isActive;
    }

    function refreshText() {
      if (!started || ended) {
        if (ended) {
          if (won) winGame();
          else gameOver();
        } else {
          messageEl.innerHTML = `<strong>BREAKOUT</strong><span>${t("Click to launch • use ← → or A/D to move")}</span>`;
        }
      }
    }

    function movePaddleFromPointer(event) {
      if (!active) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const pointerX = (event.clientX - rect.left) * scaleX;
      paddleX = Math.max(4, Math.min(canvas.width - PADDLE_W - 4, pointerX - PADDLE_W / 2));

      if (!started) {
        ball.x = paddleX + PADDLE_W / 2;
        draw();
      }
    }

    restartBtn.addEventListener("click", reset);
    launchBtn?.addEventListener("click", launch);

    directionButtons.forEach((button) => {
      button.addEventListener("pointerdown", () => {
        const dir = button.dataset.breakoutDirection;
        if (dir === "left") {
          paddleX -= 20;
        } else {
          paddleX += 20;
        }
        paddleX = Math.max(4, Math.min(canvas.width - PADDLE_W - 4, paddleX));
        if (!started) ball.x = paddleX + PADDLE_W / 2;
        draw();
      });
    });

    canvas.addEventListener("pointermove", movePaddleFromPointer);
    canvas.addEventListener("click", launch);

    // The start/game-over overlay sits above the canvas, so make it clickable too.
    // A simple click anywhere on the visible game message starts (or restarts) Breakout.
    messageEl.addEventListener("click", launch);

    document.addEventListener("keyup", onKeyUp);

    reset();

    return {
      onKey,
      refreshText,
      setActive,
      prepare,
      pause,
      destroy() {
        cancelAnimationFrame(raf);
        document.removeEventListener("keyup", onKeyUp);
      }
    };
  }


  function create2048(root) {
    if (!root) return null;

    const boardEl = root.querySelector("[data-2048-board]");
    const scoreEl = root.querySelector("[data-2048-score]");
    const movesEl = root.querySelector("[data-2048-moves]");
    const bestEl = root.querySelector("[data-2048-best]");
    const restartBtn = root.querySelector("[data-2048-restart]");
    const messageEl = root.querySelector("[data-2048-message]");
    const BEST_KEY = "portfolio.2048Best.v3";

    let active = false;
    let grid = [];
    let score = 0;
    let moves = 0;
    let best = Number(localStorage.getItem(BEST_KEY)) || 0;
    let touchStart = null;
    let ended = false;

    function emptyGrid() {
      return Array.from({ length: 4 }, () => Array(4).fill(0));
    }

    function randomEmptyCell() {
      const empty = [];
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          if (!grid[r][c]) empty.push([r, c]);
        }
      }
      return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
    }

    function addTile() {
      const cell = randomEmptyCell();
      if (!cell) return;
      const [r, c] = cell;
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function reset() {
      grid = emptyGrid();
      score = 0;
      moves = 0;
      ended = false;
      addTile();
      addTile();
      messageEl.classList.add("is-hidden");
      updateBest();
      render();
    }

    function updateBest() {
      if (score > best) {
        best = score;
        localStorage.setItem(BEST_KEY, String(best));
      }
      scoreEl.textContent = String(score);
      movesEl.textContent = String(moves);
      bestEl.textContent = String(best);
    }

    function compress(line) {
      const values = line.filter(Boolean);
      const merged = [];

      for (let i = 0; i < values.length; i += 1) {
        if (values[i] === values[i + 1]) {
          const value = values[i] * 2;
          merged.push(value);
          score += value;
          i += 1;
        } else {
          merged.push(values[i]);
        }
      }

      while (merged.length < 4) merged.push(0);
      return merged;
    }

    function cloneGrid(source) {
      return source.map((row) => [...row]);
    }

    function sameGrid(a, b) {
      return a.every((row, r) => row.every((value, c) => value === b[r][c]));
    }

    function hasMoves() {
      // Any empty cell means at least one slide is still possible.
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          if (grid[r][c] === 0) return true;
        }
      }

      // Otherwise, a move is still possible if two neighboring tiles match.
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
          if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
        }
      }

      return false;
    }

    function showGameOver() {
      if (ended) return;
      ended = true;
      updateBest();

      const details = currentLanguage() === "fr"
        ? `Mouvements : ${moves}<br>Score final : ${score}`
        : `Moves: ${moves}<br>Final score: ${score}`;

      messageEl.innerHTML = `<strong>${t("GAME OVER")}</strong><span>${details}</span>`;
      messageEl.classList.remove("is-hidden");
    }

    function move(direction) {
      if (!active || ended) return;

      const before = cloneGrid(grid);

      if (direction === "left") {
        grid = grid.map((row) => compress(row));
      } else if (direction === "right") {
        grid = grid.map((row) => compress([...row].reverse()).reverse());
      } else if (direction === "up") {
        for (let c = 0; c < 4; c += 1) {
          const column = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
          const next = compress(column);
          for (let r = 0; r < 4; r += 1) grid[r][c] = next[r];
        }
      } else if (direction === "down") {
        for (let c = 0; c < 4; c += 1) {
          const column = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
          const next = compress(column).reverse();
          for (let r = 0; r < 4; r += 1) grid[r][c] = next[r];
        }
      }

      if (sameGrid(before, grid)) {
        if (!hasMoves()) showGameOver();
        return;
      }

      moves += 1;
      addTile();
      updateBest();
      render(direction);

      if (!hasMoves()) {
        // Let the final slide animation finish before showing GAME OVER.
        window.setTimeout(showGameOver, 230);
      }
    }

    function render(direction = "") {
      boardEl.innerHTML = "";

      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          const cell = document.createElement("div");
          cell.className = "game-2048__cell";

          const value = grid[r][c];
          if (value) {
            const tile = document.createElement("div");
            tile.className = "game-2048__tile";
            tile.dataset.value = String(value);
            tile.textContent = String(value);

            if (direction) {
              tile.classList.add(`is-sliding-${direction}`);
            }

            cell.appendChild(tile);
          }

          boardEl.appendChild(cell);
        }
      }

      updateBest();
    }

    function onKey(event) {
      if (!active) return;

      const directions = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down"
      };

      const direction = directions[event.key];
      if (!direction) return;

      event.preventDefault();
      move(direction);
    }

    function onTouchStart(event) {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }

    function onTouchEnd(event) {
      if (!touchStart || !active) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? "right" : "left");
      } else {
        move(dy > 0 ? "down" : "up");
      }
    }

    function setActive(isActive) {
      active = isActive;
    }

    function prepare() {
      render();
    }

    function pause() {
      active = false;
    }

    function refreshText() {
      if (ended) {
        const details = currentLanguage() === "fr"
          ? `Mouvements : ${moves}<br>Score final : ${score}`
          : `Moves: ${moves}<br>Final score: ${score}`;
        messageEl.innerHTML = `<strong>${t("GAME OVER")}</strong><span>${details}</span>`;
      }
    }

    boardEl.addEventListener("touchstart", onTouchStart, { passive: true });
    boardEl.addEventListener("touchend", onTouchEnd, { passive: true });
    restartBtn.addEventListener("click", reset);

    reset();

    return {
      setActive,
      prepare,
      pause,
      refreshText,
      onKey,
      destroy() {}
    };
  }

  document.addEventListener("portfolio:window-opened", (event) => {
    if (event.detail.id !== "play") return;
    instances.set("play", create(event.detail.element));
  });

  document.addEventListener("portfolio:window-closing", (event) => {
    if (event.detail.id !== "play") return;
    const instance = instances.get("play");
    if (instance) instance.destroy();
    instances.delete("play");
  });

  return {};
})();
