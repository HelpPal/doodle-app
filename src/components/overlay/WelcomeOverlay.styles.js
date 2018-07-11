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
    playIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flex: 1,
        marginTop: 50,
        transition: 'opacity 0.2s',
        ':hover': {
            opacity: 0.8
        },
        ':active': {
            opacity: 0.5
        }
    },
    videoContainer: {
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        zIndex: -1
    }
};
