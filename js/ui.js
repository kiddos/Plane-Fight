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
  var callback = function() {
    console.log('call back');
  };

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

        var button = createButton(
            startX + i * (this.iconSize + this.padding),
            startY, this.iconSize, this.iconSize,
            "./image/button.png", keyBindings[i],
            callback);

        button.init();
        this.buttons[i] = button;
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
  };
}
