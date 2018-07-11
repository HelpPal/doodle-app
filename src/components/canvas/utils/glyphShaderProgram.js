
import glyphFragmentShader from '../../../shaders/glyph.frag';
import glyphVertexShader from '../../../shaders/glyph.vert';
import { WebGLTypes } from '../../constants';

export default {
    fragmentShaderSource: glyphFragmentShader,
    vertexShaderSource: glyphVertexShader,
    uniforms: {
        resolution: {
            type: WebGLTypes.Vec2
        }
    },
    attributes: {
        position: {
            type: WebGLTypes.Vec2
        },
        rotation: {
            type: WebGLTypes.Float
        },
        center: {
            type: WebGLTypes.Vec2
        }
    }
};
