class Spring extends Line {
  constructor(startP, endP, len) {
    super(startP, endP);
    this.phase = map(startP.pos.x, 0, w, 0, TWO_PI);
    this.noiseMax = 3;
    this.noiseMag = 15;
    const options = {
      pointA: {
        x: startP.pos.x,
        y: startP.pos.y
      },
      bodyB: endP.body,
      damping: 0.1,
      stiffness: 0.005,
      length: len
    }
    this.constraint = Constraint.create(options);
    World.add(world, this.constraint);
  }

  attach(body) {
    this.constraint.bodyB = body;
  }

  stretchDist() {
    let d = dist(this.startP.pos.x, this.startP.pos.y, this.endP.body.position.x, this.endP.body.position.y);
    return d;
  }

  detach() {
    this.constraint.bodyB = null;
  }

  show() {
    let s = this.startP.pos;
    let e = createVector(this.endP.body.position.x, this.endP.body.position.y);
    let d = dist(s.x,s.y,e.x,e.y);
    strokeWeight(1);
    stroke(255);
    noFill();
    beginShape();
    // vertex(s.x,s.y);
    for (let i = 0; i < d; i += 5) {
      let a = map(i, 0, d, 0, TWO_PI);
      let u = map(cos(a), -1, 1, 0, this.noiseMax);
      let v = map(sin(a + this.phase), -1, 1, 0, this.noiseMax);
      let dd = abs(i - d/2);
      let nm = map(dd, d/2, 0, 0, this.noiseMag);
      let nx = map(noise(u, v), 0, 1, -nm, nm);
      let x = lerp(s.x,e.x,i/d);
      x += nx;
      let y = lerp(s.y,e.y,i/d);
      vertex(x, y);
    }
    vertex(e.x,e.y);
    endShape();
    this.phase += PI / 72;
  }

}