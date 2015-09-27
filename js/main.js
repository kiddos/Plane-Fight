var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// constants
var WIDTH = 900;
var HEIGHT = 690;
var outbound = -40;
//var mainbg = "#59DF59";
var mainbg = "#4A4A4A";
var shouldDisplayFPS = true;
// key event constants
var KEY_UP = 38, KEY_DOWN = 40, KEY_LEFT = 37, KEY_RIGHT = 39;
var KEY_1 = 49, KEY_2 = 50, KEY_3 = 51, KEY_4 = 52, KEY_5 = 53, KEY_6 = 54;
var KEY_7 = 55, KEY_8 = 56, KEY_9 = 57, KEY_0 = 48;
var KEY_W = 87, KEY_S = 83, KEY_A = 65, KEY_D = 68;
// rocket initial speed
var ROCKET1_INIT_SPEED = 0.9;
// add a lagging effect for button key press actions
var laggingEffect = 60;


// key states and bindins
var keyState = [];
var keyBindings = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8];

// action timeout
var actionTimeout = [];


// global images resources
var buttonTimeout = new Image();
buttonTimeout.src = "./image/button_timeout.png";
var bulletImage = new Image();
bulletImage.src = "./image/bullet.png";
var rocket1Image = new Image();
rocket1Image.src = "./image/rocket1.png";
var rocket2Image = new Image();
rocket2Image.src = "./image/rocket2.png";
var laserImage = new Image();
laserImage.src = "./image/laser.png";

// fields
var buttonBar = createButtonBar();
var anim = createAnimation("./image/plane_anim.png",
		64, 64, 192, 128, 4, 400);
anim.init();
var player = createPlayer(100, 100, [anim]);
var enemy = createEnemy(450, 0);


function createAnimation(imagePath, sw, sh, iw, ih, num, updateTime) {
	return {
		image: new Image(),
		currentImage: 0,
		updateTime: null,
		sw: null,
		sh: null,
		iw: null,
		ih: null,
		row: null,
		num: null,

		init: function() {
			this.image.src = imagePath;
			if (!this.iw) this.iw = iw;
			if (!this.ih) this.ih = ih;
			if (!this.sw) this.sw = sw;
			if (!this.sh) this.sh = sh;
			if (!this.row) this.row = this.iw / this.sw;
			if (!this.num) this.num = num;
			if (!this.updateTime) this.updateTime = updateTime;
		},

		update: function (timestamp) {
			var interval = Math.round(timestamp %
					(this.num * this.updateTime));
			for (var i = 0; i < this.num * 2 - 1 ; i ++) {
				if (interval >= i * this.updateTime &&
					interval < (i+1) * this.updateTime) {
					this.currentImage = i;
				}
			}
		},

		draw: function(x, y) {
			context.drawImage(this.image,
					this.sw * Math.round(this.currentImage % this.row),
					this.sh * Math.floor(this.currentImage / this.row),
					this.sw, this.sh,
					x, y,
					this.sw, this.sh);
		}
	};
}

function createButton(x, y, width, height, imagePath, key, callback) {
	return {
		x: null,
		y: null,
		dy: 3,
		origY: null,
		shiftY: null,
		width: null,
		height: null,
		image: null,
		key: null,
		callback: null,
		pressedTime: -99999,
		percent: 1,

		init: function() {
			if (!this.x) this.x = x;
			if (!this.y) this.y = y;
			if (!this.origY) this.origY = y;
			if (!this.shiftY) this.shiftY = y + this.dy;
			if (!this.key) this.key = key;
			if (!this.width) this.width = width;
			if (!this.height) this.height = height;
			if (!this.image) {
				this.image = new Image();
				this.image.src = imagePath;
			}
			if (!this.callback) this.callback = callback;

			// TODO
			// need to fix call back calling the 'this' functions
			var leftBound = this.x;
			var rightBound = this.x + this.width;
			var topBound = this.y;
			var botBound = this.y + this.height;
			var clickHandler = function(e) {
				var bound = canvas.getBoundingClientRect();
				var x = Math.round(e.clientX - bound.left);
				var y = Math.round(e.clientY - bound.top);
				//console.log("(%d,%d)", x, y);
				//console.log("(%d,%d)", leftBound, rightBound);
				if (x >= leftBound && x <= rightBound &&
					y >= topBound && y <= botBound) {
					callback();
				}
			};
			canvas.addEventListener("click", clickHandler);

			window.addEventListener("keypress", function(e) {
				if (e.keyCode == key) {
					callback();
				}
			});
		},

		update: function(timestamp) {
			if (keyState[this.key]) {
				this.pressedTime = timestamp;
			}

			// TODO
			// need to update the gray out area
			var totalTimeout = actionTimeout[this.key];
			var currentTimeout = timestamp - this.pressedTime;
			if (currentTimeout <= totalTimeout) {
				this.percent = currentTimeout / totalTimeout;
			} else {
				this.percent = 1;
			}
		},

		draw: function() {
			context.drawImage(this.image,
					this.x, this.y,
					this.width, this.height);

			// need to draw the gray out area
			var drawingHeight = this.height * (1 - this.percent);
			context.drawImage(buttonTimeout,
					this.x, this.y + buttonBar.iconSize - drawingHeight,
					this.width, drawingHeight);
		}
	};
}

function createButtonBar() {
	return {
		padding: 8,
		iconSize: 64,
		width: null,
		height: null,
		buttons: [],

		init: function() {
			var totalWidth = this.iconSize * keyBindings.length +
					this.padding * (keyBindings.length + 1);
			var startX = (WIDTH - totalWidth) / 2;
			var startY = HEIGHT - this.iconSize;
			this.width = totalWidth;
			this.height = this.iconSize + this.padding;

			for (var i = 0 ; i < keyBindings.length ; i ++) {
				// TODO
				// need to fix the callback function call
				var callback  = function() {
					console.log("callback");
				}

				var button = createButton(
						startX + i * (this.iconSize + this.padding),
						startY, this.iconSize, this.iconSize,
						"./image/button.png", keyBindings[i],
						callback);

				button.init();
				this.buttons[i] = button;
			}

			// init action timeout
			for (var i = 0; i < keyBindings.length ; i++) {
				switch(i) {
				case 0:
					actionTimeout[keyBindings[i]] = 90;
					break;
				case 1:
					actionTimeout[keyBindings[i]] = 500;
					break;
				case 2:
					actionTimeout[keyBindings[i]] = 3000;
					break;
				case 3:
					actionTimeout[keyBindings[i]] = 300;
					break;
				case 4:
					actionTimeout[keyBindings[i]] = 30000;
					break;
				case 5:
					actionTimeout[keyBindings[i]] = 1000;
					break;
				case 6:
					actionTimeout[keyBindings[i]] = 2000;
					break;
				case 7:
					actionTimeout[keyBindings[i]] = 500;
					break;
				case 8:
					actionTimeout[keyBindings[i]] = 1000;
					break;
				case 9:
					actionTimeout[keyBindings[i]] = 2000;
					break;
				}
			}
		},

		update: function(timestamp) {
			for (var i = 0; i < this.buttons.length ; i++) {
				this.buttons[i].update(timestamp);
			}
		},

		draw: function() {
			for (var i = 0; i < this.buttons.length ; i++) {
				this.buttons[i].draw();
			}
		}
	}
}

// TODO
// create different kinds of bullets
function createBasicBullet(x, y) {
	return {
		x: x,
		y: y,
		dx: 0,
		dy: 12,
		damage: 1,

		update: function(timestamp) {
			if (this.y >= outbound)
				this.y -= this.dy;
		},

		draw: function() {
			context.drawImage(bulletImage, this.x, this.y);
		}
	};
}

function createRocket1(x, y, dx) {
	return {
		x: x,
		y: y,
		dx: dx,
		dy: -0.6,
		ax: 0.1,
		ay: 0.03,
		maxdx: 1,
		maxdy: 0.3,
		outbound: -30,
		damage: 2,
		imageWidth: rocket1Image.width,
		imageHeight: rocket1Image.height,

		update: function(timestamp) {
			if (this.x < enemy.x) {
				this.dx += this.ax;
				this.dy -= this.ay;
			} else if (this.x > enemy.x) {
				this.dx -= this.ax;
				this.dy -= this.ay;
			} else {
				this.dy += this.ay;
			}

			if (this.y >= outbound)
				this.y += this.dy;
			if (this.x >= outbound && this.x <= WIDTH - outbound)
				this.x += this.dx;
		},

		draw: function () {
			// rotate image
			var theta = Math.atan(-this.dx/this.dy);
			if (this.dy == 0) theta = 0;
			context.translate(this.x, this.y);
			context.translate(this.imageWidth/2, this.imageHeight/2);
			context.rotate(theta);
			context.drawImage(rocket1Image,
					this.imageWidth/2, this.imageHeight/2);
			context.rotate(-theta);
			context.translate(-this.imageWidth/2, -this.imageHeight/2);
			context.translate(-this.x, -this.y);
		}
	};
}

function createRocket2(x, y) {
	return {
		x: x,
		y: y,
		dy: -3,
		ay: 1,
		maxdy: 30,
		damage: 10,
		imageWidth: rocket2Image.width,
		imageHeight: rocket2Image.height,

		update: function(timestamp) {
			if (Math.abs(this.dy) <= this.maxdy)
				this.dy -= this.ay;

			if (this.y >= outbound)
				this.y += this.dy;
		},

		draw: function () {
			context.drawImage(rocket2Image,
					this.x, this.y);
		}
	};
}

function createRocket3(x, y, dx) {
	return {
		x: x,
		y: y,
		dx: 6,
		dy: 6,
		damage: 30,
		imageWidth: rocket1Image.width,
		imageHeight: rocket1Image.height,

		update: function(timestamp) {
			if (this.x < enemy.x) {
				this.dx += this.ax;
				this.dy -= this.ay;
			} else if (this.x > enemy.x) {
				this.dx -= this.ax;
				this.dy -= this.ay;
			} else {
				this.dy += this.ay;
			}

			if (this.y >= outbound)
				this.y += this.dy;
			if (this.x >= outbound && this.x <= WIDTH - outbound)
				this.x += this.dx;
		},

		draw: function () {
			// rotate image
			var theta = Math.atan(-this.dx/this.dy);
			if (this.dy == 0) theta = 0;
			context.translate(this.x, this.y);
			context.translate(this.imageWidth/2, this.imageHeight/2);
			context.rotate(theta);
			context.drawImage(rocket1Image,
					this.imageWidth/2, this.imageHeight/2);
			context.rotate(-theta);
			context.translate(-this.imageWidth/2, -this.imageHeight/2);
			context.translate(-this.x, -this.y);
		}
	};
}

function createLaser(x, y) {
	return {
		x: x,
		y: y,
		dy: -20,
		manaReduce: 30,
		imageWidth: laserImage.width,
		imageHeight: laserImage.height,

		update: function(timestamp) {
			if (this.y >= outbound)
				this.y += this.dy;
		},

		draw: function () {
			context.drawImage(laserImage,
					this.x, this.y);
		}
	};
}

function createPlayer(x, y, animations) {
	return {
		x: null,
		y: null,
		dx: 6,
		dy: 7,
		animations: null,
		bullets: null,
		rockets1: null,
		rockets2: null,
		rockets3: null,
		laser: null,
		actionTimeout: null,
		state: null,
		// action data
		bullet1X: 17,
		bullet2X: 43,
		bulletY: 14,
		rocket11X: 6,
		rocket12X: 52,
		rocket1Y: 26,
		rocket2X: 27,
		rocket2Y: 1,
		laser1X: -1,
		laser2X: 62,
		laserY: 38,
		actionSuccess: false,
		GLOBAL_COOL_DOWN: 300,
		// game data
		hp: 50,
		mana: 50,
		maxhp: 100,
		maxmana: 100,
		hpBarXPos: WIDTH - 160,
		hpBarYPos: HEIGHT - 60,
		hpBarLength: 150,
		hpBarHeight: 20,
		hpIncrement: 5,
		manaBarXPos: WIDTH - 160,
		manaBarYPos: HEIGHT - 30,
		manaBarLength: 150,
		manaBarHeight: 20,
		manaIncrement: 0.2,

		init: function() {
			this.x = x;
			this.y = y;
			this.animations = animations;
			this.bullets = [];
			this.rockets1 = [];
			this.rockets2 = [];
			this.rockets3 = [];
			this.laser = [];
			this.actionTimeout = [];
			this.state = "straight";
		},

		shootBasicBullet: function() {
			if (this.mana >= 1) {
				this.bullets.push(createBasicBullet(
						this.x + this.bullet1X, this.y + this.bulletY));
				this.bullets.push(createBasicBullet(
						this.x + this.bullet2X, this.y + this.bulletY));

				this.mana -= 1;
				this.actionSuccess = true;
			} else {
				this.actionSuccess = false;
			}
		},

		shootRocket1: function() {
			if (this.mana >= 10) {
				this.rockets1.push(createRocket1(
						this.x + this.rocket11X, this.y + this.rocket1Y,
						-ROCKET1_INIT_SPEED));
				this.rockets1.push(createRocket1(
						this.x + this.rocket12X, this.y + this.rocket1Y,
						ROCKET1_INIT_SPEED));

				this.mana -= 10;
				this.actionSuccess = true;
			} else {
				this.actionSuccess = false;
			}
		},

		shootRocket2: function () {
			if (this.mana >= 20) {
				this.rockets2.push(createRocket2(
						this.x + this.rocket2X, this.y + this.rocket2Y));

				this.actionSuccess = true;
				this.mana -= 20;
			} else {
				this.actionSuccess = false;
			}
		},

		shootRocket3: function() {
			if (this.mana >= 20) {


				this.actionSuccess = true;
				this.mana -= 20;
			} else {
				this.actionSuccess = false;
			}
		},

		shootLaser: function () {
			if (this.mana >= 1) {
				this.laser.push(createLaser(
						this.x + this.laser1X, this.y + this.laserY));
				this.laser.push(createLaser(
						this.x + this.laser2X, this.y + this.laserY));

				this.actionSuccess = true;
				this.mana -= 1;
			} else {
				this.actionSuccess = false;
			}
		},

		repair: function() {
			var newHp = this.hp + this.hpIncrement;
			if (newHp <= this.maxhp) {
				this.hp = newHp;
				this.actionSuccess = true;
			} else {
				this.actionSuccess = false;
			}
		},

		reduceCoolDown: function() {
			// code ...
		},

		summonTank: function() {
			// code ...
		},

		update: function(timestamp) {
			// TODO
			// update different animations
			var currentAnimation = this.animations[0];
			switch (this.state) {
				case "straight":
					currentAnimation = this.animations[0];
					break;
				case "left":
					currentAnimation = this.animations[0];
					break;
				case "right":
					currentAnimation = this.animations[0];
					break;
			}
			currentAnimation.update(timestamp);

			// update movement
			if (keyState[KEY_LEFT]) {
				var newX = this.x - this.dx;
				if (newX >= 0) {
					this.x = newX;
					this.state = "left";
				} else {
					this.state = "straight";
				}
			}
			if (keyState[KEY_RIGHT]) {
				var newX = this.x + this.dx;
				if (newX + currentAnimation.sw <= WIDTH) {
					this.x = newX;
					this.state = "right";
				} else {
					this.state = "straight";
				}
			}
			if (keyState[KEY_UP]) {
				var newY = this.y - this.dy;
				if (newY >= 0) {
					this.y = newY;
				}
				this.state = "straight";
			}
			if(keyState[KEY_DOWN]) {
				var newY = this.y + this.dy;
				if (newY + currentAnimation.sh <=
					HEIGHT - buttonBar.height - buttonBar.padding) {
					this.y = newY;
				}
				this.state = "straight";
			}

			// key actions
			// by design
			// only ONE key action can happen at once
			for (var i = 0 ; i < keyBindings.length ; i ++) {
				if (keyState[keyBindings[i]]) {
					if (this.actionTimeout[keyBindings[i]] == undefined ||
						timestamp - this.actionTimeout[keyBindings[i]] >=
						actionTimeout[keyBindings[i]]) {

						switch (i) {
						case 0:
							// action 0
							this.shootBasicBullet();
							break;
						case 1:
							// action 1
							this.shootRocket1();
							break;
						case 2:
							// action 2
							this.shootRocket2();
							break;
						case 3:
							// action 3
							this.shootLaser();
							break;
						case 4:
							// action 4
							this.shootRocket3();
							break;
						case 5:
							// action 5
							this.repair();
							break;
						case 6:
							// action 6
							this.reduceCoolDown();
							break;
						case 7:
							// action 7
							this.summonTank();
							break;
						}

						// if the action is performed
						// should update all other keys timestamp
						//this.actionTimeout[keyBindings[i]] = timestamp;
						if (this.actionSuccess) {
							for (var j = 0 ; j < keyBindings.length ; j ++) {
								if (i == j) {
									this.actionTimeout[keyBindings[j]] =
										timestamp;
								} //else {
									//this.actionTimeout[keyBindings[j]] =
										//timestamp -
										//actionTimeout[keyBindings[j]] +
										//actionTimeout[keyBindings[i]] +
										//laggingEffect;
									// use global cool down
									//var newTimeout = timestamp -
										//actionTimeout[keyBindings[j]] +
										//this.GLOBAL_COOL_DOWN +
										//laggingEffect;
									//if (this.actionTimeout[keyBindings[j]] >
										//newTimeout)
									//if (i != 0 && j != 3)
										//this.actionTimeout[keyBindings[j]] =
										//newTimeout;
								//}
							}
						}
						break;
					} else {
						keyState[keyBindings[i]] = false;
					}
				}
			}

			// update action objects
			// remove unwanted bullets
			for (var i = 0; i < this.bullets.length ; i++) {
				if (this.bullets[i].y <= outbound ||
					this.bullets[i].y >= HEIGHT) {
					this.bullets.splice(i, 1);
				}
			}
			// remove unwanted rockets 1
			for (var i = 0 ; i < this.rockets1.length ; i ++) {
				if (this.rockets1[i].y <= outbound ||
					this.rockets1[i].y >= HEIGHT ||
					this.rockets1[i].x <= outbound ||
					this.rockets1[i].x >= WIDTH - outbound) {
					this.rockets1.splice(i, 1);
				}
			}
			// remove unwanted rocket 3
			for (var i = 0; i < this.rockets2.length ; i++) {
				if (this.rockets2[i].y <= outbound ||
					this.rockets2[i].y >= HEIGHT) {
					this.rockets2.splice(i, 1);
				}
			}
			// remove unwanted rockets 2
			for (var i = 0 ; i < this.rockets3.length ; i ++) {
				if (this.rockets3[i].y <= outbound ||
					this.rockets3[i].y >= HEIGHT ||
					this.rockets3[i].x <= outbound ||
					this.rockets3[i].x >= WIDTH - outbound) {
					this.rockets3.splice(i, 1);
				}
			}
			// remove unwanted laser
			for (var i = 0; i < this.laser.length ; i++) {
				if (this.laser[i].y <= outbound ||
					this.laser[i].y >= HEIGHT) {
					this.laser.splice(i, 1);
				}
			}

			//console.log(this.rockets2.length);

			// update bullet movement
			for (var i = 0; i < this.bullets.length ; i++) {
				this.bullets[i].update(timestamp);
			}
			// update rocket 1 movement
			for (var i = 0; i < this.rockets1.length ; i++) {
				this.rockets1[i].update(timestamp);
			}
			// update rocket 2 movement
			for (var i = 0; i < this.rockets2.length ; i++) {
				this.rockets2[i].update(timestamp);
			}
			// update rocket 3 movement
			for (var i = 0; i < this.rockets3.length ; i++) {
				this.rockets3[i].update(timestamp);
			}
			// update laser movement
			for (var i = 0; i < this.laser.length ; i++) {
				this.laser[i].update(timestamp);
			}

			// increase mana for every update
			var newMana = this.mana + this.manaIncrement;
			if (newMana < this.maxmana)
				this.mana = newMana;
		},

		draw: function() {
			// draw bullet
			for (var i = 0; i < this.bullets.length ; i++) {
				if (this.bullets[i] != null) {
					this.bullets[i].draw();
				}
			}
			// draw rocket 1
			for (var i = 0; i < this.rockets1.length ; i++) {
				if (this.rockets1[i] != null) {
					this.rockets1[i].draw();
				}
			}
			// draw rocket 2
			for (var i = 0; i < this.rockets2.length ; i++) {
				if (this.rockets2[i] != null) {
					this.rockets2[i].draw();
				}
			}
			// draw rocket 3
			for (var i = 0; i < this.rockets3.length ; i++) {
				if (this.rockets3[i] != null) {
					this.rockets3[i].draw();
				}
			}
			// draw laser
			for (var i = 0; i < this.laser.length ; i++) {
				if (this.laser[i] != null) {
					this.laser[i].draw();
				}
			}

			// TODO
			// waiting for making new images
			// draw animation
			switch (this.state) {
				case "straight":
					this.animations[0].draw(this.x, this.y);
					break;
				case "left":
					this.animations[0].draw(this.x, this.y);
					break;
				case "right":
					this.animations[0].draw(this.x, this.y);
					break;
			}

			// draw hp bar
			context.fillStyle = "#FF3044";
			var hpl = this.hpBarLength * this.hp / this.maxhp;
			context.fillRect(this.hpBarXPos, this.hpBarYPos,
					hpl, this.hpBarHeight);

			context.fillStyle = "#13A8FF";
			var manal = this.manaBarLength * this.mana / this.maxmana;
			context.fillRect(this.manaBarXPos, this.manaBarYPos,
					manal, this.manaBarHeight);
		}
	};
}

function createEnemy(x, y) {
	return {
		x: null,
		y: null,

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
	context.fillStyle = "#FFFFFF";
	context.fillText("FPS: " + parseFloat(fps).toFixed(2), 730, 15);
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
	player.update(timestamp);
	buttonBar.update(timestamp);
}

function draw() {
	context.fillStyle = mainbg;
	context.fillRect(0, 0, WIDTH, HEIGHT);

	player.draw();

	buttonBar.draw();
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
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}

main();
