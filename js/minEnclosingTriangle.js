class MinEnclosingTriangle {
    constructor(polygon){
        this.polygon = polygon;
        this.minEnclosingTriangle = null;
        this.EPSILON = 10**-5;
    }

    findMinEnclosingTriangle(){
        for (let i = 0; i < this.polygon.getLength(); ++i){
            let s1 = [this.polygon.get(i), this.polygon.get(i+1)]; // first side of enclosing triangle

            for (let j = 0; j < this.polygon.getLength(); ++j){
                let s2 = [this.polygon.get(j), this.polygon.get(j+1)]; // second side of enclosing triangle

                if (this.polygon.get(j) !== this.polygon.get(i)){
                    let vertexB = this.getLineIntersection(s1, s2);
                    if (vertexB) { //not parallel lines
                        for (let k = 0; k < this.polygon.getLength(); ++k) {
                            if (this.polygon.get(k) !== this.polygon.get(i)
                                && this.polygon.get(k) !== this.polygon.get(i + 1)
                                && this.polygon.get(k) !== this.polygon.get(j)
                                && this.polygon.get(k) !== this.polygon.get(j + 1)) {

                                let enclosingTriangle = this.computeEnclosingTriangle(s1, s2, k, vertexB);
                                if (this.minEnclosingTriangle === null || enclosingTriangle.area() < this.minEnclosingTriangle.area)
                                    if (this.enclosesAllPoints(enclosingTriangle))
                                            this.minEnclosingTriangle = enclosingTriangle;

                            }
                        }
                    }
                }
            }
        }
    }

    enclosesAllPoints(enclosingTriangle){
        let allPointsPolygon = new Polygon(this.polygon.points.concat(enclosingTriangle));
        let allPoints = allPointsPolygon.points;
        allPointsPolygon.gram_scan()
        for (let i=0; i<allPoints.length; ++i){
            if (allPoints[i] !== allPointsPolygon.points[i]) return false;
        }
        return true;
    }

    computeEnclosingTriangle(s1, s2 , k, vertexB){
        let s3 =  [this.polygon.get(k), this.polygon.get(k+1)];

        //compute vertices A and C for triangle with two flush sides and one tangent with polygon
        let verticesAC = this.computeVerticesACFromMidpointB(s1,s2,k);
        let enclosingTangentTriangle = new Triangle([verticesAC[0], vertexB, verticesAC[1]]);

        //compute vertices A and C for triangle with two flush sides and one tangent with polygon
        let verticesACFlushTriangle = this.computeVerticesACFromFlushB(s1, s2, s3);
        let flushEnclosingTriangle = new Triangle([verticesACFlushTriangle[0], vertexB, verticesACFlushTriangle[1]]);

        //return smallest enclosing triangle between the two
        if (enclosingTangentTriangle.area() >  flushEnclosingTriangle.area()) return flushEnclosingTriangle;
        return enclosingTangentTriangle;
    }

    computeVerticesACFromMidpointB(sideC, sideA, k){
        let sideCParameters = this.getLineEquations(sideC);
        let a1 = sideCParameters[0];
        let b1 = sideCParameters[1];
        let c1 = sideCParameters[2];

        // Side B parameters
        let sideAParameters = this.getLineEquations(sideA);
        let a2 = sideAParameters[0];
        let b2 = sideAParameters[1];
        let c2 = sideAParameters[2];

        // Polygon point "b" coordinates
        let m = this.polygon.points[k].x;
        let n = this.polygon.points[k].y;

        // Compute vertices A and C x-coordinates
        let x2 = ((2 * b1 * b2 * n) + (c1 * b2) + (2 * a1 * b2 * m) + (b1 * c2)) / ((a1 * b2) - (a2 * b1));
        let x1 = (2 * m) - x2;

        // Compute vertices A and C y-coordinates
        let y2, y1;

        if (this.tendsTo0(b1)) {          // b1 = 0 and b2 != 0
            y2 = ((-c2) - (a2 * x2)) / (b2);
            y1 = (2 * n) - y2;
        } else if (this.tendsTo0(b2)) {   // b1 != 0 and b2 = 0
            y1 = ((-c1) - (a1 * x1)) / (b1);
            y2 = (2 * n) - y1;
        } else {                                    // b1 != 0 and b2 != 0
            y1 = ((-c1) - (a1 * x1)) / (b1);
            y2 = ((-c2) - (a2 * x2)) / (b2);
        }

        // Update vertices A and C coordinates
        let vertexA = new Point(x1, y1);
        let vertexC = new Point(x2, y2);

        return [vertexA, vertexC]
    }

    getLineEquations(side){
        /**
         * From two points defining a line, return parameters a, b, c such that the line equation is ax + by = c
         * @type {number}
         */
        let a = side[1].y - side[0].y;
        let b = side[0].x - side[1].x;
        let c = ((-side[0].y) * b) - (side[0].x * a);
        return [a,b,c]
    }

    tendsTo0(value){
        return Math.abs(value) <= this.EPSILON;
    }

    computeVerticesACFromFlushB(sideC, sideA, sideB){
        let vertexA = this.getLineIntersection(sideA, sideB);
        let vertexC = this.getLineIntersection(sideC, sideB);
        return [vertexC, vertexA];
    }

    getLineIntersection(line1, line2){
        /**
         * finds the intersection of two infinite lines determined by two points.
         * @type {number}
         */
        let y1 = line1[1].y - line1[0].y;
        let x1 = line1[0].x - line1[1].x;
        let c1 = y1*line1[0].x + x1*line1[0].y;

        let y2 = line2[1].y - line2[0].y;
        let x2 = line2[0].x - line2[1].x;
        let c2 = y2*line2[0].x + x2*line2[0].y;

        let det = y1*x2 - y2*x1;
        if (det){
            let intersectionX = (x2*c1 - x1*c2)/det;
            let intersectionY = (y1*c2 - y2*c1)/det;
            return new Point(intersectionX, intersectionY);
        } else return null; //parallel lines
    }
}