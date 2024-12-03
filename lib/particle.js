class Particle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  show() {
    stroke(255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}