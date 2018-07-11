
import { quicksand } from '~/fonts';

export default {
    container: {
        fontWeight: 'lighter',
        fontFamily: quicksand,
        fontSize: 25,
        padding: 25,
        minHeight: '100%',
        overflowY: 'auto',
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
    },
    title: ({ accentColor }) => ({
        padding: 35,
        margin: 0,
        fontWeight: 'lighter',
        fontFamily: quicksand,
        color: accentColor
    }),
    subtitle: ({ accentColor }) => ({
        paddingLeft: 35,
        margin: 0,
        fontSize: 15,
        fontWeight: 'lighter',
        fontFamily: quicksand,
        color: accentColor
    }),
    row: {
        display: 'flex',
        flex: 1,
        padding: 25,
        minHeight: 200
    }
};
