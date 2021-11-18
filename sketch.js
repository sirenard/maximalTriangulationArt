/* eslint-disable no-undef, no-unused-vars */

const states = {
    DRAWING: 0,
    DONE: 1
};

let currentState = states.DRAWING;
let points = [];
let triangles = [];
let solveButton, resetButton, dobkinSnyderButton;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(canvasClicked); //click on buttons are not detected

    resetButton = createButton("Reset");
    resetButton.position(30, 60);
    resetButton.mousePressed(reset);

    solveButton = createButton("Solve");
    solveButton.position(100, 60);
    solveButton.mousePressed(solve);

    dobkinSnyderButton = createButton("See Dodkin & Snyder algorithm");
    dobkinSnyderButton.position(30, 100);
    dobkinSnyderButton.mousePressed(() => window.location.href = "./dobkinSnyder/subindex.html");

    reportButton = createButton("See report");
    reportButton.position(170, 60);
    reportButton.mousePressed(() => window.open("https://sirenard.github.io/maximalTriangulationArt/report.pdf"));

    noLoop();

}

function draw() {
    background(255, 255, 255);
    textSize(20);
    fill("Black");
    stroke("Black");
    switch (currentState) {
        case states.DRAWING: {
            text("Draw some points to shape a convex polygon (don't worry, the convex hull will be computed for you)", 30, 30);
            points.map(p => p.draw());
            break;
        }
        case states.DONE: {
            text("Here is your unique piece of \"art\" !", 30, 30);
            //points.map(p => p.draw());
            triangles.map(t => {
                t.draw();
            });
            break;
        }
    }
}

function solve() {
    currentState = states.DONE;
    solveButton.hide();

    let polygon = new Polygon(points); // thus points = CH(points);
    largest_triangulation(polygon, triangles);
    triangles.map(t => t.fill = color(random(255),random(255),random(255)));

    //triangles.push(polygon);
    //compute the smallest enclosing triangle and add it to the triangles list

    let enclosingTriangle = new MinEnclosingTriangle(polygon);
    enclosingTriangle.findMinEnclosingTriangle();
    enclosingTriangle.minEnclosingTriangle.fill = "rgba(0,0,0,0)";
    triangles.push(enclosingTriangle.minEnclosingTriangle);

    draw();
}

function reset() {
    currentState = states.DRAWING;
    points = [];
    triangles = [];
    solveButton.show();
    draw();
}

function canvasClicked() {
    if (currentState === states.DRAWING) {
        points.push(new Point(mouseX, mouseY));
        draw();
    }
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
