
import { handleActions } from 'redux-actions';

import { CREATE_PATH_SUCCESS, DELETE_PATHS_SUCCESS } from './constants';
import { TRANSFORM_SELECTION,
         DELETE_SELECTION_SUCCESS } from '../selection/constants';
import PathState from './PathState';

const initialState = new PathState();

const actions = {
    [CREATE_PATH_SUCCESS]: (state, { path }) => {
        return state.addOrReplacePath(path);
    },
    [TRANSFORM_SELECTION]: (state, { id, position, size, rotation }) => {
        return state.setPathPositionSizeRotationById(id, position, size, rotation);
    },
    [DELETE_SELECTION_SUCCESS]: (state, { id }) => {
        return state.removePathById(id);
    },
    [DELETE_PATHS_SUCCESS]: state => {
        return state.deleteAllPaths();
    }
};

export default handleActions(actions, initialState);
