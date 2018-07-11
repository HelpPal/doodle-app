
export default {
    container: {
        height: '100%',
        width: '100%',
        maxHeight: 90,
        justifyContent: 'flex-end',
        display: 'flex'
    },
    circle: ({ accentColor }) => ({
        position: 'absolute',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: accentColor,
        cursor: 'pointer'
    }),
    expandedCircle: {
        height: 300,
        width: 300,
        borderRadius: '10%'
    },
    arrow: {
        height: 60,
        width: '100%',
        fill: 'white',
        position: 'relative',
        top: -8,
        margin: -4
    },
    arrowContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.25s ease-in-out'
    },
    arrowContainerVisible: {
        opacity: 1
    },
    activity: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '2.5px',
        marginTop: '2.5px',
        opacity: 0,
        transition: 'opacity 0.25s ease-in-out'
    },
    activityVisible: {
        opacity: 1
    },
    doneButton: {
        textAlign: 'center',
        fontWeight: 'lighter',
        fontFamily: 'Quicksand, sans-serif',
        fontSize: 20,
        color: 'white'
    }
};
