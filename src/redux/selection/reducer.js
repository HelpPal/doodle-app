
import { handleActions } from 'redux-actions';

import { UPDATE_SELECTION_SUCCESS,
         RESET_SELECTION_SUCCESS,
         TRANSFORM_SELECTION,
         DELETE_SELECTION_SUCCESS,
         UPDATE_SELECTION_PADDING } from './constants';
import SelectionState from './SelectionState';

const initialState = new SelectionState();

export default handleActions({
    [UPDATE_SELECTION_SUCCESS]: (state, { id }) => {
        return state.setSelectedId(id);
    },
    [RESET_SELECTION_SUCCESS]: state => {
        return state.resetSelection();
    },
    [TRANSFORM_SELECTION]: (state, { position, size, rotation }) => {
        return state.setSize(size)
                    .setPosition(position)
                    .setRotation(rotation);
    },
    [UPDATE_SELECTION_PADDING]: (state, { padding }) => {
        return state.setPadding(padding);
    },
    [DELETE_SELECTION_SUCCESS]: state => {
        return state.resetSelection();
    }
}, initialState);
