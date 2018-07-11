
import Promise from 'bluebird';
import uuid from 'uuid';
import localForage from 'localforage';

import { getSelectedId,
         updateSelection,
         updateSelectionPadding,
         transformSelection } from '../selection';
import { Fonts,
         CREATE_TEXT_FAILURE,
         CREATE_TEXT_SUCCESS,
         UPDATE_TEXT_SUCCESS,
         UPDATE_TEXT_FAILURE,
         UPDATE_TEXT_VALUE_SUCCESS,
         UPDATE_TEXT_VALUE_FAILURE,
         CHANGE_FONT_FAMILY_SUCCESS,
         CHANGE_FONT_FAMILY_FAILURE,
         CHANGE_FONT_SIZE_SUCCESS,
         CHANGE_FONT_SIZE_FAILURE,
         CREATE_TEXT_AS_CURRENT_SELECTION_SUCCESS,
         CREATE_TEXT_AS_CURRENT_SELECTION_FAILURE,
         DELETE_ALL_TEXT_SUCCESS,
         DELETE_ALL_TEXT_FAILURE,
         LOAD_TEXT_DATA,
         LOAD_TEXT_DATA_FAILURE,
         CHANGE_FONT_PATH_SUCCESS,
         CHANGE_FONT_PATH_FAILURE } from './constants';
import { DEFAULT_SELECTION_WIDTH,
         DEFAULT_SELECTION_HEIGHT,
         TEXT_PADDING } from '~/constants';

const defaultSelectionSize = {
    width: DEFAULT_SELECTION_WIDTH,
    height: DEFAULT_SELECTION_HEIGHT
};

export function createText(text) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: CREATE_TEXT_SUCCESS,
                text: {
                    padding: TEXT_PADDING,
                    ...text,
                    id: uuid.v4()
                }
            }))
            .catch(error => dispatch({
                type: CREATE_TEXT_FAILURE,
                error
            }));
    };
}

export function createTextAsCurrentSelection(point) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => dispatch(createText('')))
            .then(({ text }) => {
                return Promise.join(
                    dispatch(updateSelection(text.id)),
                    dispatch(updateSelectionPadding(text.padding))
                );
            })
            .then(() => point && dispatch(transformSelection({
                position: point,
                size: defaultSelectionSize
            })))
            .then(() => dispatch({
                type: CREATE_TEXT_AS_CURRENT_SELECTION_SUCCESS,
                point
            }))
            .catch(error => dispatch({
                type: CREATE_TEXT_AS_CURRENT_SELECTION_FAILURE,
                error
            }));
    };
}

export function updateSelectedText(value) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const selectedId = getSelectedId(getState());
                if (!selectedId) {
                    throw new Error('No selection');
                }
                return dispatch({
                    type: UPDATE_TEXT_VALUE_SUCCESS,
                    id: selectedId,
                    value
                });
            })
            .catch(error => dispatch({
                type: UPDATE_TEXT_VALUE_FAILURE,
                error
            }));
    };
}

export function updateText(text) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: UPDATE_TEXT_SUCCESS,
                text
            }))
            .catch(error => dispatch({
                type: UPDATE_TEXT_FAILURE,
                error
            }));
    };
}

export function loadTextData() {
    return dispatch => {
        return Promise.resolve()
            .then(() => {
                return Promise.join(
                    localForage.getItem('fontPath'),
                    localForage.getItem('fontFamily')
                );
            })
            .spread((fontPath, fontFamily) => dispatch({
                type: LOAD_TEXT_DATA,
                fontPath,
                fontFamily: fontFamily || Fonts.OpenBaskerville
            }))
            .catch(error => dispatch({
                type: LOAD_TEXT_DATA_FAILURE,
                error
            }));
    };
}

export function changeFontFamily(fontFamily) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('fontFamily', fontFamily))
            .then(() => dispatch({
                type: CHANGE_FONT_FAMILY_SUCCESS,
                fontFamily
            }))
            .catch(error => dispatch({
                type: CHANGE_FONT_FAMILY_FAILURE,
                error
            }));
    };
}

export function changeFontPath(fontPath) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('fontPath', fontPath))
            .then(() => dispatch({
                type: CHANGE_FONT_PATH_SUCCESS,
                fontPath
            }))
            .catch(error => dispatch({
                type: CHANGE_FONT_PATH_FAILURE,
                error
            }));
    };
}

export function changeSelectedFontSize(fontSize) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const selectedId = getSelectedId(getState());
                if (!selectedId) {
                    throw new Error('No selection');
                }
                return dispatch({
                    type: CHANGE_FONT_SIZE_SUCCESS,
                    id: selectedId,
                    fontSize
                });
            })
            .catch(error => dispatch({
                type: CHANGE_FONT_SIZE_FAILURE,
                error
            }));
    };
}

export function deleteAllText() {
    return dispatch => {
        return Promise.resolve()
            .then(() => {
                dispatch({
                    type: DELETE_ALL_TEXT_SUCCESS
                });
            })
            .catch(error => dispatch({
                type: DELETE_ALL_TEXT_FAILURE,
                error
            }));
        };
}
