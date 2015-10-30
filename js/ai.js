//Todo
//1.heat source roket
//2.miss heat firework
var ai_dxmax = 10;
var ai_dymax = 20;

function ai_phySta(x,y,dx,dy,ax,ay) {
  return{
    x: x,
    y: y,
    dx: dx,
    dy: dy,
    ax: ax,
    ay: ay
  };
}

function ai_box(p,width,height) {
  return{
    p: p,
    width: width,
    height: height,
    collision: 0,
    isCollision: function(boxSet){
      return true;
    },
    numCollision: function(boxSet){
      return num;
    }
  };
}

function ai_trajectoryAutoDodge(level){
  return{
    nextPosition: function(p, box, boxSet) {
      for(var i = 0 ; i < player.bullets.length ; i++){
        if(player.bullets[i].y - player.bullets[i].dy * 5 <
            box.p.y + box.height) {
          var dbxrx = box.p.x - player.bullets[i].x;

          if(dbxrx <= 0 && dbxrx >= -1 * box.width){
            if(WIDTH - p.x > p.x) {
              p.x += p.dx;
            }
            else{
              p.x -= p.dx;
            }
          }
        }
      }
      return p;
    }
  };
}

function ai_trajectoryAuto(accurate) {
  return{
    accurate: accurate,
    nextPosition: function(p, pTarget){
      p.y += p.dy;
      var disX = pTarget.x - p.x;
      if (disX > 0){
        if(disX < p.dx)
          p.x = pTarget.x;
        else
          p.x += p.dx;
      } else if(disX < 0){
        if(disX > -1 * p.dx)
          p.x = pTarget.x;
        else
          p.x -= p.dx;
      }

      p.dx += p.ax;
      p.dy += p.ay;
      return p;
    }
  };
}

function ai_trajectoryStraight() {
  return{
    nextPosition: function(p){
      p.x += p.dx;
      p.y += p.dy;
      p.dx += p.ax;
      p.dy += p.ay;
      return p;
    }
  };
}

function ai_bullet1(x,y) {
  re = {
    p: null,
    trajectory: null,
    update: function() {
      n = this.trajectory.nextPosition(this.p);
      //out
      if(n.x<0 || n.y<0 || n.x>WIDTH || n.y>HEIGHT)
        return false;
      else {
        this.p = n;
        return true;
      }
    },
    draw: function(){
      context.drawImage(bulletImage,this.p.x+16,this.p.y+35);
      context.drawImage(bulletImage,this.p.x+46,this.p.y+35);
    }
  };
  re.p = ai_phySta(x, y, 0, 5, 0, 0);
  re.trajectory= ai_trajectoryStraight();
  return re;
}

function ai_rocket1(x,y) {
  re = {
    p: null,
    trajectory: null,
    update: function(){
      n = this.trajectory.nextPosition(this.p,
          ai_phySta(player.x, player.y, 0, 0, 0, 0));

      //out
      if(n.x<0 || n.y<0 || n.x>WIDTH || n.y>HEIGHT)
        return false;
      else{
        if(n.dx > ai_dxmax)
          n.dx = ai_dxmax;
        if(n.dy > ai_dymax)
          n.dy = ai_dymax;
        this.p = n;
        return true;
      }
    },
    draw: function(){
      context.drawImage(rocket1_eImage, this.p.x + 32, this.p.y+35);
    }
  };

  re.p = ai_phySta(x, y, 2, 1, 0.1, 0.5);
  re.trajectory= ai_trajectoryAuto(100);
  return re;
}

function ai_robot(x ,y) {
  re ={
    p: null,
    trajectory: null,
    box: null,
    bullet: [],

    update: function(timestamp){
      this.box.p = this.p;
      this.p = this.trajectory.nextPosition(this.p, this.box);

      //bullet
      var r = Math.random();
      if(r*50 < 1){
        this.bullet.push(ai_bullet1(this.p.x,this.p.y));
      }

      if(r*100 <1){
        this.bullet.push(ai_rocket1(this.p.x,this.p.y));
      }

      for(var i = 0 ; i < this.bullet.length ; i++){
        if(!this.bullet[i].update())
          this.bullet.splice(i,1);
      }
    },
    draw: function(){
      context.fillStyle = "#FFFFFF";
      context.fillText(this.bullet.length, 400, 400);
      context.drawImage(plane_enemy, this.p.x, this.p.y);
      for(var i=0 ; i < this.bullet.length ; i++){
        this.bullet[i].draw();
      }
    }
  };

  re.p = ai_phySta(x, y, 3, 0, 0, 0);
  re.trajectory = ai_trajectoryAutoDodge(0);
  re.box = ai_box(re.p, 64, 64);
  return re;
}

