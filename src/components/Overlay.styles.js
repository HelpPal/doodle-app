/* globals CONFIG */
import { canvasWhite } from '~/colors';

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(getAsset)}`;
}
export default {
    container: {
        position: 'relative',
        width: '100vw',
        height: '100vh'
    },
    overlay: (backgroundImage) => ({
        backgroundImage: getAsset(backgroundImage),
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        opacity: 0,
        pointerEvents: 'none',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        backgroundColor: canvasWhite,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        transition: 'opacity 0.25s ease-in-out'
    }),
    children: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: ({ accentColor }) => ({
        textAlign: 'center',
        fontWeight: 'lighter',
        fontFamily: 'Quicksand, sans-serif',
        fontSize: 50,
        color: accentColor,
        marginTop: 0
    }),
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
    }
};
