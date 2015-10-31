// canvas drawings
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// constants
var WIDTH = 900;
var HEIGHT = 690;
var outbound = -40;

// colors
var MAIN_BG_COLOR = '#4A4A4A';
var WHITE = '#FFFFFF';

// key states and bindins
var KEY_UP = 38, KEY_DOWN = 40, KEY_LEFT = 37, KEY_RIGHT = 39;
var KEY_1 = 49, KEY_2 = 50, KEY_3 = 51, KEY_4 = 52, KEY_5 = 53, KEY_6 = 54;
var KEY_7 = 55, KEY_8 = 56, KEY_9 = 57, KEY_0 = 48;
var KEY_W = 87, KEY_S = 83, KEY_A = 65, KEY_D = 68;
// add a lagging effect for button key press actions
var keyState = [];
var keyBindings = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8];

// action timeout fields
var ACTION0_TIMEOUT = 90;
var ACTION1_TIMEOUT = 500;
var ACTION2_TIMEOUT = 3000;
var ACTION3_TIMEOUT = 300;
var ACTION4_TIMEOUT = 60000;
var ACTION5_TIMEOUT = 3000;
var ACTION6_TIMEOUT = 1000;
var ACTION7_TIMEOUT = 30000;

var actionTimeout = [];
var originalActionTimeout = [];
var reducedActionTimeout = [];

actionTimeout[keyBindings[0]] = ACTION0_TIMEOUT;
actionTimeout[keyBindings[1]] = ACTION1_TIMEOUT;
actionTimeout[keyBindings[2]] = ACTION2_TIMEOUT;
actionTimeout[keyBindings[3]] = ACTION3_TIMEOUT;
actionTimeout[keyBindings[4]] = ACTION4_TIMEOUT;
actionTimeout[keyBindings[5]] = ACTION5_TIMEOUT;
actionTimeout[keyBindings[6]] = ACTION6_TIMEOUT;
actionTimeout[keyBindings[7]] = ACTION7_TIMEOUT;

originalActionTimeout[keyBindings[0]] = ACTION0_TIMEOUT;
originalActionTimeout[keyBindings[1]] = ACTION1_TIMEOUT;
originalActionTimeout[keyBindings[2]] = ACTION2_TIMEOUT;
originalActionTimeout[keyBindings[3]] = ACTION3_TIMEOUT;
originalActionTimeout[keyBindings[4]] = ACTION4_TIMEOUT;
originalActionTimeout[keyBindings[5]] = ACTION5_TIMEOUT;
originalActionTimeout[keyBindings[6]] = ACTION6_TIMEOUT;
originalActionTimeout[keyBindings[7]] = ACTION7_TIMEOUT;

reducedActionTimeout[keyBindings[0]] = ACTION0_TIMEOUT / 2;
reducedActionTimeout[keyBindings[1]] = ACTION1_TIMEOUT / 2;
reducedActionTimeout[keyBindings[2]] = ACTION2_TIMEOUT / 3;
reducedActionTimeout[keyBindings[3]] = ACTION3_TIMEOUT / 2;
reducedActionTimeout[keyBindings[4]] = ACTION4_TIMEOUT / 3;
reducedActionTimeout[keyBindings[5]] = ACTION5_TIMEOUT / 2;
reducedActionTimeout[keyBindings[6]] = ACTION6_TIMEOUT;
reducedActionTimeout[keyBindings[7]] = ACTION7_TIMEOUT / 3;

// global images resources
var buttonTimeout = new Image();
buttonTimeout.src = "./image/button_timeout.png";
var bulletImage = new Image();
bulletImage.src = "./image/bullet.png";
var rocket1Image = new Image();
rocket1Image.src = "./image/rocket1.png";
var rocket2Image = new Image();
rocket2Image.src = "./image/rocket2.png";
var rocket3Image = new Image();
rocket3Image.src = "./image/rocket3.png";
var laserImage = new Image();
laserImage.src = "./image/laser.png";
var tankBase = new Image();
tankBase.src = "./image/tankbase.png";
var tankTop = new Image();
tankTop.src = "./image/tanktop.png";
var tankBullet = new Image();
tankBullet.src = "./image/tankBullet.png";

var rocket1_eImage = new Image();
rocket1_eImage.src = "./image/rocket1_enemy.png";
var plane_enemy = new Image();
plane_enemy.src = "./image/enemy.png";

// game objects
var buttonBar = createButtonBar();
var anim = createAnimation("./image/plane_anim.png",
		64, 64, 192, 128, 4, 400);
anim.init();
var player = createPlayer(450, HEIGHT-300, [anim]);
var enemy = createEnemy(450, 0);
var robot = ai_robot(450, 50);

// FPS
var shouldDisplayFPS = true;

// modes
var MODE_PLAY = 'play';
var MODE_MENU = 'menu';
var MODE_END_GAME_STATUS = 'status';
var mode = MODE_PLAY;

// action timeout functions
function reduceActionTimeout() {
  for (var i = 0; i < keyBindings.length ; i++) {
    actionTimeout[keyBindings[i]] = reducedActionTimeout[keyBindings[i]];
  }
}

function revertActionTimout() {
  for (var i = 0; i < keyBindings.length ; i++) {
    actionTimeout[keyBindings[i]] = originalActionTimeout[keyBindings[i]];
  }
}

function createEnemy(x, y) {
  return {
    x: null,
    y: null,
    width: 64,
    height: 64,

    init: function() {
      this.x = x;
      this.y = y;
    },

    update: function() {
      // code ...
    },

    draw: function() {
      // code ...
    }
  };
}

function displayFPS(fps) {
  context.fillStyle = WHITE;
  context.fillText('FPS: ' + parseFloat(fps).toFixed(2), 730, 15);
}

function init() {
  player.init();
  enemy.init();

  buttonBar.init();

  window.addEventListener("keydown", function(e) {
    //console.log(e.keyCode);
    switch(e.keyCode) {
      case KEY_UP:
      case KEY_DOWN:
      case KEY_LEFT:
      case KEY_RIGHT:
        keyState[e.keyCode] = true;
        break;
    }
  });

  window.addEventListener("keyup", function(e) {
    //console.log(e.keyCode);
    switch(e.keyCode) {
      case KEY_UP:
      case KEY_DOWN:
      case KEY_LEFT:
      case KEY_RIGHT:
        keyState[e.keyCode] = false;
      break;
      default:
        keyState[e.keyCode] = true;
      break;
    }
  });
}

function update(timestamp) {
  if (mode === MODE_PLAY) {
    player.update(timestamp);
    buttonBar.update(timestamp);
    robot.update();
  }
}

function draw() {
  if (mode === MODE_PLAY) {
    context.fillStyle = MAIN_BG_COLOR;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    robot.draw();
    player.draw();

    buttonBar.draw();
  }
}

function main(arg) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  init();

  var frames = 0;
  var loop = function(timestamp) {
    update(timestamp);
    draw();

    // display fps
    if (shouldDisplayFPS) {
      var fps = 1.0 * frames / timestamp * 1000;
      frames ++;
      if (frames < 0) {
        frames = 0;
      }
      displayFPS(fps);
    }
    setTimeout(function() {
      window.requestAnimationFrame(loop);
    }, 23);
  };
  window.requestAnimationFrame(loop);
}

main();
