
export {
    createText,
    updateText,
    updateSelectedText,
    changeFontFamily,
    changeFontPath,
    changeSelectedFontSize,
    createTextAsCurrentSelection,
    deleteAllText,
    loadTextData } from './actions';

export { TEXT, Fonts } from './constants';

export reducer from './reducer';

export { getSelectedText,
         getFontFamily,
         getFontSize,
         getText,
         getFontPath,
         findTextByPointInBounds } from './selectors';
