let canvas;
let WIDTH;
let HEIGHT;
let drawBuffer = [[]];

// Helper function to create pixels.
const pixel = (x, y) => {
  const div = drawBuffer[y][x];
  div.style.width = '1px';
  div.style.height = '1px';
  div.style.position = 'absolute';
  div.style.top = `${y}px`;
  div.style.left = `${x}px`;
  div.style.backgroundColor = 'black';
  return div;
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

  let maxSteps = 1000;
  let currentStep = 0;

  while (true) {
    if (currentStep === maxSteps) {
      console.info('INFINITE!');
      break; //Let's prevent infinite loops
    }
    // Draw pixel
    stepCallback(x, y);
    if (x === x1 && y === y1) break;

    //Duplicate error
    let err2 = err * 2;

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
const clear = () => {
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

window.onload = (e) => {
  // Config stuff
  canvas = document.getElementById('canvas');

  WIDTH = canvas.clientWidth;
  HEIGHT = canvas.clientHeight;

  //   console.time('CLEAR');
  clear();
  //   console.timeEnd('CLEAR');

  //Initialization
  const p0 = {
    x: WIDTH / 2,
    y: 10,
  };
  const p1 = {
    x: WIDTH / 2 - 20,
    y: HEIGHT - 10,
  };
  const p2 = {
    x: WIDTH / 2 + 20,
    y: HEIGHT - 20,
  };

  //Drawing points
  pixel(p0.x, p0.y);
  pixel(p1.x, p1.y);
  pixel(p2.x, p2.y);

  // Draw lines between points
  // p0 -> p1
  drawBresenhamLine(p0.x, p0.y, p1.x, p1.y, (x, y) => {
    pixel(x, y);
  });
  // p1 -> p2
  drawBresenhamLine(p1.x, p1.y, p2.x, p2.y, (x, y) => {
    pixel(x, y);
  });
  // p2 -> p0
  drawBresenhamLine(p2.x, p2.y, p0.x, p0.y, (x, y) => {
    pixel(x, y);
  });
};
