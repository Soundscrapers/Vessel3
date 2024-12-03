//Vessel3.04


const {
  Engine,
  World,
  Bodies,
  Body,
  Composite,
  Composites,
  Common,
  Constraint,
  Events,
  Vector,
  Vertices,
  Plugin,
  Mouse,
  MouseConstraint
} = Matter;

let engine, world;
let mConstraint;
let room;
let bg, bgimage;
let mainBus, filter;
let topPanel, botPanel;
let numF = 8;
let factor = 5;
let numP;
let pbodies = [];
let springsTop = [];
let constraints = [];
let synths = [];
let filters = [];
let effects = [];
let effect;
let centroids = [];
let freqs = [];
let harm;
let counter = 0;
let count = 0;


function preload() {
  bgImage = loadImage('assets/vessel3-1panned.png');
}

function setup() {
  cursor('assets/cross1.png', 15, 15);

  h = innerHeight;
  w = h;
  canvas = createCanvas(w, h);
  bg = createGraphics(w, h);
  bg.image(bgImage, 0, 0, w, h);

  numP = numF * factor;
  initMatter();
  initEvents();
  initTone();

  room = new Room();
  createGeometry();
  console.log(w, h);
  background(51);
  // image(bg, 0, 0);
  for (let i = 0; i < synths.length; i++) {
    let freq;
    let eb2 = 77.78;
    let step = 3.24 / 24 //quarter step pow(2, (1/24))
    //if odd, subtract fraction of step, if even add fraction
    if (i % 2 === 1) {
      freq = eb2 - (i / synths.length) * step;
    } else {
      freq = eb2 + (i / synths.length) * step;
    }
    freqs.push(freq);
    // console.log(i, freq);
    synths[i].triggerAttack(freq);
  }
}

function draw() {
  image(bg, 0, 0);
  Engine.update(engine);
  let cCounter = 0;
  centroids = [];
  for (let i = 0; i < pbodies.length; i++) {
    cCounter += pbodies[i].body.position.x
    if (i % (factor) === factor - 1) {
      cCounter = cCounter / factor;
      centroids.push(cCounter);
      cCounter = 0;
    }
  }
  for (let i = 0; i < filters.length; i++) {
    let ffreq = map(centroids[i], w * 0.1, w * 0.9, 50, 2000);
    filters[i].frequency.value = ffreq;
    // console.log(i,ffreq);
  }
  // room.show();
  // topPanel.show();
  bottomPanel.show();
  for (let pb of pbodies) {
    pb.show();
  }
  for (let spring of springsTop) {
    spring.show();
  }
  // for (let constraint of constraints) {
  //   let a = constraint.bodyA.position;
  //   let b = constraint.bodyB.position;
  //   stroke(255);
  //   strokeWeight(1);
  //   line(a.x, a.y, b.x, b.y);
  // }

  bottomPanel.hover();
  if (frameCount % 30 == 1) {
    debug();
  }
}

function initMatter() {
  engine = Engine.create();
  world = engine.world;
  world.gravity.scale = 0.000001;
  world.gravity.y = 1;
  world.gravity.x = 0;
  let canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let options = {
    mouse: canvasmouse
  }
  mConstraint = MouseConstraint.create(engine, options)
  World.add(world, mConstraint);
}

function initEvents() {
  Events.on(engine, 'collisionEnd', function(event) {
    let pairs = event.pairs;
    for (let i = 0, j = pairs.length; i != j; ++i) {
      let pair = pairs[i];
      if (!mouseIsPressed) {
        if (pair.bodyA === bottomPanel.collider) {
          if (pair.bodyB.label === "free") {
            let pbody = getPbody(pair.bodyB);
            bottomPanel.attach(bottomPanel.hover(), pbody);
            increaseHarmonicity();
          }
        }
        if (pair.bodyB === bottomPanel.collider) {
          if (pair.bodyA.label === "free") {
            let pbody = getPbody(pair.bodyA);
            bottomPanel.attach(bottomPanel.hover(), pbody);
            increaseHarmonicity();
          }
        }
      }
    }
  });
}

function initTone() {
  let comp = new Tone.Compressor({
    "threshold": -10,
    "ratio": 2,
    "attack": 0.5,
    "release": 0.1
  });

  mainBus = new Tone.Gain().chain(comp, Tone.Destination);

  for (let i = 0; i < numF; i++) {
    let filter = new Tone.Filter({
      "type": "lowpass",
      "frequency": 200,
      "rolloff": -12,
      "Q": 0.5,
      "gain": 48
    });
    filters.push(filter);
    harm = 1;
    let synth = new Tone.AMSynth({
      harmonicity: harm,
      detune: 0,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: i + 5,
        decay: 0,
        sustain: 1,
        release: 1
      },
      modulation: {
        type: 'triangle'
      },
      modulationEnvelope: {
        attack: i + 5,
        decay: 0,
        sustain: 1,
        release: 1
      }
    }).chain(filter, mainBus);
    synth.volume.value = 0;
    synths.push(synth);
  }
}

function createGeometry() {
  let u = h / 15.4;
  let ux = w / 4.5;
  let uya = h / 3.46;
  let uyb = h / 1.183;

  let p1 = createVector(u, u);
  let p2 = createVector(w - u, u);
  let p3 = createVector(w - ux, uya);
  let p4 = createVector(ux, uya);
  let p8 = createVector(ux, uyb);
  let p7 = createVector(w - ux, uyb);
  let p6 = createVector(w - u, h - u);
  let p5 = createVector(u, h - u);

  topPanel = new Panel(p1, p2, p3, p4, numP);
  bottomPanel = new Panel(p5, p6, p7, p8);
  //create springs
  let prev;
  for (let i = 0; i < numP; i++) {
    let pbi = i % 40 + 1;
    let pb = new Pbody(lerp(p4.x, p3.x, pbi / 41), random(h * 0.4, h * 0.6), h / 60);
    pbodies.push(pb);
    //length: h * 0.681 is at the vanishing point
    let spring1 = new Spring(topPanel.particles[i], pb, h * 0.75 -
      topPanel.particles[i].pos.y);
    springsTop.push(spring1);
    if (prev) {
      let options = {
        bodyA: prev,
        bodyB: pb.body,
        damping: 0.99,
        stiffness: 0.005,
        length: (p3.x - p2.x) / numP
      }
      let constraint = Constraint.create(options);
      World.add(world, constraint);
      constraints.push(constraint);
    }
    prev = pb.body;
  }
}

function increaseHarmonicity() {
  if (harm < 6) {
    harm += 1;
  }
  synths[count].harmonicity.value = harm;
  console.log(synths[count].harmonicity.value);
}

function getPbody(body) {
  let found;
  for (let pb of pbodies) {
    if (pb.id === body.id) {
      return pb;
    }
  }
}

function mouseDragged() {

}

function mousePressed() {
  counter++;
  count = counter % synths.length;
}

function debug() {
  // console.log(centroids);
}