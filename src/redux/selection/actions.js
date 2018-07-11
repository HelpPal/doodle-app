
import Promise from 'bluebird';
import includes from 'lodash/includes';

import { UPDATE_SELECTION_SUCCESS,
         UPDATE_SELECTION_FAILURE,
         RESET_SELECTION_SUCCESS,
         RESET_SELECTION_FAILURE,
         TRANSFORM_SELECTION,
         TRANSFORM_SELECTION_FAILURE,
         COMMIT_SELECTION_SUCCESS,
         COMMIT_SELECTION_FAILURE,
         SELECT_POSITION_SUCCESS,
         SELECT_POSITION_FAILURE,
         DELETE_SELECTION_SUCCESS,
         DELETE_SELECTION_FAILURE,
         UPDATE_SELECTION_PADDING,
         UPDATE_SELECTION_PADDING_FAILURE } from './constants';
import { getSelectedId } from './selectors';
import { findTextByPointInBounds } from '../text';
import { findPathByPointInBounds } from '../paths';
import { findImageByPointInBounds } from '../images';
import { getActiveToolbar, Toolbars } from '../toolbars';

export function updateSelectionPadding(padding) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const selectedId = getSelectedId(getState());
                return dispatch({
                    type: UPDATE_SELECTION_PADDING,
                    id: selectedId,
                    padding
                });
            })
            .catch(error => dispatch({
                type: UPDATE_SELECTION_PADDING_FAILURE,
                error
            }));
    };
}

export function transformSelection({ position, size, rotation }) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const selectedId = getSelectedId(getState());
                return dispatch({
                    type: TRANSFORM_SELECTION,
                    id: selectedId,
                    position,
                    size,
                    rotation
                });
            })
            .catch(error => dispatch({
                type: TRANSFORM_SELECTION_FAILURE,
                error
            }));
    };
}

export function updateSelection(selectedId) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: UPDATE_SELECTION_SUCCESS,
                id: selectedId
            }))
            .catch(error => dispatch({
                type: UPDATE_SELECTION_FAILURE,
                error
            }));
    };
}

export function resetSelection() {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({ type: RESET_SELECTION_SUCCESS }))
            .catch(error => dispatch({ type: RESET_SELECTION_FAILURE, error }));
    };
}

export function commitSelection() {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const selectedId = getSelectedId(getState());
                return dispatch({
                    type: COMMIT_SELECTION_SUCCESS,
                    id: selectedId
                });
            })
            .catch(error => dispatch({
                type: COMMIT_SELECTION_FAILURE,
                error
            }));
    };
}

export function attemptToSelectPoint(point) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const state = getState();
                const object = findTextPathOrImageByPoint(state, point);
                if (!object) {
                    throw new Error(`Nothing at selection: ${JSON.stringify(point)}`);
                }
                const position = object.getPosition();
                const size = object.getSize();
                const rotation = object.getRotation();
                const padding = object.getPadding();
                return Promise.resolve()
                    .then(() => dispatch(updateSelection(object.getId())))
                    .then(() => dispatch(updateSelectionPadding(padding)))
                    .then(() => dispatch(transformSelection({ position, size, rotation })))
                    .then(() => {
                        return dispatch({
                            type: SELECT_POSITION_SUCCESS,
                            object,
                            point
                        });
                    });
            })
            .catch(error => dispatch(handleError(error, SELECT_POSITION_FAILURE, { point })));
    };
}

function findTextPathOrImageByPoint(state, point) {
    const toolbar = getActiveToolbar(state);
    const text = findTextByPointInBounds(state, point);
    const path = findPathByPointInBounds(state, point);
    const image = findImageByPointInBounds(state, point);
    if (!text && !path && !image) {
        return;
    }
    if (path && !text && includes([Toolbars.Select], toolbar)) {
        return path;
    }
    else if (text && !path && includes([Toolbars.Text, Toolbars.Select], toolbar)) {
        return text;
    }
    else if (image && includes([Toolbars.Image, Toolbars.Select], toolbar)) {
        return image;
    }
    else if (text && !image && includes([Toolbars.Image], toolbar)) {
        return;
    }
    else {
        return text;
    }
}

export function deleteSelection() {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                const selectedId = getSelectedId(getState());
                return dispatch({
                    type: DELETE_SELECTION_SUCCESS,
                    id: selectedId
                });
            })
            .catch(error => dispatch(handleError(error, DELETE_SELECTION_FAILURE)));
    };
}

function handleError(error, type, data) {
    return dispatch => {
        dispatch({
            type,
            error,
            data
        });
        throw error;
   };
}
