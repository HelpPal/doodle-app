
import { quicksand } from '~/fonts';

export default {
    container: {
        display: 'flex',
        flex: 1
    },
    uploader: {
        height: '100%',
        width: '100%',
        padding: 10
    },
    inner: ({ accentColor }) => ({
        flexDirection: 'column',
        position: 'relative',
        borderWidth: '3px',
        borderColor: accentColor,
        borderStyle: 'dashed',
        borderRadius: '10px',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        textAlign: 'center',
        transition: 'opacity 0.25s ease-in-out',
        cursor: 'pointer',
        ':hover': {
            opacity: 0.8
        },
        ':active': {
            opacity: 0.5
        }
    }),
    fileInput: {
        display: 'none'
    },
    clickHere: ({ accentColor }) => ({
        fontFamily: quicksand,
        fontWeight: 'lighter',
        fontSize: 18,
        color: accentColor
    }),
    uploadButton: ({ accentColor }) => ({
        position: 'relative',
        appearance: 'none',
        outline: 'none',
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: accentColor,
        color: accentColor,
        fontFamily: 'Quicksand, sans-serif',
        backgroundColor: 'transparent',
        padding: '10px 20px',
        fontSize: 18,
        cursor: 'pointer',
        transition: `background-color 0.1s 0.1s ease-in-out,
                     color 0.1s 0.1s ease-in-out`,
        ':hover': {
            backgroundColor: accentColor,
            color: 'white'
        },
        ':active': {
            backgroundColor: accentColor,
            color: 'white'
        }
    }),
    defaultImage: {
        position: 'absolute',
        borderWidth: '3px',
        height: '100%',
        width: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        opacity: 0.5,
        zIndex: -1
    },
    deleteButton: ({ accentColor }) => ({
        lineHeight: '15px',
        top: -15,
        position: 'relative',
        appearance: 'none',
        outline: 'none',
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: accentColor,
        color: accentColor,
        fontFamily: 'Quicksand, sans-serif',
        backgroundColor: 'transparent',
        padding: '10px 20px',
        fontSize: 18,
        cursor: 'pointer',
        transition: `background-color 0.1s 0.1s ease-in-out,
                     color 0.1s 0.1s ease-in-out`,
        ':hover': {
            backgroundColor: accentColor,
            color: 'white'
        },
        ':active': {
            backgroundColor: accentColor,
            color: 'white'
        }
    })
};
