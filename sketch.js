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

    noLoop();

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
            triangles.map(t => {
                t.fill = color(random(255),random(255),random(255));
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
    maximal_triangulation(polygon, triangles);
    //compute the smallest enclosing triangle and add it to the triangles list
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
