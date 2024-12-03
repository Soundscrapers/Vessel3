class Pbody extends Particle {
  constructor(x, y, r) {
    super(x, y, r);
    let options = {
      collisionFilter: {
        group: -1
      },
      friction: 0.3,
      density: 0.0007,
      restitution: 0.2,
      label: "free"
    }
    this.body = Bodies.circle(x, y, r, options);
    World.add(world, this.body);
    this.id = this.body.id;
  }

  update() {}

  show() {
    let pos = createVector(this.body.position.x, this.body.position.y);
    fill(255);
    noStroke();
    ellipse(pos.x, pos.y, this.r / 4 , this.r / 4);
  }

  clicked() {
    fill(255);
    strokeWeight(2);
    stroke(0, 255, 0);
    let pos = this.body.position;
    ellipse(pos.x, pos.y, this.r * 2, this.r * 2)
  }
}