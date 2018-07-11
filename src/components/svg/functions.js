
import each from 'lodash/each';
import first from 'lodash/first';
import map from 'lodash/map';
import clamp from 'lodash/clamp';
import range from 'lodash/range';
import bspline from 'b-spline';
import * as d3 from 'd3-path';

export function pathTransform(scale, rotation, center, position) {
    return [
        `translate(${position.x} ${position.y})`,
        `scale(${scale.x} ${scale.y})`,
        `translate(-${position.x} -${position.y})`,
        `rotate(${rotation * 180 / Math.PI} ${center.x} ${center.y})`
    ].join(' ');
}

export function textTransform(rotation, center) {
    return `rotate(${rotation * 180 / Math.PI} ${center.x} ${center.y})`;
}

export function imageTransform(rotation, center) {
    return `rotate(${rotation * 180 / Math.PI} ${center.x} ${center.y})`;
}

export function serializeSvgPathData(path) {
    const { padding, vertices } = path.toJS();
    const context = d3.path();
    const firstVertex = first(vertices);
    context.moveTo(firstVertex.x + padding, firstVertex.y + padding);
    each(interpolateVertices(vertices), (vertex, i) => {
        const { x, y } = vertex;
        context.lineTo(x + padding, y + padding);
    });
    return context.toString();
}

export function interpolateVertices(vertices, degree = 2) {
    const points = mapVertices(vertices);
    const interpolate = t => bspline(t, degree, points);
    const interval = clamp(1 / (vertices.length * 10), 0.002, 1);
    return map(range(0, 1, interval), t => mapVecToVertex(interpolate(t)));
}

function mapVertices(vertices) {
    return map(vertices, convertVertexToArray);
}

function mapVecToVertex([x, y]) {
    return { x, y };
}

function convertVertexToArray({ x, y }) {
    return [x, y];
}

export function asPixels(number) {
    return `${number}px`;
}

export function createViewBox(x, y, width, height) {
    return `0 0 ${width} ${height}`;
}
