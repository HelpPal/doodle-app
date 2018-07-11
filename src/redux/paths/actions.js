
import Promise from 'bluebird';
import uuid from 'uuid';

import { CREATE_PATH_SUCCESS,
         CREATE_PATH_FAILURE,
         DELETE_PATHS_SUCCESS,
         DELETE_PATHS_FAILURE } from './constants';
import { PATH_PADDING } from '~/constants';

export function createPath(path) {
    return dispatch => {
        return Promise.resolve()
            .then(() => {
                const vertices = path.vertices || path.getVertices();
                if (!vertices || !(vertices.size || vertices.length)) {
                    return;
                }
                dispatch({
                    type: CREATE_PATH_SUCCESS,
                    path: {
                        padding: PATH_PADDING,
                        ...path.toJS(),
                        position: calculateInitialPosition(path),
                        id: uuid.v4()
                    }
                });
            })
            .catch(error => dispatch({
                type: CREATE_PATH_FAILURE,
                error
            }));
    };
}

function calculateInitialPosition(path) {
    return {
        x: path.getMinX(),
        y: path.getMinY()
    };
}

export function deleteAllPaths() {
    return dispatch => {
        return Promise.resolve()
            .then(() => {
                dispatch({
                    type: DELETE_PATHS_SUCCESS
                });
            })
            .catch(error => dispatch({
                type: DELETE_PATHS_FAILURE,
                error
            }));
    };
}
