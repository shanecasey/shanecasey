var img;
var xOffset = 0, yOffset = 0;
var theta = 0;
var r = 0;
var remain = 0;
var xSeed;
var wSeed;
var left = 0;
let myFont;

// Font sizes and repeat toggle
var largeFontSize = 145;
var smallFontSize = 50;
var repeatText = false;

// Custom replacement colors (use your desired hex values)
let customRed;
let customBlueCyan;

function preload() {
  myFont = loadFont('MonumentExtended-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  img = createGraphics(width, height);
  xSeed = round(0.6 * width);
  wSeed = width - xSeed;
  
  // Define your desired hex colors here
  customRed = color('#ee00ee');      // pink
  customBlueCyan = color('#ceff99'); // green

  img.pixelDensity(1);
  img.fill(0);
  img.noStroke();
  img.rect(0, 0, width, height);
  
  img.fill(255);
  img.textFont(myFont);
  
  // Draw text
  if (repeatText) {
    for (var y = largeFontSize + 20; y < height; y += (largeFontSize + smallFontSize + 20)) {
      img.textSize(largeFontSize);
      img.text("LLMS", 230, y);
      img.textSize(smallFontSize);
      img.text("in the workplace", 230, y + (largeFontSize + 10)/2);
    }
  } else {
    var centerY = height / 2;
    img.textSize(largeFontSize);
    img.text("LLMS", 230, centerY);
    img.textSize(smallFontSize);
    img.text("in the workplace", 230, centerY + (largeFontSize + 10)/2);
  }
  
  image(img, 0, 0);
  //filter(THRESHOLD);
  frameRate(30);
  loadPixels();
}

function draw() {
  xOffset = 1;
  yOffset = height - 1;
  var widthMultipliedBy4 = width * 4;

  // --- Glitch loops (unchanged) ---
  while (xOffset < width) {
    r = round(cos(theta) * random(0, xOffset));

    // Loop 1 (originally "red" glitch)
    var start = yOffset * widthMultipliedBy4;
    var end = start + (r << 2); // r * 4
    for (var i = end - 12; i > start; i -= 12) {
      pixels[i + 12] = pixels[i + 5] = pixels[i + 6] = pixels[i];
    }

    // Loop 2 (vertical shift)
    left = Math.max(0, xSeed - r);
    remain = Math.max(0, (width - left));
    start = (yOffset - 1) * widthMultipliedBy4 + (left * 12) + widthMultipliedBy4;
    end = start + (remain * 4);
    for (var i = start; i < end; i += 12) {
      pixels[i - widthMultipliedBy4] = pixels[i + 1 - widthMultipliedBy4] =
      pixels[i + 2 - widthMultipliedBy4] = pixels[i];
    }

    // Loop 3 (originally "blue" glitch)
    start = (yOffset * widthMultipliedBy4) + ((width - r) * 12);
    end = start + (r * 5);
    for (var i = start + 12; i < end; i += 12) {
      pixels[i - 12] = pixels[i - 3] = pixels[i - 2] = pixels[i];
      pixels[i - 12 + widthMultipliedBy4] = pixels[i - 3 + widthMultipliedBy4] =
      pixels[i - 2 + widthMultipliedBy4] = pixels[i + widthMultipliedBy4];
    }

    xOffset++;
    yOffset--;
  }
  
  // Replace *only* predominantly red or blue/cyan pixels with custom colors
  for (let i = 0; i < pixels.length; i += 4) {
    let rVal = pixels[i + 0];
    let gVal = pixels[i + 1];
    let bVal = pixels[i + 2];
    
    // If it's mostly red, replace with customRed
    if (isMostlyRed(rVal, gVal, bVal)) {
      pixels[i]   = red(customRed);
      pixels[i+1] = green(customRed);
      pixels[i+2] = blue(customRed);
    }
    // If it's mostly blue/cyan, replace with customBlueCyan
    else if (isMostlyBlueCyan(rVal, gVal, bVal)) {
      pixels[i]   = red(customBlueCyan);
      pixels[i+1] = green(customBlueCyan);
      pixels[i+2] = blue(customBlueCyan);
    }
  }

  updatePixels();
  theta++;
}

// Simple checks for "mostly red" or "mostly blue/cyan"
// Feel free to tweak these thresholds to better match your glitch colors
function isMostlyRed(r, g, b) {
  // Example: Red channel is at least 150 and clearly bigger than the others
  return (r > 150 && r > g * 1.4 && r > b * 1.4);
}

function isMostlyBlueCyan(r, g, b) {
  // Example: Blue or cyan means blue is quite high, or g+b is big while r is small
  // Adjust as needed
  // For a pure bright "blue" glitch: (b > 150 && b > r * 1.4 && b > g * 1.4)
  // For a more "cyan" detection: (g + b) > 300 or so
  // Combine them with OR:
  let isBlue = (b > 150 && b > r * 1.4 && b > g * 1.2);
  let isCyan = (g + b > 300 && r < 80);
  return isBlue || isCyan;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
