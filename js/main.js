var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var WIDTH = 900;
var HEIGHT = 660;
//var mainbg = "#59DF59";
var mainbg = "#4A4A4A";
var shouldDisplayFPS = true;
// key event constants
var KEY_UP = 38, KEY_DOWN = 40, KEY_LEFT = 37, KEY_RIGHT = 39;
var KEY_1 = 49, KEY_2 = 50, KEY_3 = 51, KEY_4 = 52, KEY_5 = 53, KEY_6 = 54;
var KEY_7 = 55, KEY_8 = 56, KEY_9 = 57, KEY_0 = 48;
var KEY_W = 87, KEY_S = 83, KEY_A = 65, KEY_D = 68;

// key states and bindins
var keyState = [];
var keyBindings = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7,
		KEY_8, KEY_9, KEY_0];

// action timeout
var actionTimeout = [];


// global images resources
var bulletImage = new Image();
bulletImage.src = "./image/bullet.png";

// fields
var buttonBar = createButtonBar();
var anim = createAnimation("./image/plane_anim.png",
		64, 64, 192, 128, 4, 400);
anim.init();
// testing
var player = createPlayer(100, 100, [anim]);


function createAnimation(imagePath, sw, sh, iw, ih, num, updateTime) {
	return {
		image: new Image(),
		currentImage: 0,
		updateTime: null,
		iw: null,
		ih: null,
		sw: null,
		sh: null,
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
		percent: 0,

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
				this.percent = 0;
			}
		},

		draw: function() {
			context.drawImage(this.image,
					this.x, this.y,
					this.width, this.height);

			// TODO
			// need to draw the gray out area
			context.fillStyle = "#42424266";
			context.fillRect(this.x, this.y, this.width,
					this.height * this.percent);
		}
	};
}

function createButtonBar() {
	return {
		x: null,
		y: null,
		buttons: [],

		init: function() {
			for (var i = 0 ; i < keyBindings.length ; i ++) {
				var callback  = function() {
					console.log("callback");
				}
				var button = createButton(i * 70, 630, 70, 30,
						"./image/button.png", keyBindings[i],
						callback);
				button.init();
				this.buttons[i] = button;
			}

			// action timeout
			for (var i = 0; i < keyBindings.length ; i++) {
				actionTimeout[keyBindings[i]] = 200;
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

function createBullet(x, y) {
	return {
		x: x,
		y: y,
		dx: 0,
		dy: 12,

		update: function(timestamp) {
			if (this.y >= -20)
				this.y -= this.dy;
		},

		draw: function() {
			context.drawImage(bulletImage, this.x, this.y);
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
		actionTimeout: null,
		state: null,

		init: function() {
			this.x = x;
			this.y = y;
			this.animations = animations;
			this.bullets = [];
			this.actionTimeout = [];
			this.state = "straight";
		},

		shootBasicBullet: function() {
			this.bullets.push(createBullet(this.x+17, this.y+14));
			this.bullets.push(createBullet(this.x+43, this.y+14));
		},

		update: function(timestamp) {
			this.animations[0].update(timestamp);

			if (keyState[KEY_LEFT]) {
				this.x -= this.dx;
				this.state = "left";
			}
			if (keyState[KEY_RIGHT]) {
				this.x += this.dx;
				this.state = "right";
			}
			if (keyState[KEY_UP]) {
				this.y -= this.dy;
				this.state = "straight";
			}
			if(keyState[KEY_DOWN]) {
				this.y += this.dy;
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
							this.shootBasicBullet();
							break;
						case 2:
							// action 2
							break;
						case 3:
							// action 3
							break;
						case 4:
							// action 4
							break;
						case 5:
							// action 5
							break;
						case 6:
							// action 6
							break;
						case 7:
							// action 7
							break;
						case 8:
							// action 8
							break;
						case 9:
							// action 9
							break;
						}

						// should update all other keys timestamp
						//this.actionTimeout[keyBindings[i]] = timestamp;
						for (var j = 0 ; j < keyBindings.length ; j ++) {
							this.actionTimeout[keyBindings[j]] = timestamp;
						}
						//keyState[keyBindings[i]] = false;
						break;
					} else {
						keyState[keyBindings[i]] = false;
					}
				}
			}


			// remove unwanted bullets
			for (var i = 0; i < this.bullets.length ; i++) {
				if (this.bullets[i].y <= -20 ||
					this.bullets[i].y >= HEIGHT) {
					this.bullets.splice(i, 1);
				}
			}

			// update bullet movement
			for (var i = 0; i < this.bullets.length ; i++) {
				this.bullets[i].update(timestamp);
			}
		},

		draw: function() {
			// TODO
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

			// draw bullet
			for (var i = 0; i < this.bullets.length ; i++) {
				if (this.bullets[i] != null) {
					this.bullets[i].draw();
				}
			}
		}
	};
}

function displayFPS(fps) {
	context.fillStyle = "#FFFFFF";
	context.fillText("FPS: " + parseFloat(fps).toFixed(2), 730, 15);
}

function init() {
	player.init();

	buttonBar.init();
	createButtonBar();

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
