import { canvasWhite } from '../../colors';

export default {
    toolbarContainer: ({ accentColor }) => ({
        position: 'relative',
        width: '50%',
        height: '90px',
        maxHeight: '100%',
        borderRadius: 50,
        backgroundColor: accentColor,
        display: 'flex',
        justifyContent: 'center'
    }),
    toolbar: {
        width: '75%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    icons: {
        width: 45,
        height: 45,
        fill: 'rgba(255,255,255,0.5)',
        margin: 15,
        cursor: 'pointer'
    },
    img: {
        width: 55,
        height: 55,
        fill: 'rgba(255,255,255,0.5)',
        margin: 15,
        cursor: 'pointer'
    },
    activeImg: {
        width: 55,
        height: 55,
        fill: '#fff',
        margin: 15,
        cursor: 'pointer'
    },
    activeIcon: {
        width: 45,
        height: 45,
        fill: '#fff',
        margin: 15,
        cursor: 'pointer'
    }
};
