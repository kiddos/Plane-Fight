var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var WIDTH = 900;
var HEIGHT = 660;
//var mainbg = "#59DF59";
var mainbg = "#4A4A4A";
var shouldDisplayFPS = true;

canvas.width = WIDTH;
canvas.height = HEIGHT;


var anim = createAnimation("./image/plane_anim.png",
		64, 64, 192, 128, 4, 400);
anim.init()

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

function createPlayer(x, y) {
	return {
		x: null,
		y: null,
		speed: 10,

		init: function() {
			this.x = x;
			this.y = y;
		},

		update: function(timestamp) {
			// code
		},

		draw: function() {
			// code
		}
	};
}

function displayFPS(fps) {
	context.fillStyle = "#FFFFFF";
	context.fillText("FPS: " + parseFloat(fps).toFixed(2), 730, 15);
}

function init() {
	// code ...
}

function update(timestamp) {
	anim.update(timestamp);
}

function draw() {
	context.fillStyle = mainbg;
	context.fillRect(0, 0, WIDTH, HEIGHT);

	anim.draw(100, 100);
}


function main(arg) {
	init();

	var frames = 0;
	var loop = function(timestamp) {

		update(timestamp);
		draw();

		// display fps
		if (shouldDisplayFPS) {
			var fps = 1.0 * frames / timestamp * 1000;
			frames ++;
			if (frames < 100) {
				// code ...
			}
			displayFPS(fps);
		}
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}

main();

