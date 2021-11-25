/* eslint-disable no-undef, no-unused-vars */

const states = {
    DRAWING: 0,
    TEMP: 1,
    EXECUTION: 2
};

let currentState = states.DRAWING;
let solveButton, resetButton, showTriangleButton, drawExamplePolygonButton, artButton;
let showBiggestTriangle = true;
let realBiggestTriangle;

let polygon;
let points = [];
let history = [];
let executionStep = -1;
let scale = 0.2;

let names = ["a", "b", "c"]; //points name



function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(canvasClicked); //click on buttons are not detected

    createCounterExamplePolygonPoints();

    resetButton = createButton("Reset");
    resetButton.position(30, 100);
    resetButton.mousePressed(reset);

    solveButton = createButton("Solve");
    solveButton.position(100, 100);
    solveButton.mousePressed(solve);

    drawExamplePolygonButton = createButton("Draw counter-example polygon");
    drawExamplePolygonButton.position(170, 100);
    drawExamplePolygonButton.mousePressed(drawExamplePolygonButtonHandler);

    artButton = createButton("Go back to triangulation and enclosed triangle algorithms");
    artButton.position(30, 60);
    artButton.mousePressed(() => window.location.href = "../index.html");

    reset();
}

function drawExamplePolygonButtonHandler() {
    points = createCounterExamplePolygonPoints();
    solve();
}

function showTriangleButtonHandler() {
    let text = showBiggestTriangle ? "Show real maximal triangle" : "Hide real maximal triangle"
    showBiggestTriangle = !showBiggestTriangle;
    if (showTriangleButton) showTriangleButton.remove();
    showTriangleButton = createButton(text);
    showTriangleButton.position(30, 140);
    showTriangleButton.mousePressed(showTriangleButtonHandler);
}

function createCounterExamplePolygonPoints() {
    // create the counter-example polygon
    //let shift = windowHeight/scale;
    let yshift = windowHeight / scale;
    let res = [ //counter example of the algorithm
        new Point(1000, yshift - 1000),
        new Point(759, yshift - 2927),
        new Point(2506, yshift - 4423),
        new Point(3040, yshift - 4460),
        new Point(4745, yshift - 4322),
        new Point(4752, yshift - 4262),
        new Point(5000, yshift - 1000),
        new Point(3383, yshift - 413),
        new Point(1213, yshift - 691)
    ];

    res.map(point => {
        point.x *= scale;
        point.y *= scale;
    });

    return res;
}

function draw() {
    background(255, 255, 255);
    fill("black");
    stroke("black");
    textSize(20);
    switch (currentState) {
        case states.DRAWING: {
            text("Draw a polygon point by point (CH will be computed) or directly draw a counter-example polygon", 30, 30);
            break;
        }
        case states.EXECUTION: {
            text("Left click to show the next step of dobkin & snyder's algorithm", 30, 30);
            polygon.draw();
            if (executionStep >= 0) {
                let i = executionStep;
                if (i !== history.length) {
                    let currentTriangle = history[i]["triangle"];
                    currentTriangle.fill = "rgba(0,255,0, 0.25)";
                    currentTriangle.draw();

                    fill("black");
                    stroke("black");
                    textSize(15);
                    for (let i = 0; i < 3; ++i) {
                        let point = currentTriangle.get(i)
                        text(names[i], point.x, point.y)
                    }
                } else {
                    --i;
                }
                let curentMaxTriangle = history[i]["currentMax"];
                curentMaxTriangle.fill = "rgba(255,0,0, 0.25)";
                curentMaxTriangle.draw();
            }

            if (showBiggestTriangle) {
                realBiggestTriangle.fill = "rgba(0,0,255,0.25)";
                realBiggestTriangle.draw();
            }
        }
    }

    points.map(p => p.draw());

}

function solve() {
    if (points.length < 3) {
        alert("You must draw at least 3 points");
        return
    }
    polygon = new Polygon(points);
    points = polygon.points; //correspond to the convex hull
    polygon.fill = "white";

    currentState = states.EXECUTION;
    solveButton.hide();
    drawExamplePolygonButton.hide();
    showTriangleButton.show();

    realBiggestTriangle = largest_triangle(polygon)[0];
    let ds = new DobkinSnyder(polygon);
    ds.maxTriangle(points.length - 1);
    history = ds.getHistory();
}

function reset() {
    currentState = states.DRAWING;

    showBiggestTriangle = true;
    showTriangleButtonHandler()

    solveButton.show();
    drawExamplePolygonButton.show();
    showTriangleButton.hide();
    history = [];
    executionStep = -1;
    points = [];


}

function canvasClicked() {
    switch (currentState) {
        case states.DRAWING: {
            let newPoint = new Point(mouseX, mouseY);
            points.push(newPoint)
            break;
        }
        case states.EXECUTION: {
            if (mouseButton === LEFT && executionStep < history.length) ++executionStep;
            else if (mouseButton === RIGHT && executionStep >= 0) --executionStep;
            break;
        }
    }
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
