
const borderWidth = 3;

export default {
    container: {
        position: 'relative',
        height: `calc(100% + ${2 * borderWidth}px)`,
        width: `calc(100% + ${2 * borderWidth}px)`,
        top: -borderWidth,
        left: -borderWidth
    },
    input: {
        height: '100%',
        width: '100%',
        appearance: 'none',
        outline: 0,
        border: 'none',
        backgroundColor: 'transparent',
        padding: 10
    }
};
