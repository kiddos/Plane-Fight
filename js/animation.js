// animation object
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
