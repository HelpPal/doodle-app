
import { IMAGES } from './constants';

export function getImages(state) {
    return state[IMAGES].getImages();
}

export function findImageByPointInBounds(state, point) {
    return state[IMAGES].findImageByPointInBounds(point);
}

export function getSelectedImagePath(state) {
    return state[IMAGES].getSelectedImagePath();
}
