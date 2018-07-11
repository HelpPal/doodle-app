
import { handleActions } from 'redux-actions';

import { CREATE_IMAGE,
         DELETE_ALL_IMAGES,
         SELECT_IMAGE_PATH } from './constants';
import { TRANSFORM_SELECTION,
         DELETE_SELECTION_SUCCESS } from '../selection/constants';
import ImageState from './ImageState';

const initialState = new ImageState();

const actions = {
    [CREATE_IMAGE]: (state, { image }) => {
        return state.addOrReplaceImage(image);
    },
    [TRANSFORM_SELECTION]: (state, { id, position, size, rotation }) => {
        return state.setImagePositionSizeRotationById(id, position, size, rotation);
    },
    [DELETE_SELECTION_SUCCESS]: (state, { id }) => {
        return state.removeImageById(id);
    },
    [DELETE_ALL_IMAGES]: state => {
        return state.deleteAllImages();
    },
    [SELECT_IMAGE_PATH]: (state, { imagePath }) => {
        return state.setSelectedImagePath(imagePath);
    }
};

export default handleActions(actions, initialState);
