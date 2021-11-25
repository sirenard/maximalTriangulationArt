/* eslint-disable no-undef, no-unused-vars */

const states = {
    DRAWING: 0,
    DONE: 1,
    STEPBYSTEP: 2
};

let currentState = states.DRAWING;
let polygon;
let points = [];
let triangles = [];
let history = [];
let current_history_step = 0;
let current_subhistory_step = 0;
let solveButton, resetButton, dobkinSnyderButton, reportButton, stepByStepButton;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(canvasClicked); //click on buttons are not detected

    resetButton = createButton("Reset");
    resetButton.position(30, 60);
    resetButton.mousePressed(reset);

    solveButton = createButton("Solve");
    solveButton.position(100, 60);
    solveButton.mousePressed(solve);

    stepByStepButton = createButton("See triangulation step by step");
    stepByStepButton.position(170, 60);
    stepByStepButton.mousePressed(stepByStep);
    stepByStepButton.hide();

    dobkinSnyderButton = createButton("See Dodkin & Snyder algorithm");
    dobkinSnyderButton.position(30, 100);
    dobkinSnyderButton.mousePressed(() => window.location.href = "./dobkinSnyder/subindex.html");

    reportButton = createButton("See report");
    reportButton.position(30, 140);
    reportButton.mousePressed(() => window.open("https://sirenard.github.io/maximalTriangulationArt/report.pdf"));

    noLoop(); // disable auto drawing
}

function draw() {
    background(255, 255, 255);
    textSize(20);
    fill("Black");
    stroke("Black");

    switch (currentState) {
        case states.DRAWING: {
            text("Draw some points to shape a convex polygon (don't worry, the convex hull will be computed for you) and click on solve", 30, 30);
            points.map(p => p.draw());
            break;
        }
        case states.DONE: {
            text("Here is your unique piece of \"art\" !", 30, 30);
            triangles.map(t => {
                t.draw();
            });
            break;
        }
        case states.STEPBYSTEP: {
            drawStepByStep();
            break;
        }
    }
}

function drawStepByStep() {
    polygon.draw();
    for (let i = 0; i < current_history_step; ++i) { // draw largest tringle found
        largest_triangle_found = history[i][history[i].length - 1][1];
        largest_triangle_found.fill = "rgba(0, 0, 255, 0.25)";
        largest_triangle_found.draw();
    }

    if (current_history_step >= history.length) {
        text("The triangulation is finished !", 30, 30);
        currentState = states.DONE;
        return;
    }
    text("Left click to show the next step, in green you see the actual largest triangle", 30, 30);

    let [triangle, actual_largest_triangle] = history[current_history_step][current_subhistory_step];

    triangle.fill = "rgba(255, 0, 0, 0.25)";
    triangle.draw();
    text("a", triangle.points[0].x, triangle.points[0].y);
    text("b", triangle.points[1].x, triangle.points[1].y);
    text("c", triangle.points[2].x, triangle.points[2].y);

    actual_largest_triangle.fill = "rgba(0, 255, 0, 0.25)";
    actual_largest_triangle.draw();

    ++current_subhistory_step;
    if (current_subhistory_step >= history[current_history_step].length) { // go to next subpolygon
        ++current_history_step;
        current_subhistory_step = 0;
    }
}

function solve() {
    if (points.length < 3) {
        alert("You must draw at least 3 points");
        return
    }

    currentState = states.DONE;
    solveButton.hide();
    stepByStepButton.show();

    polygon = new Polygon(points); // convex hull will be compute
    polygon.fill = "rgba(0,0,0,0)";

    largest_triangulation(polygon, triangles, history);
    triangles.map(t => t.fill = color(random(255), random(255), random(255)));

    let enclosingTriangle = new MinEnclosingTriangle(polygon);
    enclosingTriangle.findMinEnclosingTriangle();
    enclosingTriangle.minEnclosingTriangle.fill = "rgba(0,0,0,0)";
    triangles.push(enclosingTriangle.minEnclosingTriangle);

    draw();
}

function stepByStep() {
    currentState = states.STEPBYSTEP;
    stepByStepButton.hide();
    canvasClicked();
}

function reset() {
    currentState = states.DRAWING;
    points = [];
    triangles = [];
    polygon = null;
    history = [];
    current_history_step = 0;
    current_subhistory_step = 0;
    solveButton.show();
    stepByStepButton.hide();
    draw();
}

function canvasClicked() {
    if (currentState === states.DRAWING)
        points.push(new Point(mouseX, mouseY));
    draw();
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
