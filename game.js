kontra.init();

const { drawText } = new DrawFont(kontra.context);
const { toggleMusic } = new GameMusic();

const CANVAS_WIDTH = kontra.canvas.width;
const CANVAS_HEIGHT = kontra.canvas.height;
const PLAYER_SIZE = 20;
const PLAYER_COLOR = '#3498db';
const ENEMY_COLOR = '#e74c3c';
const COIN_COLOR = '#f1c40f';
const TEXT_COLOR = '#ecf0f1';

let powerUpTimeout = null;
let powerUpInterval = null;

const state = {
  bestScore: localStorage.getItem('b.best') || 0,
	score: 0,
	gravity: 0.9,
  speed: 1,
  pui: 0,
  muted: false,
  freeze: false
};

const powerUps = {
  ghost: {
    color: '#95a5a6',
    start() {
      state.speed *= 2;
    },
    end() {
      state.speed /= 2;
    }
  },
  sizeUp: {
    color: '#2ecc71',
    start() {
      const radius = players.get('radius');
      players.set('radius', radius * 1.5);
      players.set('image', createImage(radius * 3));
    },
    end() {
      const radius = players.get('radius');
      players.set('radius', radius / 1.5);
      players.set('image', createImage(radius / 1.5 * 2));
    }
  },
  breed: {
    color: PLAYER_COLOR
  },
  kill: {
    color: '#9b59b6'
  }
};

const menuTexts = [
  ['FLYING', 35, 63, 90, '#37516a'],
  ['BUBBLES', 33, 55, 343, '#37516a'],
  ['CODE . GAME DESIGN . MUSIC BY DOGAGENC', 2, 343, 585, 'rgba(255,255,255,0.25)'], 
  ['BUBBLES', 5, 433, 95, TEXT_COLOR],
  ['. SCORE UP', 3, 442, 135, COIN_COLOR],
  ['. DO NOT TOUCH', 3, 419, 165, ENEMY_COLOR],
  ['POWER-UPS', 5, 408, 225, TEXT_COLOR],
  ['. BREED', 3, 458, 265, PLAYER_COLOR],
  ['. SIZE UP', 3, 445, 295, powerUps.sizeUp.color],
  ['. GHOST MODE', 3, 425, 325, powerUps.ghost.color],
  ['. KILL EM ALL', 3, 423, 355, powerUps.kill.color],
  ['CONTROLS', 5, 421, 415, TEXT_COLOR],
  ['SPACE > PLAY', 3, 432, 455, 'rgba(255,255,255,0.7)'],
  ['M > MUSIC ON/OFF', 3, 399, 485, 'rgba(255,255,255,0.7)']
];

const applyPowerUp = powerUpName => {
  const specialPowerUps = {
    breed: () => players.breed(),
    kill: () => enemies.items = []
  };

  if (specialPowerUps[powerUpName])
    return specialPowerUps[powerUpName]();

  let powerUp = players.get('powerUp');

  if (powerUp) {
    powerUps[powerUp].end();
  }

  clearTimeout(powerUpTimeout);
  clearInterval(powerUpInterval);
  state.pui = 0;

  powerUp = powerUps[powerUpName];
  players.set('color', powerUp.color);
  players.set('powerUp', powerUpName);
  
  if (!powerUp.start) return;

  powerUp.start();

  powerUpInterval = setInterval(() => {
    state.pui++;
  }, 1000);

  powerUpTimeout = setTimeout(() => {
    if (players.get('powerUp') !== powerUpName) return;

    powerUp.end();
    players.set('color', PLAYER_COLOR);
    players.set('powerUp', null);
  }, 10000);
};

const createImage = (size, canvas)  => {
  const image = canvas || document.createElement('canvas');
  const ctx = image.getContext('2d');
  ctx.filter = 'blur(3px)';
  ctx.drawImage(bubble, 0, 0, size, size);

  return image;
};

const drawCircle = (context, x, y, radius, color) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
};

function render() {
  drawCircle(this.context, this.x, this.y, this.radius, this.color);
  this.context.drawImage(this.image, this.x - this.radius, this.y - this.radius);
};

function collidesWith (object) {
  const dx = this.x - object.x;
  const dy = this.y - object.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < this.radius + object.radius;
};

function update () {
  this.advance();

  if (!this.gravity) return;
  
  this.dy += state.gravity * PLAYER_SIZE / this.radius / 2;
  this.dy *= 0.9;

  if (this.y - this.radius > CANVAS_HEIGHT)
      this.y = 0;
  else if (this.y + this.radius < 0)
      this.y = CANVAS_HEIGHT + this.radius;
}

class SpriteGroup {
  constructor(opts) {
    this.opts = opts;
    this.items = [];
  }

  createOne() {
    const size = Array.isArray(this.opts.size) ?
      Math.max(Math.random() * this.opts.size[1], this.opts.size[0]) :
      this.opts.size; 

    const spriteOpts = {
      radius: size / 2,
      x: CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      dx: -this.opts.speed * state.speed,
      color: this.opts.color,
      image: createImage(size),
      gravity: this.opts.gravity,
      render,
      collidesWith,
      update
    };

    if (this.opts.powerUps && Math.random() < this.opts.powerUpRate) {
      const randomIdx = Math.floor(this.opts.powerUps.length * Math.random());
      const powerUpName = this.opts.powerUps[randomIdx];
      const powerUp = powerUps[powerUpName];

      spriteOpts.color = powerUp.color;
      spriteOpts.powerUp = powerUpName;
    }
    
    this.items.push(
      kontra.sprite(spriteOpts)
    );
  }

  render() {
    this.items.forEach(item => item.render());
  }

  update() {
    this.items.forEach((item, idx) => {
      item.update();

      item.dx = -this.opts.speed * state.speed;

      if (item.x + (item.radius / 2) < 0)
        this.items.splice(idx, 1);

      if (!this.opts.onColusion) return;
      
      const collPlayers = players.collidesWith(item);

      if (collPlayers.length) {
        this.opts.onColusion({ item, idx, collPlayers });
      }
    });

    if (Math.random() < this.opts.creationRate * state.speed)
      this.createOne();
  }
}

class Players {
  constructor(opts) {
    this.opts = opts;
    this.items = [];
    this.createOne();
  }

  createOne(y) {
    let opts = this.opts;

    if (y) {
      opts = {
        ...opts,
        color: this.get('color'),
        radius: this.get('radius'),
        image: this.get('image'),
        powerUp: this.get('powerUp'),
        y
      };
    }

    this.items.push(
      kontra.sprite(opts)
    );
  }

  get(prop) {
    return this.items[0][prop];
  }

  set(prop, value) {
    this.items.forEach(item => item[prop] = value);
  }

  render() {
    this.items.forEach(item => item.render());
  }

  update() {
    this.items.forEach(item => item.update());
  }

  breed() {
    const maxY = this.items.reduce((y, item) => Math.max(item.y, y), 0);
    
    this.createOne(maxY + (6 * this.get('radius')) * -state.gravity);
  }

  collidesWith(object) {
    return this.items.reduce((colls, item, idx) => {
      if (item.collidesWith(object))
        colls.push({ item, idx });

      return colls;
    }, []);
  }
}

const score = kontra.sprite({
  render() {
    const padRight = String(state.bestScore).length * 20;
    const scoreColor = !state.playing && !state.freeze ?
      'rgba(255,255,255,.5)' :
      'rgba(0,0,0,.5)';

    const scores = [
      [`SCORE: ${state.score}`, 5, 5, 5, scoreColor],
      [`BEST: ${state.bestScore}`, 5, 905 - padRight, 5, scoreColor]
    ];

    if (players.get('powerUp') && state.pui < 11)
      scores.push([`${10 - state.pui}`, 5, 5, CANVAS_HEIGHT / 2 - 12, players.get('color')]);

    scores.forEach(score => drawText(...score));
  }
});

const menu = kontra.sprite({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  x: 0,
  y: 0,
  color: '#34495e',
  render() {
    this.draw();

    menuTexts.forEach(text => drawText(...text));
  }
});

const players = new Players({
  radius: PLAYER_SIZE / 2,
	x: 50,
  y: 50,
  color: PLAYER_COLOR,
  image: createImage(PLAYER_SIZE),
  gravity: true,
  powerUp: null,
  render,
  collidesWith,
  update
});

const enemies = new SpriteGroup({
  size: [30, 100],
  color: ENEMY_COLOR,
  speed: 6,
  gravity: true,
  creationRate: 0.02,
  onColusion({ collPlayers }) {
    if (players.get('powerUp') === 'ghost') return;

    collPlayers.forEach(p => {
      if (players.items.length > 1)
        players.items.splice(p.idx, 1);
      else {
        state.playing = false;
        state.freeze = true;
        
        setTimeout(() => {
          state.freeze = false;
          resetGame();
        }, 600);
      }
    });
  }
});

const rewards = new SpriteGroup({
  size: 30,
  color: COIN_COLOR,
  speed: 5,
  creationRate: 0.03,
  powerUps: ['ghost', 'sizeUp', 'breed', 'kill'],
  powerUpRate: 0.1,
  onColusion({ item, idx }) {
    state.score++;
    rewards.items.splice(idx, 1);

    if (state.score % 10 === 0)
      state.speed += 0.2;

    if (item.powerUp)
      applyPowerUp(item.powerUp);
  }
});

const resetGame = () => {
  state.gravity = 0.9;
  state.pui = 0;
  state.speed = 1;
  enemies.items = [];
  rewards.items = [];
  players.items = [];
  players.createOne();
  state.bestScore = Math.max(state.score, state.bestScore);
  localStorage.setItem('b.best', state.bestScore);
  clearInterval(powerUpInterval);
};

kontra.keys.bind('space', () => {
  if (!state.playing && !state.freeze) {
    state.playing = true;
    state.score = 0;
    return;
  }
  state.gravity *= -1;
});

kontra.keys.bind('m', () => toggleMusic());

const loop = kontra.gameLoop({
	update() {
    if (!state.playing) return;

    players.update();
    enemies.update();
    rewards.update();
  },
  render() {
    players.render();
    enemies.render();
    rewards.render();

    if (!state.playing && !state.freeze)
      menu.render();

    score.render();
  }
});

toggleMusic();
loop.start();
