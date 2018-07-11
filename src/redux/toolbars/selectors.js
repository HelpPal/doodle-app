
import { TOOLBARS } from './constants';
import { getSelectedId } from '../selection';

export function getActiveToolbar(state) {
    return state[TOOLBARS].getActiveToolbar();
}

// FIXME add graphics mode
export function isCurrentSelectionShown(state) {
    const isPathActive = state[TOOLBARS].isPathActive();
    return !isPathActive && !!getSelectedId(state);
}

export function isActivePathShown(state) {
    return state[TOOLBARS].isPathActive();
}

export function isImageToolbarActive(state) {
    return state[TOOLBARS].isImageActive();
}
