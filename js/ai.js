var ai_vmax = 5;
var ai_debug = false;
function ai_phySta(x,y,v,a,theta,at) {
  return{
    x: x,
    y: y,
    v: v,
    a: a,
    dir: theta,
    at: at
  };
}

function ai_trajectoryAutoDodge(level){
  return{
    step: 0,
    step_n: 0,
    nextPosition: function(p){
      if(this.step == 0){
        for(var i=0;i<player.bullets.length;i++){
          if(player.bullets[i].y-player.bullets[i].dy*15<p.y+64){
            var dbxrx = p.x - player.bullets[i].x;
            if( dbxrx <= 0 && dbxrx >= -64){
              if(player.x > p.x && WIDTH > p.x+15*p.v){
                this.step = 15;
              }
              else{
                this.step = -15;
              }
            }
          }
        }
        if(false){
        //if(this.step == 0){
          var d = player.x - p.x;
          if(d > p.v && WIDTH > p.x+2*p.v){
            p.x += p.v;
          }
          else if(d < -p.v){
            p.x -= p.v;
          }
        }
      }
      else{
        if(this.step == this.step_n){
          this.step = 0;
          this.step_n = 0;
        }
        else if(this.step > 0){
          p.x += p.v;
          this.step_n++;
        }
        else{
          p.x -= p.v;
          this.step_n--;
        }
      }
      return p;
    }
  }
}

function ai_trajectoryAuto(accurate) {
  var re = {
    accurate: accurate,
    r: 0,
    del: 0,
    a : 0,
    nextPosition: function(p,pTarget){

      pTarget.x += this.r;
      pTarget.y += this.r;
      p.x += Math.cos(p.dir)*p.v;
      p.y += Math.sin(p.dir)*p.v;
      p.v += p.a;
      dtheta = p.dir - Math.atan((pTarget.y-p.y)/(pTarget.x-p.x));
      this.a = this.r;
      this.del = dtheta;
      if((dtheta < 0 && dtheta > -0.5*Math.PI) || (dtheta < Math.PI && dtheta > 0.5*Math.PI))
        p.dir += p.at;
      else if(dtheta != 0 )
        p.dir -= p.at;
      return p;
    }
  };
  re.r = (-70+Math.random()*140)*(1-accurate/100);
  return re;
}

function ai_trajectoryStraight() {
  return{
    nextPosition: function(p){
      p.x += Math.cos(p.dir)*p.v;
      p.y += Math.sin(p.dir)*p.v;
      p.v += p.a;
      return p;
    }
  };
}

function ai_bullet1(x,y) {
  var re = {
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
  re.p = ai_phySta(x, y, 5, 0, 0.5*Math.PI, 0);
  re.trajectory= ai_trajectoryStraight();
  return re;
}

function ai_rocket1(x,y) {
  var re = {
    p: null,
    trajectory: null,
    update: function(){
      n = this.trajectory.nextPosition(this.p,ai_phySta(player.x+32,player.y+20,0,0,0,0));
      //out
      if(n.x<0 || n.y<0 || n.x>WIDTH || n.y>HEIGHT)
        return false;
      else{
        if(n.v > ai_vmax)
          n.v = ai_vmax;
        this.p = n;
        return true;
      }
    },
    draw: function(){
      drawRotation(rocket1_eImage,this.p.x,this.p.y,this.p.dir-0.5*Math.PI);
      context.fillStyle = "#FFFFFF";
      if(ai_debug){
        context.fillText(this.p.dir,this.p.x,this.p.y);
        context.fillText(this.trajectory.del,this.p.x,this.p.y+30);
        context.fillText(this.trajectory.a,this.p.x,this.p.y+40);
      }
    }
  }  
  re.p = ai_phySta(x,y,3,0.1,0.5*Math.PI,0.02);  
  re.trajectory= ai_trajectoryAuto(50);
  return re;
}

function ai_robot(x ,y) {
  var re ={
    p: null,
    trajectory: null,
    bullet: [],
    update: function(timestamp){
      this.p = this.trajectory.nextPosition(this.p);
      //bullet
      var r = Math.random();
      if( r*20 < 1){
        this.bullet.push(ai_bullet1(this.p.x,this.p.y));
      }
      if( r*100 <1){
        this.bullet.push(ai_rocket1(this.p.x+14,this.p.y+30));
        this.bullet.push(ai_rocket1(this.p.x+50,this.p.y+30));
      }
      for(var i=0;i<this.bullet.length;i++){
        if( !this.bullet[i].update() )
          this.bullet.splice(i,1);
      }
    },
    draw: function(){
      if(ai_debug){
        context.fillStyle = "#FFFFFF";
        context.fillText(this.bullet.length,400,400);
        context.fillText(player.x +"  "+player.y,100,100);
      }
      context.drawImage(plane_enemy, this.p.x, this.p.y);
      
      for(var i=0;i<this.bullet.length;i++){
        this.bullet[i].draw();
      }  
    }

  }
  re.p = ai_phySta(x,y,6,0,0,0);
  re.trajectory = ai_trajectoryAutoDodge(0);
  return re;
}

