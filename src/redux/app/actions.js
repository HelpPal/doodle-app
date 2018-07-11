
import Promise from 'bluebird';
import localForage from 'localforage';
import times from 'lodash/times';
import fromPairs from 'lodash/fromPairs';
import toNumber from 'lodash/toNumber';
import isUndefined from 'lodash/isUndefined';

import { teal } from '~/colors';
import { DEFAULT_STROKE_WIDTH } from '~/constants';

import { SET_ACCENT_COLOR,
         SET_ACCENT_COLOR_FAILURE,
         LOAD_APP_DATA,
         LOAD_APP_DATA_FAILURE,
         SET_LOGO_IMAGE,
         SET_LOGO_IMAGE_FAILURE,
         SET_IMAGE,
         SET_IMAGE_FAILURE,
         SET_STROKE_WIDTH,
         SET_STROKE_WIDTH_FAILURE,
         SET_EXPORT_KIND,
         SET_EXPORT_KIND_FAILURE,
         SET_ARTBOARD_PRESET,
         SET_ARTBOARD_PRESET_FAILURE,
         SET_ACTIVE_ARTBOARD_PRESET,
         SET_PRINT_ROTATION,
         SET_PRINT_ROTATION_FAILURE,
         TOGGLE_FEATURE,
         TOGGLE_FEATURE_FAILURE,
         SET_BACKGROUND_IMAGE,
         SET_BACKGROUND_IMAGE_FAILURE,
         UNSET_IMAGE,
         UNSET_IMAGE_FAILURE,
         SET_WELCOME_VIDEO,
         SET_WELCOME_VIDEO_FAILURE,
         SET_USERNAME,
         SET_USERNAME_FAILURE,
         ExportKind } from './constants';

export function setAccentColor(color) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('accentColor', color))
            .then(() => dispatch({
                type: SET_ACCENT_COLOR,
                color
            }))
            .catch(error => dispatch({
                type: SET_ACCENT_COLOR_FAILURE,
                error
            }));
    };
}

export function loadAppData() {
    return dispatch => {
        return Promise.resolve()
            .then(() => Promise.join(
                localForage.getItem('accentColor'),
                localForage.getItem('logoImage'),
                localForage.getItem('strokeWidth'),
                localForage.getItem('exportKind'),
                localForage.getItem('printRotation'),
                localForage.getItem('backgroundImage'),
                localForage.getItem('welcomeVideo'),
                loadArtboardPresets(),
                loadKeyedImages(),
                loadFeatures()
            ))
            .spread((
                accentColor,
                logoImage,
                strokeWidth,
                exportKind,
                printRotation,
                backgroundImage,
                welcomeVideo,
                presets,
                keyedImages,
                features
            ) => {
                return dispatch({
                    type: LOAD_APP_DATA,
                    color: accentColor || teal,
                    exportKind: exportKind || ExportKind.PNG,
                    strokeWidth: toNumber(strokeWidth) || DEFAULT_STROKE_WIDTH,
                    logoImage,
                    backgroundImage,
                    presets,
                    keyedImages,
                    welcomeVideo,
                    printRotation: printRotation || 0,
                    features
                });
            })
            .catch(error => dispatch({
                type: LOAD_APP_DATA_FAILURE,
                error
            }));
    };
}

function loadFeatures() {
  return Promise.join(
    localForage.getItem('feature-images'),
    localForage.getItem('feature-drawing'),
    localForage.getItem('feature-text')
  )
  .spread((images, drawing, text) => {
    return {
      images: isUndefined(images) ? true : images,
      drawing: isUndefined(drawing) ? true : drawing,
      text: isUndefined(text) ? true : text
    };
  });
}

function loadArtboardPresets() {
  return Promise.join(
    localForage.getItem('preset-1'),
    localForage.getItem('preset-2'),
    localForage.getItem('preset-3')
  )
  .spread((preset1, preset2, preset3) => {
    const defaultPreset = { width: 1, height: 1 };
    return {
      preset1: preset1 ? JSON.parse(preset1) : defaultPreset,
      preset2: preset2 ? JSON.parse(preset2) : defaultPreset,
      preset3: preset3 ? JSON.parse(preset3) : defaultPreset
    };
  });
}

function loadKeyedImages() {
    return Promise.all(times(12, i => {
            return localForage.getItem(`image-${i}`);
        }))
        .map((image, i) => [i, image])
        .then(pairs => fromPairs(pairs));
}

export function setLogoImage(logoImage) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('logoImage', logoImage))
            .then(() => dispatch({
                type: SET_LOGO_IMAGE,
                logoImage
            }))
            .catch(error => dispatch({
                type: SET_LOGO_IMAGE_FAILURE,
                error
            }));
    };
}

export function setKeyedImage(key, image) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem(`image-${key}`, image))
            .then(() => dispatch({
                type: SET_IMAGE,
                image,
                key
            }))
            .catch(error => dispatch({
                type: SET_IMAGE_FAILURE,
                error
            }));
    };
}

export function unsetKeyedImage(key, image) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem(`image-${key}`, null))
            .then(() => dispatch({
                type: UNSET_IMAGE,
                key
            }))
            .catch(error => dispatch({
                type: UNSET_IMAGE_FAILURE,
                error
            }));
    };
}

export function setStrokeWidth(strokeWidth) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('strokeWidth', strokeWidth))
            .then(() => dispatch({
                type: SET_STROKE_WIDTH,
                strokeWidth
            }))
            .catch(error => dispatch({
                type: SET_STROKE_WIDTH_FAILURE,
                error
            }));
    };
}

export function setExportKind(exportKind) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('exportKind', exportKind))
            .then(() => dispatch({
                type: SET_EXPORT_KIND,
                exportKind
            }))
            .catch(error => dispatch({
                type: SET_EXPORT_KIND_FAILURE,
                error
            }));
    };
}

export function setArtBoardPreset(presetID, width, height) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem(`preset-${presetID}`, JSON.stringify({ width, height })))
            .then(() => dispatch({
                type: SET_ARTBOARD_PRESET,
                presetID,
                width,
                height
            }))
            .catch(error => dispatch({
                type: SET_ARTBOARD_PRESET_FAILURE,
                error
            }));
    };
}

export function setActiveArtboardPreset(presetID) {
  return dispatch => {
    return dispatch({
      type: SET_ACTIVE_ARTBOARD_PRESET,
      presetID
    });
  };
}

export function setPrintRotation(printRotation) {
  return dispatch => {
      return Promise.resolve()
          .then(() => localForage.setItem('printRotation', printRotation))
          .then(() => dispatch({
              type: SET_PRINT_ROTATION,
              printRotation
          }))
          .catch(error => dispatch({
              type: SET_PRINT_ROTATION_FAILURE,
              error
          }));
  };
}

export function enableFeature(feature) {
    return dispatch => {
        return Promise.resolve()
          .then(() => localForage.setItem(`feature-${feature}`, true))
          .then(() => dispatch({
              type: TOGGLE_FEATURE,
              feature: feature,
              enabled: true
          }))
          .catch(error => dispatch({
              type: TOGGLE_FEATURE_FAILURE,
              error
          }));
    };
}

export function disableFeature(feature) {
    return dispatch => {
        return Promise.resolve()
          .then(() => localForage.setItem(`feature-${feature}`, false))
          .then(() => dispatch({
              type: TOGGLE_FEATURE,
              feature: feature,
              enabled: false
          }))
          .catch(error => dispatch({
              type: TOGGLE_FEATURE_FAILURE,
              error
          }));
    };
}

export function setBackgroundImage(backgroundImage) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('backgroundImage', backgroundImage))
            .then(() => dispatch({
                type: SET_BACKGROUND_IMAGE,
                backgroundImage
            }))
            .catch(error => dispatch({
                type: SET_BACKGROUND_IMAGE_FAILURE,
                error
            }));
    };
}

export function setWelcomeVideo(welcomeVideo) {
    return dispatch => {
        return Promise.resolve()
            .then(() => localForage.setItem('welcomeVideo', welcomeVideo))
            .then(() => dispatch({
                type: SET_WELCOME_VIDEO,
                welcomeVideo
            }))
            .catch(error => dispatch({
                type: SET_WELCOME_VIDEO_FAILURE,
                error
            }));
    };
}

export function setUsername(username) {
    return dispatch => {
        return Promise.resolve()
            .then(() => dispatch({
                type: SET_USERNAME,
                username
            }))
            .catch(error => dispatch({
                type: SET_USERNAME_FAILURE,
                error
            }));
    };
}
