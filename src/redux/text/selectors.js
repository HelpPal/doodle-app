
import { TEXT } from './constants';
import { SELECTION } from '../selection';

export function getSelectedText(state) {
    const selectedId = state[SELECTION].getSelectedId();
    return state[TEXT].findTextById(selectedId);
}

export function getText(state) {
    return state[TEXT].getText();
}

export function getFontFamily(state) {
    return state[TEXT].getFontFamily();
}

export function getFontSize(state) {
    const selectedText = getSelectedText(state);
    if (!selectedText) {
        return;
    }
    return selectedText.getFontSize();
}

export function findTextByPointInBounds(state, point) {
    return state[TEXT].findTextByPointInBounds(point);
}

export function getFontPath(state) {
  return state[TEXT].getFontPath();
}
