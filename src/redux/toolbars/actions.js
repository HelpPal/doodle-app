
import Promise from 'bluebird';

import {
    CHANGE_ACTIVE_TOOLBAR_SUCCESS,
    CHANGE_ACTIVE_TOOLBAR_FAILURE
} from './constants';

export function changeActiveToolbar(toolbar) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: CHANGE_ACTIVE_TOOLBAR_SUCCESS,
                toolbar
            }))
            .catch(error => dispatch({
                type: CHANGE_ACTIVE_TOOLBAR_FAILURE,
                error
            }));
    };
}
