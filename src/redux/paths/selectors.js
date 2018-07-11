
import { PATHS } from './constants';

export function getPaths(state) {
    return state[PATHS].getPaths();
}

export function findPathByPointInBounds(state, point) {
    return state[PATHS].findPathByPointInBounds(point);
}
