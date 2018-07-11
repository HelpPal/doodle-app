
import each from 'lodash/each';

import { bindAttributeData, setVec2Uniform, setFloatUniform } from './GLUtil';
import { WebGLTypes } from '../../constants';

export default class GLProgram {

    constructor(gl, options) {
        this.fragmentShaderSource = options.fragmentShaderSource;
        this.vertexShaderSource = options.vertexShaderSource;
        this.uniforms = options.uniforms;
        this.attributes = options.attributes;
        this.gl = gl;
        this.program = createShaderProgram(gl,
                                           this.vertexShaderSource,
                                           this.fragmentShaderSource);
        this.textures = {};
    }

    getFragmentShaderSource() {
        return this.fragmentShaderSource;
    }

    getVertexShaderSource() {
        return this.vertexShaderSource;
    }

    setUniform(name, value) {
        const uniform = this.uniforms[name];
        switch (uniform.type) {
            case WebGLTypes.Vec2:
                return setVec2Uniform(this.gl, this.program, name, value);
            case WebGLTypes.Float:
                return setFloatUniform(this.gl, this.program, name, value);
            default:
                console.error(`Uniform type ${JSON.stringify(uniform.type)}
                               is unimplemented.`);
        }
    }

    setAttribute(name, value) {
        const attribute = this.attributes[name];
        const { type, size } = attribute.type;
        const attribLocation = this.getAttributeLocation(name);
        return bindAttributeData(this.gl, attribLocation, value, size, this.gl[type]);
    }

    getAttributeLocation(name) {
        return this.gl.getAttribLocation(this.program, name);
    }

    setImageTexture(id, image) {
        if (this.textures[id]) {
            return;
        }
        const gl = this.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // NOTE: use the following code for power-of-two textures (optimal case)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.generateMipmap(gl.TEXTURE_2D);

        // NOTE: use the following code for non-power-of-two textues (non-optimal case)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_2D, null);
        this.textures[id] = texture;
    }

    activateTextureUniform(uniformName, id) {
        const gl = this.gl;
        const texture = this.textures[id];
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(this.program, uniformName), 0);
    }

    begin() {
        this.gl.useProgram(this.program);
        each(this.attributes, (object, name) => {
            const attribLocation = this.gl.getAttribLocation(this.program, name);
            this.gl.enableVertexAttribArray(attribLocation);
        });
    }

    end() {
        each(this.attributes, (object, name) => {
            const attribLocation = this.gl.getAttribLocation(this.program, name);
            this.gl.disableVertexAttribArray(attribLocation);
        });
        this.gl.useProgram(null);
    }
}

export function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const program = gl.createProgram();
    attachShaders(gl, program, vertexShaderSource, fragmentShaderSource);
    gl.linkProgram(program);
    const isLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    const isContextLost = gl.isContextLost();
    if (!isLinked && !isContextLost) {
        const infoLog = gl.getProgramInfoLog(program);
        console.error(infoLog);
        gl.deleteProgram(program);
        return;
    }
    return program;
}

export function attachShaders(gl, program, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    gl.attachShader(program, fragmentShader);
    gl.attachShader(program, vertexShader);
}

export function createShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const didCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    const isContextLost = gl.isContextLost();
    if (!didCompile && !isContextLost) {
        const infoLog = gl.getShaderInfoLog(shader);
        console.error(infoLog);
        gl.deleteShader(shader);
        return;
    }
    return shader;
}
