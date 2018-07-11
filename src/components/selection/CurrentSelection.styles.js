import { HANDLE_SIZE } from './constants';

export default {
    container: ({ accentColor }) => ({
        borderWidth: '3px',
        borderColor: accentColor,
        borderStyle: 'dashed',
        borderRadius: '25px',
        top: 0,
        left: 0,
        position: 'absolute',
        transformOrigin: '50% 50%'
    }),
    rotationHandle: {
        top: -HANDLE_SIZE / 2,
        right: -HANDLE_SIZE / 2,
        position: 'absolute'
    },
    resizeHandle: {
        bottom: -HANDLE_SIZE / 2,
        right: -HANDLE_SIZE / 2,
        position: 'absolute'
    },
    deleteHandle: {
        top: -HANDLE_SIZE / 2,
        left: -HANDLE_SIZE / 2,
        position: 'absolute'
    }
};
