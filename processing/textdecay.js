var img;
var xOffset = 0, yOffset = 0; // More descriptive names
var theta = 0;
var r = 0;
var remain = 0;
var xSeed;
var wSeed;
var left = 0;
let myFont;

function preload() {
  myFont = loadFont('MonumentExtended-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Usually not needed as 1 is the default
  img = createGraphics(width, height);
  xSeed = round(0.6 * width);
  wSeed = width - xSeed;
  img.pixelDensity(1);
  img.fill(0);
  img.noStroke();
  img.rect(0, 0, width, height);
  img.fill(255);
  img.textFont(myFont, 145); // Use the actual font variable
  for (var y = 150; y < height; y += 150) {
    img.text("L L M s", 230, y);
  }
  image(img, 0, 0);
  filter(THRESHOLD);
  frameRate(30); //setFrameRate is deprecated
  loadPixels();
}

function draw() {
  xOffset = 1;
  yOffset = height - 1;
  var widthMultipliedBy4 = (width * 4); // More descriptive name

  while (xOffset < (width)) {
    r = round(cos(theta) * random(0, xOffset)); // Calculate the shift amount

    // Loop 1: Shift pixels horizontally in the lower part of the image
    var start = yOffset * widthMultipliedBy4;
    var end = start + (r << 2); // r * 4 (shift by r pixels)
    for (var i = end - 12; i > start; i -= 12) {
      pixels[i + 12] = pixels[i + 5] = pixels[i + 6] = pixels[i];
    }
    // Loop 2: Shift pixels vertically in the middle
    left = Math.max(0, xSeed - r);
    remain = Math.max(0, (width - left));
    start = (yOffset - 1) * widthMultipliedBy4 + (left * 12) + widthMultipliedBy4;
    end = start + (remain * 4);
    for (var i = start; i < end; i += 12) {
      pixels[i - widthMultipliedBy4] = pixels[i + 1 - widthMultipliedBy4] = pixels[i + 2 - widthMultipliedBy4] = pixels[i];
    }

    // Loop 3: Shift pixels both horizontally and vertically on the right
    start = (yOffset * widthMultipliedBy4) + ((width - r) * 12);
    end = start + (r * 5);
    for (var i = start + 12; i < end; i += 12) {
      pixels[i - 12] = pixels[i - 3] = pixels[i - 2] = pixels[i];
      pixels[i - 12 + widthMultipliedBy4] = pixels[i - 3 + widthMultipliedBy4] = pixels[i - 2 + widthMultipliedBy4] = pixels[i + widthMultipliedBy4];
    }

    xOffset++;
    yOffset--;
  }
  updatePixels();
  theta++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}