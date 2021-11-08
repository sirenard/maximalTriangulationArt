/* eslint-disable no-undef, no-unused-vars */

const states = {
    TEMP: 0,
    EXECUTION: 1
};

let currentState = states.TEMP;
let solveButton, resetButton, showTriangleButton;
let showBiggestTriangle = true;

let polygon;
let history = [];
let scale = 0.2;

let names = ["b0", "b1", "c2", "a0", "b2", "a1", "c0", "a2", "c1"]; //points name


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(canvasClicked); //click on buttons are not detected

    createPolygon();

    resetButton = createButton("Reset");
    resetButton.position(30, 60);
    resetButton.mousePressed(reset);

    showTriangleButtonHandler()

    solveButton = createButton("Execute Dobkin & Snyder's algorithm");
    solveButton.position(30, 120);
    solveButton.mousePressed(solve);

}

function showTriangleButtonHandler() {
    let text = showBiggestTriangle?"Show maximal triangle":"Hide maximal triangle"
    showBiggestTriangle = !showBiggestTriangle;
    if(showTriangleButton)showTriangleButton.remove();
    showTriangleButton = createButton(text);
    showTriangleButton.position(30, 90);
    showTriangleButton.mousePressed(showTriangleButtonHandler);
}

function createPolygon() {
    // create the counter-example polygon
    let shift = windowHeight/scale;
    polygon = new Polygon([ //counter example of the algorithm
        new Point(1000, shift-1000),
        new Point(759, shift-2927),
        new Point(2506, shift-4423),
        new Point(3040, shift-4460),
        new Point(4745, shift-4322),
        new Point(4752, shift-4262),
        new Point(5000, shift-1000),
        new Point(3383, shift-413),
        new Point(1213, shift-691)
    ],convexHull=false, color="white");
}

function draw() {
    background(128);
    polygon.draw(scale);

    if(history.length){
        if(history[0]["triangle"]){
            let curentTriangle = history[0]["triangle"];
            curentTriangle.fill = "rgba(0,255,0, 0.25)";
            curentTriangle.draw(scale);
        }
        let curentMaxTriangle = history[0]["currentMax"];

        curentMaxTriangle.fill = "rgba(255,0,0, 0.25)";

        curentMaxTriangle.draw(scale);
    }

    if(showBiggestTriangle){
        let t = new Triangle([polygon.points[0], polygon.points[3], polygon.points[6]], "rgba(0,0,255,0.25)");
        t.draw(scale);
    }

    textSize(12);
    fill("Black");
    stroke("Black");
    for (let i = 0; i < polygon.points.length; ++i) {
        let point = polygon.points[i];
        let label = names[i];
        text(label, point.x*scale, point.y*scale);
    }
}

function solve(){
    currentState = states.EXECUTION;
    solveButton.hide();

    let ds = new DobkinSnyder(polygon);
    ds.maxTriangle();
    history = ds.getHistory();
}

function reset(){
    currentState = states.TEMP;
    solveButton.show();
    history = []
}

function canvasClicked(){
    if (currentState === states.EXECUTION){
        if(history.length > 1){
            history.splice(0,1);
        } else if(history.length === 1 && history[0]["triangle"]){
            history[0]["triangle"] = undefined;
        }
    }
}

// This Redraws the Canvas when resized
windowResized = function() {
    resizeCanvas(windowWidth, windowHeight);
};
