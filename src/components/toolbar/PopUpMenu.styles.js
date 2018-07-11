import ease from 'css-ease';
import { canvasWhite } from '../../colors';

const easeInOutBack = ease['ease-in-out-back'];

export default {
    container: {
        position: 'absolute',
        width: '100%',
        height: '180px',
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'none'
    },
    containerVisible: {
        pointerEvents: 'all'
    },
    menuContainer: {
        zIndex: 100,
        height: '150%',
        width: '150%',
        position: 'relative',
        top: '-100%',
        left: '-25%',
        opacity: 0,
        pointerEvents: 'none',
        transform: 'scale(0.9) translateY(0px)',
        transformOrigin: 'center center',
        transition: `opacity 0.25s ease,
                     transform 0.25s ${easeInOutBack}`
    },
    menuContainerVisible: {
        opacity: 1,
        transform: 'scale(1) translateY(-100px)',
        pointerEvents: 'all'
    },
    menu: ({ accentColor }) => ({
        height: '100%',
        width: '100%',
        borderRadius: '45px',
        borderColor: accentColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    }),
    image: {
        width: 120,
        height: 120,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    },
    arrow: ({ accentColor }) => ({
        position: 'absolute',
        zIndex: -1,
        bottom: '-6px',
        left: 'calc(50% - 7.5px)',
        width: 15,
        height: 15,
        transform: 'rotate(45deg)',
        backgroundColor: accentColor,
        borderRadius: 2
    }),
    overlay: {
        position: 'fixed',
        backgroundColor: canvasWhite,
        opacity: 0,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
        transition: 'opacity 0.25s ease-in-out'
    },
    overlayVisible: {
        opacity: 0.75,
        pointerEvents: 'all'
    }
};
