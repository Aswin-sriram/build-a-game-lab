/* ---------- The 10 games. t:1 = the student types this part; t:0 = written for them and hidden ---------- */
const GAMES = [
{
  id: 'catch', name: 'Star Catcher', level: 'Beginner', bg: '#10162b', fg: '#ffd34d',
  blurb: 'Move the basket to catch falling stars. Miss three and the game ends.',
  controls: 'Left and right arrows move the basket.',
  parts: [
    { t: 1, title: 'Make the basket', desc: 'An object holds the basket\'s position and size. Two variables count your score and lives.',
      code: `const basket = { x: 160, y: 370, w: 80, h: 14 };
[[let score]] = 0;
[[let lives]] = 3;` },
    { t: 0, title: 'The falling star', code: `const star = { x: 200, y: 0, r: 10, speed: 3 };
function resetStar() {
  star.x = 20 + Math.random() * (W - 40);
  star.y = -star.r;
  star.speed = 2 + Math.random() * 2 + score * 0.1;
}
resetStar();` },
    { t: 1, title: 'Move with the arrow keys', desc: 'Each frame, check which arrow is held and slide the basket. The last line keeps it on screen.',
      code: `function moveBasket() {
  if (keys.[[ArrowLeft]]) basket.x -= 6;
  if (keys.[[ArrowRight]]) basket.x += 6;
  basket.x = Math.max(0, Math.min(W - basket.w, basket.x));
}` },
    { t: 1, title: 'Catch or miss', desc: 'The star falls a little every frame. If it lands inside the basket you score; if it falls off the bottom you lose a life.',
      code: `function updateStar() {
  star.y += star.speed;
  const inX = star.x > basket.x && star.x < basket.x + basket.w;
  if (inX && star.y + star.r >= basket.y) {
    [[score++]];
    [[resetStar]]();
  }
  if (star.y > H) {
    [[lives--]];
    resetStar();
  }
}` },
    { t: 0, title: 'Draw the sky, star and basket', code: `function draw() {
  ctx.fillStyle = '#10162b';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffd34d';
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6ee7f9';
  ctx.fillRect(basket.x, basket.y, basket.w, basket.h);
}` },
    { t: 1, title: 'Show the score', desc: 'fillText writes words onto the game screen at an x and y position.',
      code: `function drawScore() {
  ctx.fillStyle = '[[white]]';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('[[Score]]: ' + score + '  [[Lives]]: ' + lives, 10, 24);
}` },
    { t: 1, title: 'The game loop', desc: 'The heart of every game: move, update, draw, then ask the browser to run the loop again on the next frame.',
      code: `function loop() {
  if (lives <= 0) return gameOver('Score: ' + score);
  [[moveBasket]]();
  [[updateStar]]();
  [[draw]]();
  drawScore();
  requestAnimationFrame(loop);
}
loop();` }
  ]
},
{
  id: 'snake', name: 'Snake', level: 'Beginner', bg: '#0f1a14', fg: '#b4f06a',
  blurb: 'Steer the snake to eat food. Every bite makes you longer. Do not hit the walls or yourself.',
  controls: 'Arrow keys turn the snake.',
  parts: [
    { t: 0, title: 'The grid and the snake', code: `const CELL = 20, COLS = W / CELL, ROWS = H / CELL;
let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
let dir = { x: 1, y: 0 };
let nextDir = dir;
let alive = true;
function randomCell() {
  let c;
  do {
    c = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === c.x && s.y === c.y));
  return c;
}` },
    { t: 1, title: 'Place the food', desc: 'Put the first food on a random empty square and start the score at zero.',
      code: `let [[food]] = [[randomCell]]();
let [[score]] = 0;` },
    { t: 1, title: 'Steer with the arrows', desc: 'A lookup table turns each arrow key into a direction. The check stops the snake reversing into itself.',
      code: `const turns = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  [[ArrowLeft]]: { x: -1, y: 0 }, [[ArrowRight]]: { x: 1, y: 0 }
};
addEventListener('keydown', e => {
  const t = turns[e.key];
  if (t && t.x !== -dir.x && t.y !== -dir.y) nextDir = t;
});` },
    { t: 1, title: 'Eat the food', desc: 'If the head lands on the food, add a point and move the food. Returning true tells the snake to grow.',
      code: `function eat(head) {
  if (head.x === food.x && head.y === food.y) {
    [[score++]];
    food = [[randomCell]]();
    return [[true]];
  }
  return [[false]];
}` },
    { t: 0, title: 'Move one square and check for crashes', code: `function step() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  const hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
  if (hitWall || snake.some(s => s.x === head.x && s.y === head.y)) {
    alive = false;
    return;
  }
  snake.unshift(head);
  if (!eat(head)) snake.pop();
}` },
    { t: 1, title: 'Draw the snake', desc: 'Loop over every square of the snake. The head (index 0) gets a brighter colour.',
      code: `function drawSnake() {
  snake.[[forEach]]((s, i) => {
    ctx.fillStyle = i === 0 ? '#b4f06a' : '#5fcf5f';
    ctx.[[fillRect]](s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });
}` },
    { t: 0, title: 'Draw the board and score', code: `function draw() {
  ctx.fillStyle = '#0f1a14';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ff5d73';
  ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
  drawSnake();
  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 8, 20);
}` },
    { t: 1, title: 'The timed game loop', desc: 'The screen redraws every frame, but the snake only moves every 120 milliseconds.',
      code: `let last = 0;
function loop(time) {
  if (time - last > 120) {
    [[step]]();
    last = time;
  }
  [[draw]]();
  if (!alive) return [[gameOver]]('Score: ' + score);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);` }
  ]
},
{
  id: 'pong', name: 'Pong', level: 'Beginner', bg: '#111111', fg: '#f5f5f5',
  blurb: 'Hit the ball past the computer. First to 5 points wins.',
  controls: 'Up and down arrows move your paddle on the left.',
  parts: [
    { t: 0, title: 'Paddles, ball and serve', code: `const PH = 70, PW = 10;
const player = { x: 12, y: 165, score: 0 };
const cpu = { x: 378, y: 165, score: 0 };
const ball = { x: 200, y: 200, vx: 4, vy: 2, r: 7 };
function serve(dir) {
  ball.x = W / 2;
  ball.y = H / 2;
  ball.vx = 4 * dir;
  ball.vy = Math.random() * 4 - 2;
}` },
    { t: 1, title: 'Move your paddle', desc: 'Up arrow moves the paddle up (smaller y), down arrow moves it down. Then keep it on screen.',
      code: `function movePlayer() {
  if (keys.[[ArrowUp]]) player.y -= 6;
  if (keys.[[ArrowDown]]) player.y += 6;
  player.y = Math.max(0, Math.min(H - PH, player.y));
}` },
    { t: 1, title: 'The computer player', desc: 'A very simple AI: the computer slides toward the ball, a bit slower than you can move.',
      code: `function moveCpu() {
  const [[target]] = ball.y - PH / 2;
  if (cpu.y < [[target]]) cpu.y += 3.5;
  if (cpu.y > [[target]]) cpu.y -= 3.5;
}` },
    { t: 1, title: 'Bounce off the walls', desc: 'When the ball touches the top or bottom, flip its up-down speed so it bounces back.',
      code: `function [[bounceWalls]]() {
  if (ball.y < ball.r) ball.vy = Math.[[abs]](ball.vy);
  if (ball.y > H - ball.r) ball.vy = -Math.[[abs]](ball.vy);
}` },
    { t: 0, title: 'Move the ball and hit paddles', code: `function hitPaddle(p) {
  return ball.x + ball.r > p.x && ball.x - ball.r < p.x + PW && ball.y > p.y && ball.y < p.y + PH;
}
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  bounceWalls();
  [player, cpu].forEach(p => {
    if (hitPaddle(p)) {
      ball.vx = Math.max(-10, Math.min(10, -ball.vx * 1.05));
      ball.vy = (ball.y - (p.y + PH / 2)) * 0.15;
      ball.x = p === player ? p.x + PW + ball.r : p.x - ball.r;
    }
  });
}` },
    { t: 1, title: 'Score points', desc: 'If the ball goes off the left edge the computer scores; off the right edge, you score. Then serve again.',
      code: `function checkScore() {
  if (ball.x < 0) {
    [[cpu]].score++;
    [[serve]](1);
  }
  if (ball.x > W) {
    [[player]].score++;
    [[serve]](-1);
  }
}` },
    { t: 0, title: 'Draw the court', code: `function draw() {
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#444444';
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(player.x, player.y, PW, PH);
  ctx.fillRect(cpu.x, cpu.y, PW, PH);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(player.score, W / 4, 44);
  ctx.fillText(cpu.score, W * 3 / 4, 44);
}` },
    { t: 1, title: 'The match loop', desc: 'Run every step in order each frame. Stop when someone reaches 5 points.',
      code: `function loop() {
  [[movePlayer]]();
  [[moveCpu]]();
  moveBall();
  checkScore();
  [[draw]]();
  if (player.score === 5) return banner('You [[win]]!', 'First to 5 points');
  if (cpu.score === 5) return banner('Computer wins', 'Try again!');
  requestAnimationFrame(loop);
}
loop();` }
  ]
},
{
  id: 'whack', name: 'Whack-a-Mole', level: 'Beginner', bg: '#6fbf4a', fg: '#3d2817',
  blurb: 'Moles pop out of holes. Tap them before they hide. You have 30 seconds.',
  controls: 'Click or tap a mole to whack it.',
  parts: [
    { t: 0, title: 'The holes and the clock', code: `const holes = [];
for (let i = 0; i < 9; i++) {
  holes.push({ x: 80 + (i % 3) * 120, y: 110 + Math.floor(i / 3) * 110 });
}
let mole = -1, moleTimer = 0;
let score = 0, timeLeft = 30, lastTick = 0;` },
    { t: 1, title: 'Pop up a mole', desc: 'Pick one of the 9 holes at random, and decide how many frames the mole stays up.',
      code: `function [[popMole]]() {
  [[mole]] = Math.floor(Math.random() * 9);
  [[moleTimer]] = 50 + Math.random() * 30;
}` },
    { t: 1, title: 'Whack on tap', desc: 'onTap gives you where the player tapped. Math.hypot measures the distance to the mole.',
      code: `onTap((x, y) => {
  if (mole < 0) [[return]];
  const h = holes[mole];
  if (Math.hypot(x - h.x, y - h.y) < 40) {
    [[score++]];
    [[popMole]]();
  }
});` },
    { t: 1, title: 'Mole timer', desc: 'Count down every frame. When time runs out, the mole hides and another pops up.',
      code: `function updateMole() {
  [[moleTimer--]];
  if (moleTimer <= 0) [[popMole]]();
}` },
    { t: 1, title: 'Countdown clock', desc: 'The loop gets the time in milliseconds. Every 1000 ms, take one second off the clock.',
      code: `function tick(time) {
  if (time - lastTick > 1000) {
    [[timeLeft--]];
    [[lastTick]] = [[time]];
  }
}` },
    { t: 0, title: 'Draw the field and moles', code: `function draw() {
  ctx.fillStyle = '#6fbf4a';
  ctx.fillRect(0, 0, W, H);
  holes.forEach((h, i) => {
    ctx.fillStyle = '#3d2817';
    ctx.beginPath();
    ctx.ellipse(h.x, h.y + 20, 42, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    if (i === mole) {
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.fillRect(h.x - 10, h.y - 8, 5, 5);
      ctx.fillRect(h.x + 5, h.y - 8, 5, 5);
      ctx.fillStyle = '#f4a3b5';
      ctx.fillRect(h.x - 4, h.y + 2, 8, 6);
    }
  });
  ctx.fillStyle = 'white';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 12, 28);
  ctx.textAlign = 'right';
  ctx.fillText('Time: ' + timeLeft, W - 12, 28);
}` },
    { t: 1, title: 'The game loop', desc: 'Tick the clock, update the mole, draw. When time is up, show the final score.',
      code: `function loop(time) {
  [[tick]](time);
  [[updateMole]]();
  [[draw]]();
  if (timeLeft <= 0) return banner('Time [[up]]!', 'You whacked ' + score + ' moles');
  requestAnimationFrame(loop);
}
popMole();
requestAnimationFrame(loop);` }
  ]
},
{
  id: 'memory', name: 'Memory Match', level: 'Beginner', bg: '#1e2a4a', fg: '#4c6ef5',
  blurb: 'Flip two cards at a time and find all 8 matching pairs in as few moves as you can.',
  controls: 'Click or tap a card to flip it.',
  parts: [
    { t: 0, title: 'Card symbols and board size', code: `const SYMBOLS = ['★', '♥', '♦', '♣', '♠', '☼', '☺', '♪'];
let cards = [];
let flipped = [];
let matches = 0, moves = 0, lockUntil = 0;
const SIZE = 80, GAP = 12, LEFT = 22, TOP = 36;` },
    { t: 1, title: 'Shuffle the deck', desc: 'Double the symbols so each has a pair, shuffle them, then lay them out 4 cards per row.',
      code: `const deck = SYMBOLS.[[concat]](SYMBOLS);
deck.[[sort]](() => Math.random() - 0.5);
deck.forEach((s, i) => {
  cards.[[push]]({ symbol: s, col: i % 4, row: Math.floor(i / 4), open: false, done: false });
});` },
    { t: 1, title: 'Find the tapped card', desc: 'Work out where each card sits on screen and return the one that contains the tap.',
      code: `function [[cardAt]](x, y) {
  return cards.[[find]](c => {
    const cx = LEFT + c.col * (SIZE + GAP);
    const cy = TOP + c.row * (SIZE + GAP);
    return x > cx && x < cx + SIZE && y > cy && y < cy + SIZE;
  });
}` },
    { t: 1, title: 'Flip on tap', desc: 'Flip a face-down card. After two flips, count a move and wait 0.7 seconds before checking.',
      code: `onTap((x, y) => {
  const c = cardAt(x, y);
  if (!c || c.[[open]] || flipped.length === 2) return;
  c.open = [[true]];
  flipped.[[push]](c);
  if (flipped.length === 2) {
    [[moves++]];
    lockUntil = performance.now() + 700;
  }
});` },
    { t: 1, title: 'Check for a match', desc: 'Same symbol? Keep both cards face up. Different? Turn them back over.',
      code: `function checkPair(time) {
  if (flipped.length < 2 || time < lockUntil) return;
  const a = flipped[0], b = flipped[1];
  if (a.symbol === b.symbol) {
    a.done = true;
    b.done = true;
    [[matches++]];
  } else {
    a.open = [[false]];
    b.open = [[false]];
  }
  flipped = [];
}` },
    { t: 0, title: 'Draw the cards', code: `function draw() {
  ctx.fillStyle = '#1e2a4a';
  ctx.fillRect(0, 0, W, H);
  cards.forEach(c => {
    const x = LEFT + c.col * (SIZE + GAP);
    const y = TOP + c.row * (SIZE + GAP);
    ctx.fillStyle = c.done ? '#2f9e44' : c.open ? '#f8f9fa' : '#4c6ef5';
    ctx.fillRect(x, y, SIZE, SIZE);
    if (c.open || c.done) {
      ctx.fillStyle = c.done ? 'white' : '#1e2a4a';
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.symbol, x + SIZE / 2, y + SIZE / 2 + 2);
      ctx.textBaseline = 'alphabetic';
    }
  });
  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Moves: ' + moves + '   Pairs: ' + matches + '/8', 22, 24);
}` },
    { t: 1, title: 'The game loop', desc: 'Check pairs and draw every frame until all 8 pairs are found.',
      code: `function loop(time) {
  [[checkPair]](time);
  [[draw]]();
  if (matches === 8) return banner('All [[matched]]!', 'You did it in ' + moves + ' moves');
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);` }
  ]
},
{
  id: 'flappy', name: 'Flappy Bird', level: 'Intermediate', bg: '#7ec8f2', fg: '#ffcf3a',
  blurb: 'Flap through the gaps between pipes. Gravity is always pulling you down.',
  controls: 'Space, the up arrow, or a tap makes the bird flap.',
  parts: [
    { t: 1, title: 'Make the bird', desc: 'vy is the bird\'s up-down speed. GRAVITY pulls it down; FLAP is a negative number because up is minus y.',
      code: `const [[bird]] = { x: 90, y: 200, vy: 0, r: 12 };
const [[GRAVITY]] = 0.45;
const [[FLAP]] = -7.5;` },
    { t: 0, title: 'Pipes, score and restart', code: `let pipes = [];
const GAP = 130, PIPE_W = 54;
let frame = 0, score = 0;
let state = 'ready';
function restart() {
  bird.y = 200;
  bird.vy = 0;
  pipes = [];
  frame = 0;
  score = 0;
  state = 'ready';
}` },
    { t: 1, title: 'Flap', desc: 'A flap gives the bird an upward kick. After a crash, the next flap restarts the game.',
      code: `function flap() {
  if (state === 'over') return [[restart]]();
  state = '[[playing]]';
  bird.vy = [[FLAP]];
}
addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'ArrowUp') flap();
});
onTap(flap);` },
    { t: 1, title: 'Gravity', desc: 'Every frame gravity adds to the speed, and the speed moves the bird. Hitting the ground or sky ends the game.',
      code: `function fall() {
  bird.vy += [[GRAVITY]];
  bird.y += bird.[[vy]];
  if (bird.y > H - bird.r || bird.y < bird.r) state = '[[over]]';
}` },
    { t: 0, title: 'Spawn pipes and check crashes', code: `function updatePipes() {
  if (frame % 95 === 0) {
    pipes.push({ x: W, top: 50 + Math.random() * (H - GAP - 100), scored: false });
  }
  pipes.forEach(p => {
    p.x -= 2.5;
    const inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W;
    const inGap = bird.y - bird.r > p.top && bird.y + bird.r < p.top + GAP;
    if (inX && !inGap) state = 'over';
    if (!p.scored && p.x + PIPE_W < bird.x) {
      p.scored = true;
      score++;
    }
  });
  pipes = pipes.filter(p => p.x + PIPE_W > 0);
}` },
    { t: 1, title: 'Draw the bird', desc: 'arc draws a circle: centre x, centre y, radius, then a full turn (2 times pi).',
      code: `function drawBird() {
  ctx.fillStyle = '#ffcf3a';
  ctx.[[beginPath]]();
  ctx.[[arc]](bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.[[fill]]();
}` },
    { t: 0, title: 'Draw the sky, pipes and messages', code: `function draw() {
  ctx.fillStyle = '#7ec8f2';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3fa34d';
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, PIPE_W, p.top);
    ctx.fillRect(p.x, p.top + GAP, PIPE_W, H - p.top - GAP);
  });
  drawBird();
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(score, W / 2, 50);
  ctx.font = '18px sans-serif';
  if (state === 'ready') ctx.fillText('Press Space or tap to flap', W / 2, H / 2 + 60);
  if (state === 'over') ctx.fillText('Crashed! Flap to try again', W / 2, H / 2);
}` },
    { t: 1, title: 'The game loop', desc: 'The world only moves while you are playing, but the screen is drawn every frame.',
      code: `function loop() {
  if (state === 'playing') {
    [[frame++]];
    [[fall]]();
    [[updatePipes]]();
  }
  [[draw]]();
  requestAnimationFrame(loop);
}
loop();` }
  ]
},
{
  id: 'breakout', name: 'Breakout', level: 'Intermediate', bg: '#14112b', fg: '#ffa94d',
  blurb: 'Bounce the ball with your paddle to smash every brick. You have three lives.',
  controls: 'Left and right arrows move the paddle.',
  parts: [
    { t: 0, title: 'Paddle, ball and lives', code: `const paddle = { x: 160, y: 370, w: 80, h: 10 };
const ball = { x: 200, y: 300, vx: 3, vy: -4, r: 6 };
let lives = 3, score = 0;` },
    { t: 1, title: 'Build the wall of bricks', desc: 'Two loops inside each other make a grid: 5 rows, 8 bricks in each row.',
      code: `const [[bricks]] = [];
for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 8; col++) {
    bricks.[[push]]({ x: col * 50 + 2, y: row * 22 + 40, w: 46, h: 18, alive: [[true]] });
  }
}` },
    { t: 1, title: 'Move the paddle', desc: 'Slide the paddle with the arrow keys and keep it inside the screen.',
      code: `function movePaddle() {
  if (keys.[[ArrowLeft]]) paddle.x -= 7;
  if (keys.[[ArrowRight]]) paddle.x += 7;
  paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
}` },
    { t: 0, title: 'Move and bounce the ball', code: `function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x < ball.r) ball.vx = Math.abs(ball.vx);
  if (ball.x > W - ball.r) ball.vx = -Math.abs(ball.vx);
  if (ball.y < ball.r) ball.vy = Math.abs(ball.vy);
  const onPaddle = ball.y + ball.r > paddle.y && ball.y < paddle.y + paddle.h &&
    ball.x > paddle.x && ball.x < paddle.x + paddle.w;
  if (onPaddle && ball.vy > 0) {
    ball.vy = -Math.abs(ball.vy);
    ball.vx = (ball.x - (paddle.x + paddle.w / 2)) * 0.12;
  }
  if (ball.y > H) {
    lives--;
    ball.x = 200; ball.y = 300; ball.vx = 3; ball.vy = -4;
  }
}` },
    { t: 1, title: 'Smash bricks', desc: 'Check every brick. If the ball overlaps one that is still standing, break it and bounce.',
      code: `function hitBricks() {
  bricks.[[forEach]](b => {
    const inX = ball.x > b.x && ball.x < b.x + b.w;
    const inY = ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y;
    if (b.alive && inX && inY) {
      b.alive = [[false]];
      ball.vy *= -1;
      [[score]] += 10;
    }
  });
}` },
    { t: 1, title: 'Draw the bricks', desc: 'Each row gets its own colour. Math.floor(i / 8) works out which row brick i is in.',
      code: `function drawBricks() {
  const colors = ['#ff5d73', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7'];
  bricks.forEach((b, i) => {
    if (!b.alive) [[return]];
    ctx.fillStyle = colors[Math.floor(i / 8)];
    ctx.[[fillRect]](b.x, b.y, b.w, b.h);
  });
}` },
    { t: 0, title: 'Draw everything', code: `function draw() {
  ctx.fillStyle = '#14112b';
  ctx.fillRect(0, 0, W, H);
  drawBricks();
  ctx.fillStyle = '#e9ecef';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score + '   Lives: ' + lives, 10, 24);
}` },
    { t: 1, title: 'The game loop', desc: 'Lose all your lives and it is game over. Break every brick and you win.',
      code: `function loop() {
  [[movePaddle]]();
  moveBall();
  [[hitBricks]]();
  [[draw]]();
  if (lives <= 0) return gameOver('Score: ' + score);
  if (bricks.every(b => !b.alive)) return banner('You win!', 'Score: ' + score);
  requestAnimationFrame(loop);
}
loop();` }
  ]
},
{
  id: 'shooter', name: 'Space Shooter', level: 'Intermediate', bg: '#05060f', fg: '#6ee7f9',
  blurb: 'Aliens are falling from space. Zap them before they reach the bottom.',
  controls: 'Left and right arrows fly the ship. Hold Space to shoot.',
  parts: [
    { t: 0, title: 'Ship, lasers, aliens and stars', code: `const ship = { x: 200, y: 360 };
let bullets = [];
let enemies = [];
let score = 0, lives = 3, frame = 0, cooldown = 0;
const stars = [];
for (let i = 0; i < 50; i++) stars.push({ x: Math.random() * W, y: Math.random() * H });` },
    { t: 1, title: 'Fly the ship', desc: 'Move left and right with the arrows, staying inside the screen.',
      code: `function moveShip() {
  if (keys.[[ArrowLeft]]) ship.x -= 5;
  if (keys.[[ArrowRight]]) ship.x += 5;
  ship.x = Math.max(15, Math.min(W - 15, ship.x));
}` },
    { t: 1, title: 'Shoot lasers', desc: 'Holding Space fires a laser, but the cooldown stops you firing every single frame.',
      code: `function shoot() {
  [[cooldown--]];
  if (keys[' '] && cooldown <= 0) {
    bullets.[[push]]({ x: ship.x, y: ship.y - 12 });
    [[cooldown]] = 12;
  }
  bullets.forEach(b => b.y -= 8);
}` },
    { t: 1, title: 'Send in the aliens', desc: 'Every 50 frames a new alien appears at a random spot with a random speed.',
      code: `function spawnEnemies() {
  if (frame % 50 === 0) {
    enemies.[[push]]({ x: 20 + Math.random() * (W - 40), y: -20, speed: 1.5 + Math.random() * 1.5 });
  }
  enemies.[[forEach]](e => e.y += e.[[speed]]);
}` },
    { t: 0, title: 'Laser hits and escaped aliens', code: `function checkHits() {
  enemies.forEach(e => {
    bullets.forEach(b => {
      if (!e.dead && Math.abs(b.x - e.x) < 16 && Math.abs(b.y - e.y) < 14) {
        e.dead = true;
        b.y = -100;
        score++;
      }
    });
    if (!e.dead && e.y > H) {
      e.dead = true;
      lives--;
    }
  });
  enemies = enemies.filter(e => !e.dead);
  bullets = bullets.filter(b => b.y > 0);
}` },
    { t: 1, title: 'Draw the ship', desc: 'A path with three points makes a triangle: the nose, then the two back corners.',
      code: `function drawShip() {
  ctx.fillStyle = '#6ee7f9';
  ctx.beginPath();
  ctx.[[moveTo]](ship.x, ship.y - 12);
  ctx.[[lineTo]](ship.x - 15, ship.y + 10);
  ctx.lineTo(ship.x + 15, ship.y + 10);
  ctx.[[fill]]();
}` },
    { t: 0, title: 'Draw space, lasers and aliens', code: `function draw() {
  ctx.fillStyle = '#05060f';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#555c7a';
  stars.forEach(s => {
    s.y = (s.y + 1) % H;
    ctx.fillRect(s.x, s.y, 2, 2);
  });
  ctx.fillStyle = '#ffe066';
  bullets.forEach(b => ctx.fillRect(b.x - 2, b.y - 8, 4, 10));
  enemies.forEach(e => {
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(e.x - 14, e.y - 10, 28, 20);
    ctx.fillStyle = '#05060f';
    ctx.fillRect(e.x - 8, e.y - 4, 4, 4);
    ctx.fillRect(e.x + 4, e.y - 4, 4, 4);
  });
  drawShip();
  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score + '   Lives: ' + lives, 10, 24);
}` },
    { t: 1, title: 'The game loop', desc: 'Count frames, move everything, check hits, draw. Three aliens escape and it is over.',
      code: `function loop() {
  [[frame++]];
  [[moveShip]]();
  [[shoot]]();
  spawnEnemies();
  checkHits();
  [[draw]]();
  if (lives <= 0) return gameOver('Aliens zapped: ' + score);
  requestAnimationFrame(loop);
}
loop();` }
  ]
},
{
  id: 'road', name: 'Road Dodger', level: 'Intermediate', bg: '#3a3f47', fg: '#4dabf7',
  blurb: 'Switch lanes to dodge traffic. The road gets faster the longer you drive.',
  controls: 'Left and right arrows change lanes.',
  parts: [
    { t: 0, title: 'Lanes, car and traffic', code: `const LANES = [100, 200, 300];
const car = { lane: 1, y: 330 };
let traffic = [];
let speed = 4, score = 0, frame = 0, crashed = false, roadOffset = 0;` },
    { t: 1, title: 'Change lanes', desc: 'Each key press moves the car one lane. The checks stop it driving off the road.',
      code: `addEventListener('keydown', e => {
  if (e.key === '[[ArrowLeft]]' && car.lane > 0) car.lane--;
  if (e.key === '[[ArrowRight]]' && car.lane < 2) car.lane++;
});` },
    { t: 1, title: 'Add traffic', desc: 'Every 60 frames, a new car appears above the screen in a random lane.',
      code: `function [[addTraffic]]() {
  if (frame % 60 === 0) {
    const [[lane]] = Math.floor(Math.random() * 3);
    traffic.[[push]]({ lane: lane, y: -60 });
  }
}` },
    { t: 1, title: 'Drive faster', desc: 'Traffic moves down the screen. Cars that leave are removed, and the speed creeps up.',
      code: `function moveTraffic() {
  traffic.[[forEach]](t => t.y += [[speed]]);
  traffic = traffic.filter(t => t.y < H + 60);
  [[speed]] += 0.002;
  [[score++]];
}` },
    { t: 0, title: 'Check for a crash', code: `function checkCrash() {
  traffic.forEach(t => {
    if (t.lane === car.lane && Math.abs(t.y - car.y) < 55) crashed = true;
  });
}` },
    { t: 1, title: 'Draw a car', desc: 'One function draws any car. You pass in where it goes and what colour it is.',
      code: `function drawCar(x, y, [[color]]) {
  ctx.fillStyle = color;
  ctx.[[fillRect]](x - 20, y - 30, 40, 60);
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(x - 14, y - 18, 28, 14);
}` },
    { t: 0, title: 'Draw the road', code: `function draw() {
  ctx.fillStyle = '#3a3f47';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#5bb450';
  ctx.fillRect(0, 0, 40, H);
  ctx.fillRect(W - 40, 0, 40, H);
  roadOffset = (roadOffset + speed) % 40;
  ctx.fillStyle = '#f1f3f5';
  for (let y = -40 + roadOffset; y < H; y += 40) {
    ctx.fillRect(148, y, 4, 22);
    ctx.fillRect(248, y, 4, 22);
  }
  traffic.forEach(t => drawCar(LANES[t.lane], t.y, '#ff6b6b'));
  drawCar(LANES[car.lane], car.y, '#4dabf7');
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(Math.floor(score / 10) + ' m', 50, 24);
}` },
    { t: 1, title: 'The game loop', desc: 'Add, move, check, draw. One crash and the drive is over.',
      code: `function loop() {
  [[frame++]];
  [[addTraffic]]();
  moveTraffic();
  checkCrash();
  [[draw]]();
  if (crashed) return gameOver('Distance: ' + Math.floor(score / 10) + ' m');
  requestAnimationFrame(loop);
}
loop();` }
  ]
},
{
  id: 'dino', name: 'Dino Run', level: 'Intermediate', bg: '#f4f1e8', fg: '#5b8c3a',
  blurb: 'The dino runs on its own. Jump over the cactuses for as long as you can.',
  controls: 'Space, the up arrow, or a tap makes the dino jump.',
  parts: [
    { t: 0, title: 'Ground, dino and cactuses', code: `const GROUND = 330;
const dino = { x: 60, y: GROUND, w: 30, h: 36, vy: 0 };
let cactuses = [];
let speed = 5, score = 0, nextCactus = 60, over = false;` },
    { t: 1, title: 'Jump', desc: 'The dino can only jump while its feet are on the ground. -12 sends it upward.',
      code: `function [[jump]]() {
  if (dino.y >= GROUND) dino.vy = -12;
}
addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === '[[ArrowUp]]') [[jump]]();
});
[[onTap]](jump);` },
    { t: 1, title: 'Gravity', desc: 'Gravity pulls the dino back down each frame, and the ground stops it falling through.',
      code: `function [[applyGravity]]() {
  dino.[[vy]] += 0.6;
  dino.y += dino.vy;
  if (dino.y > [[GROUND]]) {
    dino.y = GROUND;
    dino.vy = 0;
  }
}` },
    { t: 1, title: 'Grow cactuses', desc: 'A countdown decides when the next cactus appears. Each one gets a random height.',
      code: `function spawnCactus() {
  [[nextCactus--]];
  if (nextCactus <= 0) {
    cactuses.[[push]]({ x: W, w: 20, h: 30 + Math.random() * 25 });
    nextCactus = 50 + Math.random() * 60;
  }
}` },
    { t: 0, title: 'Move cactuses and check hits', code: `function moveCactuses() {
  cactuses.forEach(c => c.x -= speed);
  cactuses = cactuses.filter(c => c.x + c.w > 0);
  cactuses.forEach(c => {
    const overlapX = dino.x + dino.w > c.x + 4 && dino.x < c.x + c.w - 4;
    const overlapY = dino.y > GROUND - c.h + 4;
    if (overlapX && overlapY) over = true;
  });
  speed += 0.003;
  score++;
}` },
    { t: 1, title: 'Draw the dino', desc: 'A green block for the body and a small white square for the eye.',
      code: `function drawDino() {
  ctx.fillStyle = '#5b8c3a';
  ctx.fillRect(dino.x, dino.y - dino.h, dino.w, dino.h);
  ctx.fillStyle = '[[white]]';
  ctx.[[fillRect]](dino.x + 20, dino.y - dino.h + 6, 6, 6);
}` },
    { t: 0, title: 'Draw the desert', code: `function draw() {
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#555555';
  ctx.fillRect(0, GROUND, W, 2);
  ctx.fillStyle = '#2f9e44';
  cactuses.forEach(c => ctx.fillRect(c.x, GROUND - c.h, c.w, c.h));
  drawDino();
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(String(Math.floor(score / 5)).padStart(5, '0'), W - 12, 28);
}` },
    { t: 1, title: 'The game loop', desc: 'Gravity, cactuses, draw, repeat, until the dino hits a cactus.',
      code: `function loop() {
  applyGravity();
  [[spawnCactus]]();
  moveCactuses();
  [[draw]]();
  if ([[over]]) return gameOver('Score: ' + Math.floor(score / 5));
  requestAnimationFrame(loop);
}
loop();` }
  ]
}
];

/* Words marked [[like this]] in a part are what the student types. Only their letters are typed;
   spaces, numbers and symbols are filled in. This turns the marks into letter slots. */
GAMES.forEach(g => g.parts.forEach(p => {
  if (!p.t) return;
  let code = '', inside = false;
  p.slots = [];
  for (let i = 0; i < p.code.length; i++) {
    if (p.code.startsWith('[[', i)) { inside = true; i++; continue; }
    if (p.code.startsWith(']]', i)) { inside = false; i++; continue; }
    if (inside && /[A-Za-z]/.test(p.code[i])) p.slots.push(code.length);
    code += p.code[i];
  }
  p.code = code;
  p.letters = p.slots.map(k => code[k]).join('');
}));
