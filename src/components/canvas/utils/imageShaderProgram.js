
import imageFragmentShader from '../../../shaders/image.frag';
import imageVertexShader from '../../../shaders/image.vert';
import { WebGLTypes } from '../../constants';

export default {
    fragmentShaderSource: imageFragmentShader,
    vertexShaderSource: imageVertexShader,
    uniforms: {
        resolution: {
            type: WebGLTypes.Vec2
        },
        rotation: {
            type: WebGLTypes.Float
        },
        center: {
            type: WebGLTypes.Vec2
        },
        origin: {
            type: WebGLTypes.Vec2
        },
        size: {
            type: WebGLTypes.Vec2
        },
        imageSize: {
            type: WebGLTypes.Vec2
        },
        image: {
            type: WebGLTypes.Texture2D
        },
        padding: {
            type: WebGLTypes.Float
        }
    },
    attributes: {
        position: {
            type: WebGLTypes.Vec2
        }
    }
};
