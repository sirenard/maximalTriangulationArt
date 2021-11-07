// return a array [Triangle, [a_i, b_i, c_i]] where the second value is
// the indexes of the three points which compose the Triangle
function biggest_triangle(polygon) {
    let a = polygon.points[0]; // root of the 2-stable triangle
    let a_i = 0;
    let b = polygon.points[1];
    let b_i = 1;
    let c = polygon.points[2];
    let c_i = 2;
    let m = new Triangle([a, b, c]);
    let m_i = [a_i, b_i, c_i];

    while (true) { // find the biggest 3-stable triangle
        while (true) { // find a 2-stable triangle
            let abc_is_two_stable = true;
            let c_n = polygon.points[polygon.next(c_i, a_i)];
            let b_n = polygon.points[polygon.next(b_i, c_i)];

            if (c_n !== c && area(a, b, c_n) >= area(a, b, c)) {
                c = c_n;
                c_i = polygon.next(c_i, a_i);
                abc_is_two_stable = false;
            }
            if (b_n !== b && area(a, b_n, c) >= area(a, b, c)) {
                b = b_n;
                b_i = polygon.next(b_i, c_i);
                abc_is_two_stable = false;
            }

            if (abc_is_two_stable)
                break;
        }

        if (area(a, b, c) >= m.area()) {
            m = new Triangle([a, b, c]);
            m_i = [a_i, b_i, c_i];
        }

        a_i = polygon.next(a_i, b_i);
        a = polygon.points[a_i];
        if (a_i === 0) // all roots have been tested
            return [m, m_i];
    }
}

/* Fill the array triangles with all triangle resulting of his maximal triangulation */
function maximal_triangulation(polygon, triangles) {
    let triangle, indexes;
    if (polygon.points.length < 3)
        return
    else if (polygon.points.length > 3) {
        [triangle, indexes] = biggest_triangle(polygon);
        maximal_triangulation(new Polygon(polygon.ptn_between(indexes[0], indexes[1]), false), triangles);
        maximal_triangulation(new Polygon(polygon.ptn_between(indexes[1], indexes[2]), false), triangles);
        maximal_triangulation(new Polygon(polygon.ptn_between(indexes[2], indexes[0]), false), triangles);
    } else
        triangle = new Triangle([...polygon.points])

    triangles.push(triangle);
}

/* Return of the triangle abc */
function area(a, b, c) {
    return 0.5 * Math.abs(a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
}