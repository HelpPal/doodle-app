
import { quicksand } from '~/fonts';

export default {
    container: {
        flex: 1,
        padding: 10
    },
    title: ({ accentColor }) => ({
        fontFamily: quicksand,
        fontWeight: 'lighter',
        fontSize: 18,
        color: accentColor,
        flex: 1
    }),
    inner: ({ accentColor }) => ({
        flex: 1,
        position: 'relative',
        borderWidth: '3px',
        borderColor: accentColor,
        borderStyle: 'solid',
        borderRadius: '10px',
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
    select: ({ accentColor }) => ({
        flex: 1,
        background: 'transparent',
        fontFamily: quicksand,
        fontWeight: 'lighter',
        fontSize: 18,
        color: accentColor,
        appearance: 'none',
        border: 'none',
        outline: 'none',
        ':focus': {
            outline: 'none'
        }
    })
};
