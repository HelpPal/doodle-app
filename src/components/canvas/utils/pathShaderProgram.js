
import pathFragmentShader from '../../../shaders/path.frag';
import pathVertexShader from '../../../shaders/path.vert';
import { WebGLTypes } from '../../constants';

export default {
    vertexShaderSource: pathVertexShader,
    fragmentShaderSource: pathFragmentShader,
    uniforms: {
        resolution: {
            type: WebGLTypes.Vec2
        },
        strokeWidth: {
            type: WebGLTypes.Float
        },
        origin: {
            type: WebGLTypes.Vec2
        },
        scale: {
            type: WebGLTypes.Vec2
        },
        beginVertex: {
            type: WebGLTypes.Vec2
        },
        endVertex: {
            type: WebGLTypes.Vec2
        }
    },
    attributes: {
        position: {
            type: WebGLTypes.Vec2
        },
        direction: {
            type: WebGLTypes.Vec
        },
        next: {
            type: WebGLTypes.Vec2
        },
        previous: {
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
