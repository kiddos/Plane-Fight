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
var KEY_7 = 55, KEY_8 = 56, KEY_9 = 57, KEY_0 = 58;
var KEY_W = 87, KEY_S = 83, KEY_A = 65, KEY_D = 68;
var keyState = [];
var keyBindings = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7,
		KEY_8, KEY_9, KEY_0];
var buttons = [];

var anim = createAnimation("./image/plane_anim.png",
		64, 64, 192, 128, 4, 400);
anim.init();
// testing
var anims = [];
anims[0] = anim;
var player = createPlayer(100, 100, anims);
player.init();


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
		width: null,
		height: null,
		image: null,
		key: null,
		callback: null,

		init: function() {
			if (!this.x) this.x = x;
			if (!this.y) this.y = y;
			if (!this.width) this.width = width;
			if (!this.height) this.height = height;
			if (!this.image) {
				this.image = new Image();
				this.image.src = imagePath;
			}
			if (!this.callback) this.callback = callback;

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

			window.addEventListener("keydown", function(event) {
				if (event.keyCode == this.key) {
					this.callback();
				}
			});
		},

		draw: function() {
			context.drawImage(this.image,
					this.x, this.y,
					this.width, this.height);
		}
	};
}

function createPlayer(x, y, animations) {
	return {
		x: null,
		y: null,
		dx: 6,
		dy: 8,
		animations: null,

		init: function() {
			this.x = x;
			this.y = y;
			this.animations = animations;
		},

		update: function(timestamp) {
			this.animations[0].update(timestamp);

			if (keyState[KEY_LEFT]) {
				this.x -= this.dx;
			}
			if (keyState[KEY_RIGHT]) {
				this.x += this.dx;
			}
			if (keyState[KEY_UP]) {
				this.y -= this.dy;
			}
			if(keyState[KEY_DOWN]) {
				this.y += this.dy;
			}
		},

		draw: function() {
			this.animations[0].draw(this.x, this.y);
		}
	};
}

function displayFPS(fps) {
	context.fillStyle = "#FFFFFF";
	context.fillText("FPS: " + parseFloat(fps).toFixed(2), 730, 15);
}

function init() {
	for (var i = 0 ; i < keyBindings.length ; i ++) {
		var callback = function () {
			console.log("button %d click", i);
		};
		button = createButton(i * 100, 500, 100, 30,
				"./image/button.png", keyBindings[i], callback);
		button.init();
		buttons[i] = button;
	}

	window.addEventListener("keydown", function(e) {
		//console.log(e.keyCode);
		keyState[e.keyCode] = true;
	});

	window.addEventListener("keyup", function(e) {
		//console.log(e.keyCode);
		keyState[e.keyCode] = false;
	});
}

function update(timestamp) {
	player.update(timestamp);
}

function draw() {
	context.fillStyle = mainbg;
	context.fillRect(0, 0, WIDTH, HEIGHT);

	player.draw();

	for (var i = 0; i < buttons.length ; i++) {
		buttons[i].draw();
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
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}

main();
