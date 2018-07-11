
import { APP, reducer as appReducer } from './app';
import { TEXT, reducer as textReducer } from './text';
import { SELECTION, reducer as selectionReducer } from './selection';
import { TOOLBARS, reducer as toolbarReducer } from './toolbars';
import { PATHS, reducer as pathReducer } from './paths';
import { IMAGES, reducer as imagesReducer } from './images';

export default {
    [APP]: appReducer,
    [TEXT]: textReducer,
    [SELECTION]: selectionReducer,
    [TOOLBARS]: toolbarReducer,
    [PATHS]: pathReducer,
    [IMAGES]: imagesReducer
};
