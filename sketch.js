/* eslint-disable no-undef, no-unused-vars */

const states = {
  DRAWING: 0,
  DONE: 1
};

let currentState = states.DRAWING;
let points = [];
let triangles = [];
let solveButton, resetButton;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(canvasClicked); //click on buttons are not detected

  resetButton = createButton("Reset");
  resetButton.position(30, 85);
  resetButton.mousePressed(reset);

  solveButton = createButton("Solve");
  solveButton.position(100, 85);
  solveButton.mousePressed(solve);

}

function draw() {
  background(128);
  textSize(30);
  fill("Black");
  stroke("Black");
  switch (currentState) {
    case states.DRAWING: {
      text("Draw a convex polygon (don't worry, the convex hull will be computed for you)", 30, 50);
      points.map(p => p.draw());
      break;
    }
    case states.DONE: {
      text("Here is your piece of art !", 30, 50);
      points.map(p => p.draw());
      triangles.map(t=>t.draw());
      break;
    }
  }
}

function solve(){
  currentState = states.DONE;
  solveButton.hide();

  let polygon = new Polygon(points); // thus points = CH(points);
  //triangulate and add to the list triangles all the triangles
  //compute the smallest enclosing triangle and add it to the triangles list
  let enclosingTriangle = new MinEnclosingTriangle(polygon);
  enclosingTriangle.findMinEnclosingTriangle()
  enclosingTriangle.minEnclosingTriangle.fill = "rgba(0,0,0,0)";
  triangles.push(enclosingTriangle.minEnclosingTriangle);
}

function reset(){
  currentState = states.DRAWING;
  points = [];
  triangles = [];
  solveButton.show();
}

function canvasClicked(){
  if (currentState === states.DRAWING){
    points.push(new Point(mouseX, mouseY));
  }
}

// This Redraws the Canvas when resized
windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
};
