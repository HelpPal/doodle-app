import { HANDLE_SIZE, ICON_SIZE } from './constants';

export default {
    container: ({ accentColor }) => ({
        backgroundColor: accentColor,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }),
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        fill: 'white'
    }
};
