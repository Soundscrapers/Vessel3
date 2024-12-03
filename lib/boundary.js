class Boundary{
  constructor(x,y,w,h) {
  let options = {
    // collisionFilter: {
    //     group: group,
    //     // category: category,
    //     mask: category
    //   },
    friction: 0.8,
    density: 0.1,
    restitution: 0.01,
    isStatic: true
  }
  this.body = Bodies.rectangle(x,y,w,h,options);
  this.w = w;
  this.h = h;
  World.add(world, this.body);
  }
  
  show(){
    let pos = this.body.position;
    let angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    noStroke(255);
    fill(0, 50);
    rect(0,0, this.w, this.h);
    pop();
  }
}