
import { handleActions } from 'redux-actions';

import {
    Fonts,
    CREATE_TEXT_SUCCESS,
    UPDATE_TEXT_SUCCESS,
    UPDATE_TEXT_VALUE_SUCCESS,
    CHANGE_FONT_FAMILY_SUCCESS,
    CHANGE_FONT_SIZE_SUCCESS,
    DELETE_ALL_TEXT_SUCCESS,
    CHANGE_FONT_PATH_SUCCESS,
    LOAD_TEXT_DATA } from './constants';
import { TRANSFORM_SELECTION,
         DELETE_SELECTION_SUCCESS } from '../selection/constants';
import TextState from './TextState';

const initialState = new TextState({
    fontFamily: Fonts.OpenBaskerville
});

const actions = {
    [CREATE_TEXT_SUCCESS]: (state, { text }) => {
        return state.addOrReplaceText(text);
    },
    [UPDATE_TEXT_SUCCESS]: (state, { text }) => {
        return state.addOrReplaceText(text);
    },
    [UPDATE_TEXT_VALUE_SUCCESS]: (state, { id, value }) => {
        return state.addOrReplaceTextValueById(id, value);
    },
    [TRANSFORM_SELECTION]: (state, { id, position, size, rotation }) => {
        return state.setTextPositionSizeRotationById(id, position, size, rotation);
    },
    [CHANGE_FONT_FAMILY_SUCCESS]: (state, { fontFamily }) => {
        return state.setFontFamily(fontFamily);
    },
    [CHANGE_FONT_SIZE_SUCCESS]: (state, { id, fontSize }) => {
        return state.setFontSizeById(id, fontSize);
    },
    [DELETE_SELECTION_SUCCESS]: (state, { id }) => {
        return state.removeTextById(id);
    },
    [DELETE_ALL_TEXT_SUCCESS]: state => {
        return state.deleteAllText();
    },
    [CHANGE_FONT_PATH_SUCCESS]: (state, { fontPath }) => {
        return state.setFontPath(fontPath);
    },
    [LOAD_TEXT_DATA]: (state, { fontPath, fontFamily }) => {
        return state.setFontFamily(fontFamily).setFontPath(fontPath);
    }
};

export default handleActions(actions, initialState);
