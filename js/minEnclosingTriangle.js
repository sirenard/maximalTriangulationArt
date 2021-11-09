class MinEnclosingTriangle {
    constructor(polygon){
        this.polygon = polygon;
    }

    findMinEnclosingTriangle(){
        for (let i = 0; i < this.polygon.length; ++i){
            let s1 = [this.polygon.get(i), this.polygon.get(i+1)]; // first side of enclosing triangle
            for (let j = 0; j < this.polygon[i].length; ++j){
                if (this.polygon.get(j) !== this.polygon.get(i)){
                    let s2 = [this.polygon.get(j), this.polygon.get(j+1)]; // second side of enclosing triangle
                    let e1OfTriangle = this.getLineIntersection(s1, s2);
                    if (e1OfTriangle) { //not parallel lines
                        for (let k = 0; k < this.polygon[i].length; ++k) {
                            if (this.polygon.get(k) !== this.polygon.get(i)
                                && this.polygon.get(k) !== this.polygon.get(i + 1)
                                && this.polygon.get(k) !== this.polygon.get(j)
                                && this.polygon.get(k) !== this.polygon.get(j + 1)) {
                                //let centroid = this.getTriangleCentroid();


                            }
                        }
                    }
                }
            }
        }
    }

    getLineIntersection(line1, line2){
        /**
         * finds the intersection of two infinite lines determined by two points.
         * @type {number}
         */
        // https://www.geeksforgeeks.org/program-for-point-of-intersection-of-two-lines/
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

    getTriangleCentroid(side1, side2, point){
        /**
         * get triangle's centroid
         * side1 and side2 are rays (as we haven't defined the last side of the triangle)
         * param side1 : first edge of triangle
         * param side2 : second edge of triangle
         * param point : center point of the last edge of the triangle
         */


    }
}