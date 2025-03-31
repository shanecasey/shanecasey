var img;
var xOffset = 0, yOffset = 0;
var theta = 0;
var r = 0;
var remain = 0;
var xSeed;
var wSeed;
var left = 0;
let myFont;

// New variables for font sizes and repeat toggle
var largeFontSize = 145;
var smallFontSize = 50;
var repeatText = false; // Set to false to draw text only once

function preload() {
  myFont = loadFont('MonumentExtended-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  img = createGraphics(width, height);
  xSeed = round(0.6 * width);
  wSeed = width - xSeed;
  
  img.pixelDensity(1);
  img.fill(0);
  img.noStroke();
  img.rect(0, 0, width, height);
  
  img.fill(255);
  img.textFont(myFont);
  
  // Draw the text: "LLMS" with "in the workplace" underneath.
  if (repeatText) {
    // Repeat text along the canvas height.
    // The spacing is based on the two font sizes plus some additional padding.
    for (var y = largeFontSize + 20; y < height; y += (largeFontSize + smallFontSize + 20)) {
      img.textSize(largeFontSize);
      img.text("LLMS", 230, y);
      img.textSize(smallFontSize);
      img.text("in the workplace", 230, y + largeFontSize + 10);
    }
  } else {
    // Draw text just once, centered vertically.
    var centerY = height / 2;
    img.textSize(largeFontSize);
    img.text("LLMS", 230, centerY);
    img.textSize(smallFontSize);
    img.text("in the workplace", 230, centerY + (largeFontSize + 10)/2);
  }
  
  image(img, 0, 0);
  filter(THRESHOLD);
  frameRate(30);
  loadPixels();
}

function draw() {
  xOffset = 1;
  yOffset = height - 1;
  var widthMultipliedBy4 = (width * 4);

  while (xOffset < width) {
    r = round(cos(theta) * random(0, xOffset));

    // Loop 1: Shift pixels horizontally in the lower part of the image
    var start = yOffset * widthMultipliedBy4;
    var end = start + (r << 2); // r * 4
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
