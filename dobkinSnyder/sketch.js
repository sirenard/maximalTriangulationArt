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
let xshift = 0, yshift = 0;

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
    let res = [ //counter example of the algorithm
        new Point(1000, - 1000),
        new Point(759,  - 2927),
        new Point(2506,  - 4423),
        new Point(3040,  - 4460),
        new Point(4745,  - 4322),
        new Point(4752,  - 4262),
        new Point(5000,  - 1000),
        new Point(3383,  - 413),
        new Point(1213,  - 691)
    ];

    /*res = [new Point(1490.5266219523446,80.337009059891), new Point(1497.9141973976757,90.52607814634382), new Point(1499.999985067411,72.37259295184046), new Point(1500.0,60.409443559189114), new Point(1499.7910016438882,52.62904882598881), new Point(1495.756902791402,50.00001985340772), new Point(1487.3731446928516,50.00003695293534), new Point(1473.5739446554273,50.29970616585648), new Point(1485.7516335760577,73.41278581187846)]

    scale=1;
    let sscale = 29;
    let xshift = -42000;
    let yyshift = 1400;

    res.map(p => {p.x*=sscale;p.y*=sscale;p.y=yshift-p.y})
    res.map(p => {p.x+=xshift;p.y+=yyshift})*/
    let s = ""
    let n = 800
    let pos = ["left", "left", "above left", "above", "above left", "right", "right", "below", "below left"];
    let i = 0
    let letter = 65;
    let nodes = []
    console.log(res[0])

    //console.log(res.map(p => "=(" + p.x + "," + (-p.y+yshift) + ")").join(",\\;"))

    for (p of res) {
        let t = String.fromCharCode(letter++)
        nodes.push("(" + t + ")")

        s = s + '\\coordinate (' + t + ') at (' + p.x / n + ',' + (-p.y + yshift) / n + ');\n';
        s = s + "\\draw [fill=black](" + t + ") circle (0.8pt) node [" + pos[i++] + "] {" + t + "};\n";
    }

    s = s + "\\draw " + nodes.join(" --") + " -- cycle;\n";
    //console.log(s)

    positionPolygon(res);

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
            textSize(15);
            polygon.draw(scale, xshift, yshift);
            if (executionStep >= 0) {
                let i = executionStep;
                if (i !== history.length) {
                    let currentTriangle = history[i]["triangle"];
                    text("Triangle abc area (green): " + Math.round(currentTriangle.area()), 30 , 225);
                    currentTriangle.fill = "rgba(0,255,0, 0.25)";
                    currentTriangle.draw(scale, xshift, yshift);

                    fill("black");
                    stroke("black");
                    textSize(15);
                    for (let i = 0; i < 3; ++i) {
                        let point = currentTriangle.get(i)
                        text(names[i], point.x * scale + xshift, point.y * scale + yshift)
                    }
                } else {
                    --i;
                }
                let curentMaxTriangle = history[i]["currentMax"];
                text("Current max area (red): " + Math.round(curentMaxTriangle.area()), 30, 200);
                curentMaxTriangle.fill = "rgba(255,0,0, 0.25)";
                curentMaxTriangle.draw(scale, xshift, yshift);
            }

            if (showBiggestTriangle) {
                realBiggestTriangle.fill = "rgba(0,0,255,0.25)";
                realBiggestTriangle.draw(scale, xshift, yshift);
                text("Real biggest triangle (blue): " + Math.round(realBiggestTriangle.area()), 30 , 250);

            }
        }
    }

    points.map(p => p.draw(scale, xshift, yshift));

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
    ds.maxTriangle(points.length - 2);
    history = ds.getHistory();
}

function positionPolygon(points) {

    let x_max = Math.max.apply(Math, points.map(p => p.x))
    let y_max = Math.max.apply(Math, points.map(p => p.y))
    let x_min = Math.min.apply(Math, points.map(p => p.x))
    let y_min = Math.min.apply(Math, points.map(p => p.y))

    let x_scale =  (0.8*windowWidth) / (x_max - x_min);
    let y_scale = (0.8*windowHeight) / (y_max - y_min);

    scale = Math.min(x_scale, y_scale);

    let x_average = points.reduce((a, p) => a + p.x, 0) * scale / points.length;
    let y_average = points.reduce((a, p) => a + p.y, 0) * scale / points.length;

    xshift = - x_average + windowWidth/2;
    yshift = - y_average +  windowHeight/2;
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

    scale = 1;
    xshift=0;
    yshift=0;


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
    if(currentState === states.EXECUTION) positionPolygon(polygon.points)
};
