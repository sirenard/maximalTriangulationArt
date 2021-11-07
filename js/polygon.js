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

    /* return the next clockwise point index after points[i] */
    next(i) {
        return (i + 1) % this.points.length;
    }

    /* return list of points between index [i, j] (i j include) */
    ptn_between(i, j) {
        let sub_points = [this.points[i]]
        while (i !== j){
            i = this.next(i)
            sub_points.push(this.points[i]);
        }
        return sub_points;
    }

    draw() {
        fill(this.fill);
        beginShape();
        for (let i = 0; i < this.points.length; ++i)
            vertex(this.points[i].x, this.points[i].y)
        endShape(CLOSE);
    }

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

    // return the turn orientation formed by p1 p2 p3: true if left otherwise false
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
}

class Triangle extends Polygon {
    constructor(points) {
        console.assert(points.length === 3);
        console.log(points.length);
        super(points, false);
        this.a = this.points[0];
        this.b = this.points[1];
        this.c = this.points[2];
    }

    area() {
        return 0.5 * Math.abs(this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) +
            this.c.x * (this.a.y - this.b.y))
    }
}
