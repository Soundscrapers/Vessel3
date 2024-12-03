class Line {
  constructor(startP, endP) {
    this.startP = startP; //particle - fixed global location
    this.endP = endP; //pbody
  }

  //graphics
  show() {
    let s = this.startP.pos;
    let e = createVector(this.endP.body.position.x, this.endP.body.position.y);
    strokeWeight(1);
    stroke(255);
    line(s.x, s.y, e.x, e.y);
  
  }
}