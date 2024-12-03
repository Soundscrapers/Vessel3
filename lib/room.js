class Room {
  constructor() {
    this.boundaries = [];
    let bscale = 6.8;
    this.boundaries.push(new Boundary(
      0,
      height / 2,
      w / bscale,
      height
      ));
    this.boundaries.push(new Boundary(
      width / 2, 
      height,
      width,
      h / bscale
    ));
    this.boundaries.push(new Boundary(
      width,
      height / 2,
      w / bscale,
      height
    ));
      this.boundaries.push(new Boundary(
        width / 2,
        0,
        width,
        h / bscale
      ));
    this.bus = new Tone.Gain().connect(mainBus);
  }

  show() {
    for (let b of this.boundaries) {
      b.show()
    }
  }
}