/* globals CONFIG */
import { canvasWhite, blueGrey } from '../colors';

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(getAsset)}`;
}

function getImage(image) {
    return image && `url(${getAsset(image)})`;
}

export default {
    container: (backgroundImage) => ({
        backgroundColor: canvasWhite,
        backgroundImage: getImage(backgroundImage),
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'top',
        alignItems: 'center',
        flexDirection: 'column'
    }),
    spacer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-end',
        padding: '0 5%',
        height: '100%',
        alignItems: 'center'
    },
    midsection: {
        display: 'flex',
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    exit: {
        position: 'absolute',
        width: 40,
        height: 40,
        fill: blueGrey,
        margin: 30,
        zIndex: 1
    },
    toolbarContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 150,
      padding: '10px 0'
    }
};
