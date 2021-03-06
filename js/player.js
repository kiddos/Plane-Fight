// constants
var HP_BAR_COLOR = '#FF3044';
var MANA_BAR_COLOR = '#13A8FF';
var ROCKET1_INIT_DIRECTION = Math.PI / 10;
var FLYING_MODE_STRAIGHT = 'straight';
var FLYING_MODE_LEFT = 'left';
var FLYING_MODE_RIGHT = 'right';

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

function createRocket1(x, y, direction) {
  return {
    x: x,
    y: y,
    dx: 0,
    dy: 0,
    direction: direction,
    delta: Math.PI / 200,
    maxSpeed: -6,
    outbound: -30,
    damage: 2,

    update: function(timestamp) {
      // TODO
      // enemy width/height variable may need to change
      var targetDirection = Math.atan(
          (this.x-enemy.x-enemy.width/2)/(this.y-enemy.y-enemy.height/2));
      if (targetDirection > this.direction) {
        this.direction += this.delta;
      } else if (targetDirection < this.direction) {
        this.direction -= this.delta;
      }

      this.dx = this.maxSpeed * Math.sin(this.direction);
      this.dy = this.maxSpeed * Math.cos(this.direction);

      if (this.y >= outbound)
        this.y += this.dy;
      if (this.x >= outbound && this.x <= WIDTH - outbound)
        this.x += this.dx;
    },

    draw: function () {
      drawRotation(rocket1Image, this.x, this.y, -this.direction);
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

    update: function(timestamp) {
      if (Math.abs(this.dy) <= this.maxdy)
        this.dy -= this.ay;

      if (this.y >= outbound)
        this.y += this.dy;
    },

    draw: function () {
      context.drawImage(rocket2Image, this.x, this.y);
    }
  };
}

function createRocket3(x, y) {
  return {
    x: x,
    y: y,
    dx: 0,
    dy: 0,
    damage: 30,
    direction: 0,
    delta: Math.PI / 100,
    maxSpeed: -10,
    imageWidth: rocket3Image.width,
    imageHeight: rocket3Image.height,

    update: function(timestamp) {
      // TODO
      // enemy width/height variable may need to change
      var targetDirection = Math.atan(
          (this.x+this.imageWidth/2-enemy.x-enemy.width/2) /
          (this.y-enemy.y-enemy.height/2));

      if (targetDirection > this.direction) {
        this.direction += this.delta;
      } else if (targetDirection < this.direction) {
        this.direction -= this.delta;
      }

      this.dx = this.maxSpeed * Math.sin(this.direction);
      this.dy = this.maxSpeed * Math.cos(this.direction);

      if (this.x >= outbound && this.x <= WIDTH - outbound) {
        this.x += this.dx;
      }

      if (this.y >= outbound)
        this.y += this.dy;
    },

    draw: function () {
      drawRotation(rocket3Image, this.x, this.y, -this.direction);
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

function createTankBullet(x, y, d) {
  return {
    x: x,
    y: y,
    dx: 0,
    dy: 0,
    direction: d,
    speed: 6,

    update: function (timestamp) {
      this.dx = this.speed * Math.sin(this.direction);
      this.dy = -this.speed * Math.cos(this.direction);

      if (this.x >= outbound && this.x <= WIDTH - outbound)
        this.x += this.dx;
      if (this.y >= outbound && this.y <= HEIGHT - outbound)
        this.y += this.dy;
    },

    draw: function () {
      context.drawImage(tankBullet, this.x, this.y);
    }
  };
}

function createTank(x, y) {
  return {
    x: x,
    y: y,
    theta: 0,
    delta: Math.PI / 100,
    baseCenterX: tankBase.width / 2,
    baseCenterY: tankBase.height / 2 + 3,
    topCenterX: tankTop.width/2,
    topCenterY: tankTop.height - tankTop.width/2,
    topHeight: tankTop.height,
    tankBullets: [],
    shootTime: -0,
    shootTimeout: 5000,

    update: function(timestamp) {
      // TODO
      // enemy width/height variable may need to change
      var dx = this.x + this.topCenterX - enemy.x;
      var dy = this.y + this.topCenterY - enemy.y;
      //var dx = this.x + this.topCenterX - enemy.p.x;
      //var dy = this.y + this.topCenterY - enemy.p.y;
      var direction = 0;
      if (dy === 0) {
        direction = dx > 0 ? Math.PI/2 : -Math.PI/2;
      } else {
        direction = Math.atan(-dx / dy);
      }

      if (direction !== 0) {
        if (direction < this.theta) {
          this.theta -= this.delta;
        } else {
          this.theta += this.delta;
        }
      }

      // if cool down is up
      // shoot one bullet
      if (timestamp - this.shootTime >= this.shootTimeout) {
        this.tankBullets.push(createTankBullet(
            this.x + this.topCenterX,
            this.y + this.topCenterY, this.theta));
        this.shootTime = timestamp;
      }

      // update tank bullets
      for (var i = 0; i < this.tankBullets.length ; i++) {
        this.tankBullets[i].update(timestamp);
      }

      // remove unwanted tank bullets
      for (var j = 0 ; j < this.tankBullets.length ; j ++) {
        if (this.tankBullets[j].y <= outbound ||
            this.tankBullets[j].y >= HEIGHT ||
            this.tankBullets[j].x <= outbound ||
            this.tankBullets[j].x >= WIDTH - outbound) {
          this.tankBullets.splice(j, 1);
        }
      }

      //console.log(this.tankBullets.length);
    },

    draw: function () {
      // draw tank's bullets
      for (var i = 0; i < this.tankBullets.length ; i++) {
        if (this.tankBullets[i] !== null) {
          this.tankBullets[i].draw();
        }
      }

      // draw tank base
      context.drawImage(tankBase, this.x, this.y);
      // rotate the top and draw
      context.translate(this.x, this.y);
      context.translate(this.baseCenterX, this.baseCenterY);
      context.rotate(this.theta);
      context.drawImage(tankTop,
          -this.topCenterX, -this.topCenterY);
      context.rotate(-this.theta);
      context.translate(-this.baseCenterX, -this.baseCenterY);
      context.translate(-this.x, -this.y);
    }
  };
}

function createPlayer(x, y, animations) {
  return {
    x: null,
    y: null,
    width: 64,
    height: 64,
    dx: 6,
    dy: 7,
    animations: null,
    bullets: null,
    rockets1: null,
    rockets2: null,
    rockets3: null,
    laser: null,
    tanks: null,
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
    rocket3X: 27,
    rocket3Y: 1,
    actionSuccess: false,
    GLOBAL_COOL_DOWN: 300,
    reduceTimeout: -20000,
    reduceChanged: false,
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
    manaIncrement: 0.36,

    init: function() {
      this.x = x;
      this.y = y;
      this.animations = animations;
      this.bullets = [];
      this.rockets1 = [];
      this.rockets2 = [];
      this.rockets3 = [];
      this.laser = [];
      this.tanks = [];
      this.actionTimeout = [];
      this.state = FLYING_MODE_STRAIGHT;
    },

    shootBasicBullet: function() {
      var manaCost = 1;
      if (this.mana >= manaCost) {
        this.bullets.push(createBasicBullet(
            this.x + this.bullet1X, this.y + this.bulletY));
        this.bullets.push(createBasicBullet(
            this.x + this.bullet2X, this.y + this.bulletY));

        this.mana -= manaCost;
        this.actionSuccess = true;
      } else {
        this.actionSuccess = false;
      }
    },

    shootRocket1: function() {
      var manaCost = 10;
      if (this.mana >= manaCost) {
        this.rockets1.push(createRocket1(
            this.x + this.rocket11X, this.y + this.rocket1Y,
            ROCKET1_INIT_DIRECTION));
        this.rockets1.push(createRocket1(
            this.x + this.rocket12X, this.y + this.rocket1Y,
            -ROCKET1_INIT_DIRECTION));

        this.mana -= manaCost;
        this.actionSuccess = true;
      } else {
        this.actionSuccess = false;
      }
    },

    shootRocket2: function () {
      var manaCost = 20;
      if (this.mana >= manaCost) {
        this.rockets2.push(createRocket2(
            this.x + this.rocket2X, this.y + this.rocket2Y));

        this.actionSuccess = true;
        this.mana -= manaCost;
      } else {
        this.actionSuccess = false;
      }
    },

    shootRocket3: function() {
      var manaCost = 20;
      if (this.mana >= manaCost) {
        this.rockets3.push(
            createRocket3(this.x+this.rocket3X, this.y+this.rocket3Y));

        this.actionSuccess = true;
        this.mana -= manaCost;
      } else {
        this.actionSuccess = false;
      }
    },

    shootLaser: function () {
      var manaCost = 1;
      if (this.mana >= manaCost) {
        this.laser.push(createLaser(
            this.x + this.laser1X, this.y + this.laserY));
        this.laser.push(createLaser(
            this.x + this.laser2X, this.y + this.laserY));

        this.actionSuccess = true;
        this.mana -= manaCost;
      } else {
        this.actionSuccess = false;
      }
    },

    repair: function() {
      var manaCost = 30;
      if (this.mana >= manaCost) {
        var newHp = this.hp + this.hpIncrement;
        if (newHp <= this.maxhp) {
          this.hp = newHp;
          this.actionSuccess = true;
          this.mana -= manaCost;
        } else {
          this.actionSuccess = false;
        }
      } else {
        this.actionSuccess = false;
      }
    },

    reduceCoolDown: function(timestamp) {
      var manaCost = 50;
      if (this.mana >= manaCost) {
        reduceActionTimeout();
        //console.log("reduce cd");

        this.actionSuccess = true;
        this.mana -= manaCost;

        this.reduceChanged = true;
        this.reduceTimeout = timestamp;
      } else {
        this.actionSuccess = false;
      }
    },

    summonTank: function() {
      var manaCost = 50;
      if (this.mana >= manaCost) {
        this.tanks.push(createTank(this.x, this.y));

        this.actionSuccess = true;
        this.mana -= manaCost;
      } else {
        this.actionSuccess = false;
      }
    },

    update: function(timestamp) {
      // TODO
      // need to create more animations for different movement
      // update different animations
      var currentAnimation = this.animations[0];
      switch (this.state) {
          case FLYING_MODE_STRAIGHT:
              currentAnimation = this.animations[0];
              break;
          case FLYING_MODE_LEFT:
              currentAnimation = this.animations[0];
              break;
          case FLYING_MODE_RIGHT:
              currentAnimation = this.animations[0];
              break;
      }
      currentAnimation.update(timestamp);

      var newX = 0;
      // update movement
      if (keyState[KEY_LEFT]) {
        newX = this.x - this.dx;
        if (newX >= 0) {
          this.x = newX;
          this.state = FLYING_MODE_LEFT;
        } else {
          this.state = FLYING_MODE_STRAIGHT;
        }
      }
      if (keyState[KEY_RIGHT]) {
        newX = this.x + this.dx;
        if (newX + currentAnimation.sw <= WIDTH) {
          this.x = newX;
          this.state = FLYING_MODE_RIGHT;
        } else {
          this.state = FLYING_MODE_STRAIGHT;
        }
      }
      if (keyState[KEY_UP]) {
        newY = this.y - this.dy;
        if (newY >= 0) {
          this.y = newY;
        }
        this.state = FLYING_MODE_STRAIGHT;
      }
      if(keyState[KEY_DOWN]) {
        newY = this.y + this.dy;
        if (newY + currentAnimation.sh <=
            HEIGHT - buttonBar.height - buttonBar.padding) {
          this.y = newY;
        }
        this.state = FLYING_MODE_STRAIGHT;
      }

      // key actions
      // by design
      // only ONE key action can happen at once
      var i;
      for (i = 0 ; i < keyBindings.length ; i ++) {
        if (keyState[keyBindings[i]]) {
          if (this.actionTimeout[keyBindings[i]] === undefined ||
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
                this.reduceCoolDown(timestamp);
                break;
              case 7:
                // action 7
                this.summonTank();
                break;
            }

            // if the action is performed
            // should update all other keys timestamp
            if (this.actionSuccess) {
              for (var j = 0 ; j < keyBindings.length ; j ++) {
                if (i == j) {
                  this.actionTimeout[keyBindings[j]] =
                    timestamp;
                }
              }
            }
          } else {
            keyState[keyBindings[i]] = false;
          }
        }
      }

      // update action objects
      // remove unwanted bullets
      for (i = 0; i < this.bullets.length ; i++) {
        if (this.bullets[i].y <= outbound ||
            this.bullets[i].y >= HEIGHT) {
          this.bullets.splice(i, 1);
        }
      }
      // remove unwanted rockets 1
      for (i = 0 ; i < this.rockets1.length ; i ++) {
        if (this.rockets1[i].y <= outbound ||
            this.rockets1[i].y >= HEIGHT ||
            this.rockets1[i].x <= outbound ||
            this.rockets1[i].x >= WIDTH - outbound) {
          this.rockets1.splice(i, 1);
        }
      }
      // remove unwanted rocket 3
      for (i = 0; i < this.rockets2.length ; i++) {
        if (this.rockets2[i].y <= outbound ||
            this.rockets2[i].y >= HEIGHT) {
          this.rockets2.splice(i, 1);
        }
      }
      // remove unwanted rockets 2
      for (i = 0 ; i < this.rockets3.length ; i ++) {
        if (this.rockets3[i].y <= outbound ||
            this.rockets3[i].y >= HEIGHT ||
            this.rockets3[i].x <= outbound ||
            this.rockets3[i].x >= WIDTH - outbound) {
          this.rockets3.splice(i, 1);
        }
      }
      // remove unwanted laser
      for (i = 0; i < this.laser.length ; i++) {
        if (this.laser[i].y <= outbound ||
            this.laser[i].y >= HEIGHT) {
          this.laser.splice(i, 1);
        }
      }

      //console.log(this.rockets2.length);

      // update bullet movement
      for (i = 0; i < this.bullets.length ; i++) {
        this.bullets[i].update(timestamp);
      }
      // update rocket 1 movement
      for (i = 0; i < this.rockets1.length ; i++) {
        this.rockets1[i].update(timestamp);
      }
      // update rocket 2 movement
      for (i = 0; i < this.rockets2.length ; i++) {
        this.rockets2[i].update(timestamp);
      }
      // update rocket 3 movement
      for (i = 0; i < this.rockets3.length ; i++) {
        this.rockets3[i].update(timestamp);
      }
      // update laser movement
      for (i = 0; i < this.laser.length ; i++) {
        this.laser[i].update(timestamp);
      }
      // update tanks
      for (i = 0; i < this.tanks.length ; i++) {
        this.tanks[i].update(timestamp);
      }

      // increase mana for every update
      var newMana = this.mana + this.manaIncrement;
      if (newMana < this.maxmana)
        this.mana = newMana;

      // revert the cool down reduction when timeout
      if ((timestamp - this.reduceTimeout > 10000) &&
          this.reduceChanged) {
        this.reduceChanged = false;

        //console.log("cd change back");
        revertActionTimout();
      }
    },

    draw: function() {
      // draw bullet
      var i;
      for (i = 0; i < this.bullets.length ; i++) {
        if (this.bullets[i] !== null) {
          this.bullets[i].draw();
        }
      }
      // draw rocket 1
      for (i = 0; i < this.rockets1.length ; i++) {
        if (this.rockets1[i] !== null) {
          this.rockets1[i].draw();
        }
      }
      // draw rocket 2
      for (i = 0; i < this.rockets2.length ; i++) {
        if (this.rockets2[i] !== null) {
          this.rockets2[i].draw();
        }
      }
      // draw rocket 3
      for (i = 0; i < this.rockets3.length ; i++) {
        if (this.rockets3[i] !== null) {
          this.rockets3[i].draw();
        }
      }
      // draw laser
      for (i = 0; i < this.laser.length ; i++) {
        if (this.laser[i] !== null) {
          this.laser[i].draw();
        }
      }
      // draw tanks
      for (i = 0; i < this.tanks.length ; i++) {
        if (this.tanks[i] !== null) {
          this.tanks[i].draw();
        }
      }

      // TODO
      // waiting for making new images
      // draw animation
      switch (this.state) {
        case FLYING_MODE_STRAIGHT:
          this.animations[0].draw(this.x, this.y);
          break;
        case FLYING_MODE_LEFT:
          this.animations[0].draw(this.x, this.y);
          break;
        case FLYING_MODE_RIGHT:
          this.animations[0].draw(this.x, this.y);
          break;
      }

      // draw hp bar
      context.fillStyle = HP_BAR_COLOR;
      var hpl = this.hpBarLength * this.hp / this.maxhp;
      context.fillRect(this.hpBarXPos, this.hpBarYPos,
          hpl, this.hpBarHeight);

      context.fillStyle = MANA_BAR_COLOR;
      var manal = this.manaBarLength * this.mana / this.maxmana;
      context.fillRect(this.manaBarXPos, this.manaBarYPos,
          manal, this.manaBarHeight);
    }
  };
}
