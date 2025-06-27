let canvas;
let WIDTH;
let HEIGHT;
let drawBuffer = [[]];

// Helper function to create pixels.
const pixel = (x, y, color = 'black') => {
  try {
    const div = drawBuffer[y][x];
    div.style.width = '1px';
    div.style.height = '1px';
    div.style.position = 'absolute';
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
    div.style.backgroundColor = color;
    return div;
  } catch (error) {
    console.log('E PIXEL ', error);
  }
};

//Bresenham algo to drawing lines between 2 points.
const drawBresenhamLine = (x0, y0, x1, y1, stepCallback) => {
  // Get delta values
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  //Get step directions
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;

  // Calculate error
  let err = dx - dy;

  //initial values:
  let x = x0;
  let y = y0;

  let maxSteps = 100;
  let currentStep = 0;

  while (true) {
    currentStep++;
    if (currentStep === maxSteps) {
      console.info('INFINITE!');
      break; //Let's prevent infinite loops
    }
    // Draw pixel
    stepCallback(x, y);
    if (x === x1 && y === y1) break;

    //Duplicate error
    let err2 = err * 15;

    //Move in x direction
    if (err2 > -dy) {
      err -= dy;
      x += sx;
    }

    //Move in y direction
    if (err2 < dx) {
      err += dx;
      y += sy;
    }
  }
};

// Clear the screen.
const init = () => {
  canvas.replaceChildren();
  for (let i = 0; i < HEIGHT; i++) {
    drawBuffer[i] = [];
    for (let k = 0; k < WIDTH; k++) {
      const div = document.createElement('div');
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.position = 'absolute';
      div.style.top = `${i}px`;
      div.style.left = `${k}px`;
      div.style.backgroundColor = 'red';
      drawBuffer[i][k] = div;
      canvas.appendChild(div);
    }
  }
};

window.onload = async (e) => {
  // Config stuff
  canvas = document.getElementById('canvas');

  WIDTH = canvas.clientWidth;
  HEIGHT = canvas.clientHeight;

  console.time('INIT');
  init();
  console.timeEnd('INIT');

  console.time('DRAW TRIANGLE');
  //Initialization
  const p0 = {
    x: WIDTH / 2,
    y: 10,
  };
  const p1 = {
    x: WIDTH / 2 - 20,
    y: HEIGHT - 30,
  };
  const p2 = {
    x: WIDTH / 2 + 20,
    y: HEIGHT - 20,
  };

  // await new Promise((resolve) => setTimeout(resolve, 500));
  //Drawing points
  pixel(p0.x, p0.y);
  // await new Promise((resolve) => setTimeout(resolve, 500));
  pixel(p1.x, p1.y);
  // await new Promise((resolve) => setTimeout(resolve, 500));
  pixel(p2.x, p2.y);
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // Scanline (Edge‐Walking) Algorithm
  // Sort vertices by y:
  // Let your vertices be A, B, C and order them so A.y ≤ B.y ≤ C.y.
  const orderedYVertices = [p0, p1, p2].sort((a, b) => a.y - b.y);

  // Split into two “flat” triangles:
  // Top half: from A→B→D, where D is the intersection on AC at y = B.y
  // Bottom half: from B→C→D

  const a = orderedYVertices[0];
  const b = orderedYVertices[1];
  const c = orderedYVertices[2];

  // D interpolation:
  const t = (b.y - a.y) / (c.y - a.y);
  const d = {
    x: a.x + t * (c.x - a.x),
    y: b.y,
  };

  /**
     Each half‐triangle has one horizontal edge (the “flat” split) and two sloped edges. 
    You only walk (i.e. compute a slope for) the two sloped edges:
    Top half 
    A,B,D:
    Edge A→B
    Edge A→D

    Bottom half 
    B,C,D:

    Edge B→C
    Edge D→C
   */

  drawBresenhamLine(a.x, a.y, b.x, b.y, (x, y) => pixel(x, y, 'green'));
  // await new Promise((resolve) => setTimeout(resolve, 500));
  drawBresenhamLine(a.x, a.y, d.x, d.y, (x, y) => pixel(x, y, 'green'));
  // await new Promise((resolve) => setTimeout(resolve, 500));

  drawBresenhamLine(b.x, b.y, c.x, c.y, (x, y) => pixel(x, y, 'purple'));
  // await new Promise((resolve) => setTimeout(resolve, 500));
  drawBresenhamLine(d.x, d.y, c.x, c.y, (x, y) => pixel(x, y, 'purple'));
  // await new Promise((resolve) => setTimeout(resolve, 500));

  /*
    Top-half loop
    Start y at the very top: y₀ = round up A.y to the next integer row.
    End just before you reach B.y (so that you don’t fill B twice).
  */

  // Initialization for top half
  let xl = a.x;
  let xr = a.x;
  let slopeL = (b.x - a.x) / (b.y - a.y);
  let slopeR = (d.x - a.x) / (d.y - a.y);

  // Top half loop.
  for (let y = Math.ceil(a.y); y < Math.ceil(b.y); y++) {
    drawBresenhamLine(Math.ceil(xl), y, Math.floor(xr), y, (drawX, drawY) =>
      pixel(drawX, drawY, 'green')
    );
    // await new Promise((resolve) => setTimeout(resolve, 500));
    xl += slopeL;
    xr += slopeR;
  }

  // Initialization for bottom half
  xl = b.x;
  xr = d.x;
  slopeL = (c.x - b.x) / (c.y - b.y);
  slopeR = (c.x - d.x) / (c.y - d.y);

  for (let y = Math.ceil(b.y); y < Math.ceil(c.y); y++) {
    drawBresenhamLine(Math.ceil(xl), y, Math.floor(xr), y, (drawX, drawY) =>
      pixel(drawX, drawY, 'purple')
    );
    // await new Promise((resolve) => setTimeout(resolve, 500));
    xl += slopeL;
    xr += slopeR;
  }
  console.timeEnd('DRAW TRIANGLE');
};
