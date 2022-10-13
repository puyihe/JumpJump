title = "me game";

description = `
  jump jump
`;

characters = [
  `
  ll
 l 
llll
l l
ll l
  l
`,
`
  ll
 l
lll
l  
ll
ll 
`,
`
l   ll
llllll
`,
`
ll l
l l
ll 
l
ll l
  l
`,
`
ll
l 
lll 
l l
l l
l  l
`,
`
l
lll
l
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "dark",
  seed: 6,
};

let mountains;
let shipY, shipV;
let offset;
let mountainAppDist;
let mountainIndex;
let landingIndex;
let landing;
let landY;
let shipCollision;
let m;
let isFirstLanded;

function update() {
  if (!ticks) {
    mountains = times(9, (i) => {
      if (i === 4) {
        return { y: (landY = 49), c: "cyan" };
      } else {
        return { y: 90 - i, c: "yellow" };
      }
    });
    shipY = 30;
    shipV = offset = mountainAppDist = mountainIndex = landing = isFirstLanded = 0;
    landingIndex = 7;
  }
  mountains.map((m, i) => {
    color(m.c);
    rect(wrap(i * 13 + offset - 13, -13, 104), m.y, 13, 99);
  });
  
  color("black");
  shipCollision = char("a", 25, shipY);
  if (landing) {
    if (input.isJustPressed) {
      landing = 0;
    } else {
      return;
    }
  }
  offset -= difficulty;
  if ((mountainAppDist -= difficulty) < 0) {
    m = mountains[wrap(mountainIndex, 0, 9)];
    m.y =
      landingIndex > 7 || landingIndex === 1
        ? rnd(70, 90)
        : landingIndex === 0
        ? (landY = rnd(40, 70))
        : rnd(40, 90);
    landingIndex--;
    if (landingIndex < 0) {
      m.c = "cyan";
      landingIndex = 9;
    } else {
      m.c = "yellow";
    }
    mountainIndex++;
    mountainAppDist += 13;
  }
  if (isFirstLanded) {
    if (input.isJustPressed) {
      play("laser");
      shipV -= 0.4;
    }
    if (input.isPressed) {
      shipV -= 0.2;
      particle(24.5, shipY + 2, 1, 1, PI / 2, 1);
    }
  }
  shipV += 0.1;
  shipV *= 0.99;
  if (shipY < 0 && shipV < 0) {
    shipV *= -1;
  }
  shipY += shipV * difficulty;
  if (shipCollision.isColliding.rect.cyan) {
    play("select");
    particle(24.5, shipY);
    landing = ++score;
    shipV = 0;
    shipY = landY - 3;
    mountains.map((n) => (n.c = "yellow"));
    isFirstLanded = 1;
  }
  if (shipCollision.isColliding.rect.yellow) {
    play("explosion");
    end();
  }
  if (rect(-1, 0, 1, 99).isColliding.rect.cyan) {
    color("blue");
    for (let y = landY - 4; y < 99; y += 7) {
      text("X", 2, y);
    }
    play("explosion");
    end();
  }
}
