class Panel {
  constructor(p1, p2, p3, p4, numberOfParticles) {
    //assumes first point is top left, then clockwise for top panel
    //assumes first point is bottom left, then counterclockwise for bottom panel
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.vectors = []; //boundary for rendering purposes
    this.vectors.push(p1);
    this.vectors.push(p2);
    this.vectors.push(p3);
    this.vectors.push(p4);
    // create collider vertices from boundary
    this.vertices = [{
        x: lerp(p1.x, p4.x, 0.05),
        y: lerp(p1.y, p4.y, 0.05)
      },
      {
        x: lerp(p2.x, p3.x, 0.05),
        y: lerp(p2.y, p3.y, 0.05)
      },
      {
        x: lerp(p2.x, p3.x, 0.95),
        y: lerp(p2.y, p3.y, 0.95)
      },
      {
        x: lerp(p1.x, p4.x, 0.95),
        y: lerp(p1.y, p4.y, 0.95)
      }
    ]
    this.ctr = Vertices.centre(this.vertices);
    // let plane = p5.Vector.sub(p1, p2)
    // this.normal = plane.rotate(HALF_PI + random(-PI / 16, PI / 16));
    // this.normal.normalize();

    //physics
    this.collider = Bodies.fromVertices(this.ctr.x, this.ctr.y, this.vertices, {
      // collisionFilter: {
      //   group: group,
      //   category: pCategory,
      // },
      isSensor: true,
      isStatic: true,
      label: "panel"
    }, true);
    World.add(world, this.collider);
    this.id = this.collider.id;
    this.particles = [];
    this.springs = [];
    this.ux = p2.x - p1.x;
    this.uxd = this.ux / 41;
    this.vx = p3.x - p4.x;
    this.vxd = this.vx / 41;
    if (numberOfParticles) {
      for (let i = 0; i < numberOfParticles; i++) {
        let col = i % 40 + 1;
        let lerpV = random([1.4, 1.7, 2, 2.5, 3.1, 3.9, 5, 6.5, 8.5, 12]);
        let pa = createVector(
          abs(lerp(this.vxd * col, this.uxd * col, 1 / lerpV)) + abs(lerp(p4.x, p1.x, 1 / lerpV)),
          lerp(p4.y, p1.y, 1 / lerpV));
        let particle = new Particle(pa.x, pa.y);
        this.particles.push(particle);
      }
    }
    //sound
    this.bus = new Tone.Gain();
    this.notes = [];
    this.freq = 100;
    this.synth = null;
    this.bus.connect(mainBus);
    this.soundWait = false;

    //graphics
    let c = 120;
    let d = 200
    let a = 25;
    this.col1 = color(d, c, d, a);
    this.col2 = color(d, d, c, a);
    this.col3 = color(c, d, d, a);
    this.currentcol = this.col1;
  }

  resonate() {
    if (!this.soundWait) {
      this.synth.triggerAttack(this.freq);
      setTimeout(this.reset.bind(this), 50);
      this.currentcol = random([this.col1, this.col2, this.col3]);
      this.soundWait = true;
    }
  }

  reset() {
    this.soundWait = false;
    this.synth.triggerRelease();
  }

  //graphics
  //bottom panel hover
  hover() {
    let record = 10000;
    let closest;
    for (let i = 0; i < numP; i++) {
      let col = i % 40 + 1;
      let lerpV = 0;
      if (mouseY > this.p4.y){
        lerpV = map(mouseY, this.p4.y, this.p1.y, 0,1)
      }
      let d = dist(mouseX,mouseY, lerp(this.p4.x + col * this.vxd, this.p1.x + col * this.uxd, lerpV), mouseY);
      if (d < record){
        record = d;
        closest = col;
      }
    }
    line(this.p1.x + closest * this.uxd, this.p1.y, this.p4.x + closest * this.vxd, this.p4.y);
    
    return closest;
  }
  
  attach(closest, pbody){
    let ypos = constrain(mouseY, this.p4.y, this.p1.y);
    let lerpV = map(ypos, this.p4.y, this.p1.y, 0,1);
    let pa = createVector(lerp(this.p4.x + closest * this.vxd, 
                               this.p1.x + closest * this.uxd, 
                               lerpV),
                          lerp(this.p4.y, this.p1.y, lerpV)
                         )
    let particle = new Particle(pa.x, pa.y);
    this.particles.push(particle);
    let spring = new Spring(particle,pbody,0);
    spring.constraint.stiffness = 1;
    this.springs.push(spring);
    pbody.body.label = "constrained";
    
  }
  
  show() {
    // if (this.soundWait) {
    // fill(this.currentcol);
    // stroke(255);
    // beginShape();
    // vertex(this.p1.x, this.p1.y);
    // vertex(this.p2.x, this.p2.y);
    // vertex(this.p3.x, this.p3.y);
    // vertex(this.p4.x, this.p4.y);
    // endShape(CLOSE);
    // }
    strokeWeight(1);
    for (let p of this.particles) {
      p.show();
    }
    // let ux = this.p2.x - this.p1.x;
    // let uxd = ux / 41;
    // let vx = this.p3.x - this.p4.x;
    // let vxd = vx / 41;
    // for (let i = 0; i < numP; i++) {
    //   let col = i % 40 + 1;
    //   line(this.p1.x + col * uxd, this.p1.y, this.p4.x + col * vxd, this.p4.y);
    // }


  }
}