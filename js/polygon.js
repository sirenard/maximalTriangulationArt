class Point {
    constructor(x, y, color = "black", radius = 3) {
        this.x = x
        this.y = y
        this.color = color;
        this.radius = radius;
    }

    draw() {
        fill(this.color);
        stroke(this.color);
        ellipse(this.x, this.y, this.radius, this.radius);
    }
}

class Polygon {
    constructor(points, convexHull = true, fill = "blue") {
        this.points = points;
        if (convexHull) this.graham_scan();
        this.fill = fill;
    }

    get(i){ //get point i in polygon (cyclic)
        return this.points[i% this.points.length];
    }

    getLength() {
        return this.points.length;
    }
    /* return the next clockwise point index after points[i] */
    next(i) {
        return (i + 1) % this.points.length;
    }

    /* return list of points between index [i, j] (i j include) */
    ptn_between(i, j) {
        let sub_points = [this.points[i]]
        while (i !== j) {
            i = this.next(i)
            sub_points.push(this.points[i]);
        }
        return sub_points;
    }

    draw(scale=1) {
        fill(this.fill);
        beginShape();
        for (let i = 0; i < this.points.length; ++i)
            vertex(this.points[i].x*scale, this.points[i].y*scale)
        endShape(CLOSE);
    }

    /* Compute the convex hull of the polygon by removing internal points */
    graham_scan() {
        let leftmost_point = this.get_leftmost_point(); // smallest x coord. point
        this.points.sort((p1, p2) => this.compare_radial(p1, p2, leftmost_point)); // sort points around leftmost_point
        let stack = [this.points[0], this.points[1]];
        for (let i = 2; i < this.points.length; ++i) {
            while (
                stack.length > 1 &&
                !this.lt_orientation(
                    stack[stack.length - 2],
                    stack[stack.length - 1],
                    this.points[i]
                )
                )
                stack.pop();
            stack.push(this.points[i]);
        }
        this.points = stack;
    }

    /* return the turn orientation formed by p1 p2 p3: true if left otherwise false */
    lt_orientation(p1, p2, p3) {
        let cross_product_determinant =
            p1.x * (p2.y - p3.y) - p1.y * (p2.x - p3.x) + p2.x * p3.y - p3.x * p2.y;
        return cross_product_determinant >= 0;
    }

    get_leftmost_point() {
        let farLeftPointIndex = 0;
        for (let i = 0; i < this.points.length; i++)
            if (this.points[i].x <= this.points[farLeftPointIndex].x) farLeftPointIndex = i;
        return this.points[farLeftPointIndex];
    }

    compare_radial(p1, p2, leftmost_point) {
        if (p1 === p2) return 0;
        else if (p1 === leftmost_point) return -1;
        else if (p2 === leftmost_point) return 1;
        else if (this.lt_orientation(leftmost_point, p1, p2)) return -1;
        else return 1;
    }

    isInsideTriangle(triangle) {
        for (let i=0; i<this.points.length; ++i){
            let rightTurn = 0;
            let leftTurn = 0;
            for (let j = 0; j < 3; ++j) {
                if (!this.lt_orientation(this.points[i], triangle[j], triangle[(j + 1) % 3])) {
                    rightTurn += 1;
                } else leftTurn += 1;
            }
            if (!(rightTurn === 3 || leftTurn === 3)) return false;
        }
        return true;
    }
}

class Triangle extends Polygon {
    constructor(points, fill = "red") {
        console.assert(points.length === 3);
        super(points, false, fill);
    }

    area() {
        let [a, b, c] = [this.points[0], this.points[1], this.points[2]]
        return 0.5 * Math.abs(a.x * (b.y - c.y) + b.x * (c.y - a.y) +
            c.x * (a.y - b.y))
    }
}
