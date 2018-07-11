
import React, { PropTypes, Component } from 'react';
import { Map } from 'immutable';
import { vec2 } from 'gl-matrix';
import flatMap from 'lodash/flatMap';
import clamp from 'lodash/clamp';
import parseInt from 'lodash/parseInt';
import range from 'lodash/range';
import map from 'lodash/map';
import each from 'lodash/each';
import times from 'lodash/times';
import flatten from 'lodash/flatten';
import first from 'lodash/first';
import last from 'lodash/last';
import identity from 'lodash/identity';
import bspline from 'b-spline';
import Radium from 'radium';

import provideDimensions from '../provideDimensions';
import GlyphCollection from '../../models/GlyphCollection';
import PathCollection from '../../models/PathCollection';
import ImageCollection from '../../models/ImageCollection';
import provideGlyphs from './utils/provideGlyphs';
import providePaths from './utils/providePaths';
import provideImages from './utils/provideImages';
import GLProgram from './utils/GLProgram';
import pathShaderProgram from './utils/pathShaderProgram';
import glyphShaderProgram from './utils/glyphShaderProgram';
import imageShaderProgram from './utils/imageShaderProgram';
import WebGLCanvas from './WebGLCanvas';

import styles from './Canvas.styles';

@providePaths
@provideGlyphs
@provideImages
@provideDimensions
@Radium
export default class Canvas extends Component {

    static propTypes = {
        strokeWidth: PropTypes.number,
        paths: PropTypes.instanceOf(PathCollection),
        glyphs: PropTypes.instanceOf(GlyphCollection),
        images: PropTypes.instanceOf(ImageCollection),
        imageTextures: PropTypes.instanceOf(Map),
        dimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }

    static defaultProps = {
        strokeWidth: 15 // TODO srokeWidth should be part of the Path model, since it will vary for any given path
    }

    onSceneInitialized(gl) {
        gl.getExtension('OES_standard_derivatives');
        this.programs = {
            glyph: new GLProgram(gl, glyphShaderProgram),
            path: new GLProgram(gl, pathShaderProgram),
            images: new GLProgram(gl, imageShaderProgram)
        };
    }

    onSceneRender(gl) {
        this.renderImages(gl, this.programs.images, this.props.dimensions);
        this.renderGlyphs(gl, this.programs.glyph, this.props.dimensions);
        this.renderPaths(gl, this.programs.path, this.props.dimensions);
    }

    renderPaths(gl, program, { width, height }) {
        each(this.props.paths.toArray(), path => {
            const rawVertices = path.getVertices().toJS();
            if (rawVertices.length < 3) {
                return;
            }
            const vertices = interpolatePathVertices(rawVertices);
            const positions = getPolylineVertices(vertices);
            const directions = getPolylineDirections(vertices);
            const previous = getPreviousPolylineVertices(vertices);
            const next = getNextPolylineVertices(vertices);
            const centers = getPathCenters(path, positions);
            const rotations = getPathRotations(path, positions);
            program.begin();
            program.setUniform('resolution', vec2.fromValues(width, height));
            program.setUniform('strokeWidth', this.props.strokeWidth);
            program.setUniform('origin', convertVertexToArray(path.getPosition()));
            program.setUniform('scale', convertVertexToArray(path.getScale()));
            program.setUniform('beginVertex', convertVertexToArray(first(vertices)));
            program.setUniform('endVertex', convertVertexToArray(last(vertices)));
            program.setAttribute('position', positions);
            program.setAttribute('next', next);
            program.setAttribute('previous', previous);
            program.setAttribute('direction', directions);
            program.setAttribute('rotation', rotations);
            program.setAttribute('center', centers);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, parseInt(positions.length / 2));
            program.end();
        });
    }

    renderGlyphs(gl, program, { width, height }) {
        if (!this.props.glyphs.length) {
            return;
        }
        const vertices = getGlyphVertices(this.props.glyphs);
        const rotations = getGlyphRotations(this.props.glyphs);
        const centers = getGlyphCenters(this.props.glyphs);
        if (!vertices || !vertices.length) {
            return;
        }
        program.begin();
        program.setUniform('resolution', vec2.fromValues(width, height));
        program.setAttribute('position', vertices);
        program.setAttribute('rotation', rotations);
        program.setAttribute('center', centers);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
        program.end();
    }

    renderImages(gl, program, { width, height }) {
        const { images, imageTextures } = this.props;
        if (!images.length) {
            return;
        }
        each(images.toArray(), image => {
            const position = image.getPosition();
            const padding = image.getPadding();
            const size = image.getSize();
            const id = image.getId();
            const imageTexture = imageTextures.get(image.getUrl());
            if (!imageTexture) {
                return;
            }
            program.begin();
            program.setUniform('resolution', vec2.fromValues(width, height));
            program.setUniform('size', vec2.fromValues(size.width, size.height));
            program.setUniform('imageSize', vec2.fromValues(size.width, size.height));
            program.setUniform('origin', vec2.fromValues(position.x, position.y));
            program.setUniform('rotation', image.getRotation());
            program.setUniform('center', convertVertexToArray(image.getCenter()));
            program.setUniform('padding', padding);
            program.setImageTexture(id, imageTexture);
            program.activateTextureUniform('image', id);
            program.setAttribute('position', new Float32Array([
                position.x,
                position.y,
                position.x,
                position.y + size.height,
                position.x + size.width,
                position.y,
                position.x + size.width,
                position.y + size.height
            ]));
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            program.end();
        });
    }

    render() {
        return (
            <WebGLCanvas id="webGLCanvas"
                         dimensions={this.props.dimensions}
                         onSceneInitialized={this.onSceneInitialized.bind(this)}
                         onSceneRender={this.onSceneRender.bind(this)}
                         style={[this.props.dimensions, styles.container]} />
        );
    }
}

function getPathRotations(path, positions) {
    const rotation = path.getRotation() || 0;
    const rotations = times(positions.length, () => rotation);
    return new Float32Array(rotations);
}

function getPathCenters(path, positions) {
    const center = path.getCenter();
    const flattened = flatten(times(positions.length, () => convertVertexToArray(center)));
    return new Float32Array(flattened);
}

function interpolatePathVertices(path, degree = 2) {
    const points = mapVertices(path, v => ({ x: v.x, y: v.y }));
    const interpolate = t => bspline(t, degree, points);
    const interval = clamp(1 / (path.length * 10), 0.002, 1);
    return map(range(0, 1, interval), t => mapVecToVertex(interpolate(t)));
}

function mapVertices(vertices, predicate = identity) {
    return map(vertices, v => convertVertexToArray(predicate(v)));
}

function getGlyphVertices(glyphs) {
    const triangleVertices = flatMap(glyphs.toArray(), glyph => glyph.getPoints());
    const vertices = flatMap(triangleVertices, convertVertexToArray);
    if (!vertices.length) {
        return;
    }
    return new Float32Array(vertices);
}

function getGlyphRotations(glyphs) {
    const rotations = flatMap(glyphs.toArray(), glyph => {
        const rotation = glyph.getRotation() || 0;
        return times(glyph.getPoints().length, () => rotation);
    });
    if (!rotations.length) {
        return;
    }
    return new Float32Array(rotations);
}

function getGlyphCenters(glyphs) {
    const centerVertices = flatMap(glyphs.toArray(), glyph => {
        const center = glyph.getCenter();
        return times(glyph.getPoints().length, () => center);
    });
    const centers = flatMap(centerVertices, convertVertexToArray);
    if (!centers.length) {
        return;
    }
    return new Float32Array(centers);
}

// For every vertex in the path, get the previous point in the line.
// Previous points are used in the calculation of normals, and also as
// the start point of the bezier curve.
function getPreviousPolylineVertices(vertices) {
    return flatMapVerticesToArray(vertices, (v, i) => {
        const index = clamp(i - 1, 0, vertices.length - 1);
        return [vertices[index], vertices[index]];
    });
}

// For every vertex in the path, get the next point in the line.
// Next points are used in the calculation of normals, and also as the
// end point of the bezier curve.
function getNextPolylineVertices(vertices) {
    return flatMapVerticesToArray(vertices, (v, i) => {
        const index = clamp(i + 1, 0, vertices.length - 1);
        return [vertices[index], vertices[index]];
    });
}

function getPolylineVertices(lineVertices) {
    return flatMapVerticesToArray(lineVertices, v => [v, v]);
}

function getPolylineDirections(lineVertices) {
    return new Float32Array(flatMap(lineVertices, v => [-1, 1]));
}

function flatMapVerticesToArray(vertices, predicate) {
    return new Float32Array(flatMap(vertices, (...args) => flatMapVertexToVec(predicate(...args))));
}

function convertVertexToArray({ x, y }) {
    return [x, y];
}

function mapVecToVertex([x, y]) {
    return { x, y };
}

function flatMapVertexToVec(vertices) {
    return flatMap(vertices, convertVertexToArray);
}
