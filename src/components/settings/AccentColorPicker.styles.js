
import { quicksand } from '~/fonts';

export default {
    container: {
        display: 'flex',
        flex: 1
    },
    input: {
        display: 'none'
    },
    inner: {
        height: '100%',
        width: '100%',
        padding: 10
    },
    color: {
        borderRadius: '10px',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'opacity 0.25s ease-in-out',
        cursor: 'pointer',
        ':hover': {
            opacity: 0.8
        },
        ':active': {
            opacity: 0.5
        }
    },
    subtitle: {
        padding: 35,
        fontWeight: 'lighter',
        fontFamily: quicksand,
        fontSize: 18,
        width: '100%',
        color: 'white'
    }
};
