
import { SELECTION } from './constants';

export function getSelectedId(state) {
    return state[SELECTION].getSelectedId();
}

export function getSelectionPosition(state) {
    return state[SELECTION].getPosition();
}

export function getSelectionSize(state) {
    return state[SELECTION].getSize();
}

export function getSelectionRotation(state) {
    return state[SELECTION].getRotation();
}

export function getSelectionPadding(state) {
    return state[SELECTION].getPadding();
}
