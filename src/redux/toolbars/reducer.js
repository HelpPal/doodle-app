
import { handleActions } from 'redux-actions';

import { Toolbars, CHANGE_ACTIVE_TOOLBAR_SUCCESS } from './constants';
import ToolbarState from './ToolbarState';

const initialState = new ToolbarState({
    activeToolbar: Toolbars.Select
});

export default handleActions({
    [CHANGE_ACTIVE_TOOLBAR_SUCCESS]: (state, { toolbar }) => {
        return state.setActiveToolbar(toolbar);
    }
}, initialState);
