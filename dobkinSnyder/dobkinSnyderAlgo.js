class DobkinSnyder{
    constructor(polygon, conserveHistory=true) {
        this.polygon = polygon;
        this.history = [];
        this.conserveHistory = conserveHistory
    }

    maxTriangle(r = 0) {
        this.history = []
        let polygon = this.polygon;
        let a = r, b = polygon.next(a), c = polygon.next(b);

        let currentMaxTriangle = new Triangle([polygon.points[a], polygon.points[b], polygon.points[c]]);
        let m = currentMaxTriangle.area();

        if(this.conserveHistory){
            this.history.push({
                "triangle": currentMaxTriangle,
                "currentMax": currentMaxTriangle
            });
        }

        while(true){
            while (true){
                let t = new Triangle([polygon.points[a], polygon.points[b], polygon.points[c]]);
                let t1 = new Triangle([polygon.points[a], polygon.points[b], polygon.points[polygon.next(c)]]);
                let t2 = new Triangle([polygon.points[a], polygon.points[polygon.next(b)], polygon.points[c]]);

                if (t1.area() >= t.area()){
                    c = polygon.next(c);
                    if(this.conserveHistory){
                        this.history.push({
                            "triangle": t1,
                            "currentMax": currentMaxTriangle
                        });
                    }
                } else if (t2.area() >= t.area()){
                    b = polygon.next(b);
                    if(this.conserveHistory){
                        this.history.push({
                            "triangle": t2,
                            "currentMax": currentMaxTriangle
                        });
                    }
                } else {
                    break;
                }
            }

            let newTriangle = new Triangle([polygon.points[a],polygon.points[b],polygon.points[c]]);
            let newTriangleArea = newTriangle.area();

            if (newTriangleArea>=m){
                m = newTriangleArea;
                currentMaxTriangle = newTriangle;
            }

            a = polygon.next(a);
            if (b===a) b = polygon.next(b);
            if (c===b) c = polygon.next(c);

            if(a===r){
                return newTriangle;
            }

            if(this.conserveHistory){
                this.history.push({
                    "triangle": new Triangle([polygon.points[a],polygon.points[b],polygon.points[c]]),
                    "currentMax": currentMaxTriangle
                });
            }
        }
    }

    getHistory() {
        return this.history;
    }
}
