function largest_triangle(polygon) {
    /**
     * Find the largest triangle in a polygon
     * @param {Polygon} polygon
     * @return {array} [Triangle, [a_i, b_i, c_i]] where the second value is
     * the indexes of the three points which compose the Triangle
     */
    let a_i = 0;
    let a = polygon.points[a_i]; // root
    let b_i = polygon.next(a_i);
    let b = polygon.points[b_i];
    let c_i = polygon.next(b_i);
    let c = polygon.points[c_i];
    let m = new Triangle([a, b, c]);
    let m_i = [a_i, b_i, c_i];

    while (true) { // test each vertex as root a
        while (polygon.next(c_i) !== a_i) { // try to augmenting the area by moving b and save if a larger triangle is found
            while (true) { // try to augmenting the area by moving c
                let c_n = polygon.points[polygon.next(c_i)];
                if (area(a, b, c_n) >= area(a, b, c)) {
                    c = c_n;
                    c_i = polygon.next(c_i);
                } else
                    break;
            }

            if (area(a, b, c) >= m.area()) {
                m = new Triangle([a, b, c]);
                m_i = [a_i, b_i, c_i];
            }
            b_i = polygon.next(b_i);
            b = polygon.points[b_i];
        }

        // test an other root
        a_i = polygon.next(a_i);
        a = polygon.points[a_i];
        if (a_i === 0) // all roots have been tested
            return [m, m_i];

        // reset b and c
        b_i = polygon.next(a_i);
        b = polygon.points[b_i];
        c_i = polygon.next(b_i);
        c = polygon.points[c_i];
    }
}

/* Fill the array triangles with all triangle resulting of his maximal triangulation */
function largest_triangulation(polygon, triangles) {
    /**
     * Perform a largest triangulation of a polygon
     * @param {Polygon} polygon the polygon to triangulate
     * @param {array} triangles the triangles will be pushed in this array
     */
    let triangle, indexes;
    if (polygon.points.length < 3) // it's not a polygon
        return
    else if (polygon.points.length > 3) { // it's a convex polygon
        // at most 3 new convex polygons are created if we remove the largest triangle
        [triangle, indexes] = largest_triangle(polygon);
        largest_triangulation(new Polygon(polygon.ptn_between(indexes[0], indexes[1]), false), triangles);
        largest_triangulation(new Polygon(polygon.ptn_between(indexes[1], indexes[2]), false), triangles);
        largest_triangulation(new Polygon(polygon.ptn_between(indexes[2], indexes[0]), false), triangles);
    } else // it's a triangle
        triangle = new Triangle([...polygon.points])

    triangles.push(triangle);
}


function area(a, b, c) {
    /**
     * Compute the area of the triangle abc
     * @param {Point} a
     * @param {Point} b
     * @param {Point} c
     * @return {int} the area
     */
    return 0.5 * Math.abs(a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
}