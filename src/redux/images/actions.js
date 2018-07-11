
import Promise from 'bluebird';
import uuid from 'uuid';

import { CREATE_IMAGE,
         CREATE_IMAGE_FAILURE,
         DELETE_ALL_IMAGES,
         DELETE_ALL_IMAGES_FAILURE,
         CREATE_IMAGE_AS_CURRENT_SELECTION,
         CREATE_IMAGE_AS_CURRENT_SELECTION_FAILURE,
         SELECT_IMAGE_PATH,
         SELECT_IMAGE_PATH_FAILURE } from './constants';
import { updateSelection,
         updateSelectionPadding,
         transformSelection } from '../selection';
import { IMAGE_PADDING } from '~/constants';
import { getSelectedImagePath } from './selectors';

export function createImage(image) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: CREATE_IMAGE,
                image: {
                    padding: IMAGE_PADDING,
                    ...image,
                    id: uuid.v4()
                }
            }))
            .catch(error => dispatch({
                type: CREATE_IMAGE_FAILURE,
                error
            }));
    };
}

export function deleteAllImages() {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: DELETE_ALL_IMAGES
            }))
            .catch(error => dispatch({
                type: DELETE_ALL_IMAGES_FAILURE,
                error
            }));
    };
}

export function createImageAsCurrentSelection(point) {
    return (dispatch, getState) => {
        return Promise.resolve()
            .then(() => {
                return new Promise((resolve, reject) => {
                    const url = getSelectedImagePath(getState());
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.crossOrigin = 'Anonymous';
                    img.src = url;
                });
            })
            .then((image) => {
                return Promise.resolve()
                    .then(() => {
                        return dispatch(createImage({
                            center: { x: 0, y: 0 },
                            position: point,
                            rotation: 0,
                            size: {
                                height: image.height,
                                width: image.width
                            },
                            url: getSelectedImagePath(getState())
                        }));
                    })
                    .then(({ image }) => {
                        return Promise.join(
                            dispatch(updateSelection(image.id)),
                            dispatch(updateSelectionPadding(image.padding))
                        );
                    })
                    .then(() => point && dispatch(transformSelection({
                        position: point,
                        size: {
                            height: image.height,
                            width: image.width
                        }
                    })));
            })
            .then(() => dispatch({
                type: CREATE_IMAGE_AS_CURRENT_SELECTION,
                point
            }))
            .catch(error => dispatch({
                type: CREATE_IMAGE_AS_CURRENT_SELECTION_FAILURE,
                error
            }));
    };
}

export function selectImagePath(imagePath) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: SELECT_IMAGE_PATH,
                imagePath
            }))
            .catch(error => dispatch({
                type: SELECT_IMAGE_PATH_FAILURE,
                error
            }));
    };
}
