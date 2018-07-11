
import { canvasWhite } from '~/colors';

export default {
    container: {

    },
    logo: {
        width: 200,
        height: 200,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        marginBottom: 10
    },
    enterButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterButton: ({ accentColor }) => ({
        opacity: 0,
        position: 'relative',
        transform: 'translateY(15px)',
        appearance: 'none',
        outline: 'none',
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: accentColor,
        color: accentColor,
        fontFamily: 'Quicksand, sans-serif',
        backgroundColor: canvasWhite,
        padding: '10px 40px',
        fontSize: 40,
        cursor: 'pointer',
        transition: `background-color 0.25s 0.15s ease-in-out,
                     color 0.25s 0.15s ease-in-out,
                     transform 0.25s 0.25s ease-in-out,
                     opacity 0.25s 0.25s ease-in-out`,
        ':hover': {
            backgroundColor: accentColor,
            color: canvasWhite
        },
        ':active': {
            backgroundColor: accentColor,
            color: canvasWhite
        }
    }),
    enterButtonVisible: {
        opacity: 1,
        transform: 'translateY(0px)'
    },
    overlayVisible: {
        opacity: 1,
        pointerEvents: 'all'
    },
    activity: {
        position: 'absolute',
        opacity: 0,
        transition: 'opacity 0.15s ease-in-out'
    },
    activityVisible: {
        opacity: 1,
        display: 'block'
    },
    inputContainer: ({ accentColor }) => ({
        display: 'flex',
        flex: 1,
        borderColor: accentColor,
        borderStyle: 'solid',
        borderWidth: 3,
        padding: '10px',
        backgroundColor: '#fff',
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }),
    input: ({ accentColor }) => ({
        display: 'flex',
        flex: 1,
        fontSize: 40,
        border: 0,
        outline: 0,
        fontFamily: 'Quicksand, sans-serif'
    })
};
