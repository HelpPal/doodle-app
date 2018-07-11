
import { handleActions } from 'redux-actions';

import { teal } from '~/colors';
import { DEFAULT_STROKE_WIDTH } from '~/constants';
import { SET_ACCENT_COLOR,
         SET_LOGO_IMAGE,
         SET_IMAGE,
         SET_STROKE_WIDTH,
         SET_EXPORT_KIND,
         SET_ARTBOARD_PRESET,
         LOAD_APP_DATA,
         SET_ACTIVE_ARTBOARD_PRESET,
         SET_PRINT_ROTATION,
         TOGGLE_FEATURE,
         SET_BACKGROUND_IMAGE,
         UNSET_IMAGE,
         SET_WELCOME_VIDEO,
         SET_USERNAME,
         ExportKind } from './constants';
import AppState from './AppState';

const initialState = new AppState({
    accentColor: teal,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    exportKind: ExportKind.UPLOAD,
    activeArtboardPreset: '1'
});

const actions = {
    [SET_ACCENT_COLOR]: (state, { color }) => {
        return state.setAccentColor(color);
    },
    [SET_LOGO_IMAGE]: (state, { logoImage }) => {
        return state.setLogoImage(logoImage);
    },
    [SET_IMAGE]: (state, { image, key }) => {
        return state.setKeyedImage(key, image);
    },
    [UNSET_IMAGE]: (state, { key }) => {
        return state.unsetKeyedImage(key);
    },
    [SET_STROKE_WIDTH]: (state, { strokeWidth }) => {
        return state.setStrokeWidth(strokeWidth);
    },
    [SET_EXPORT_KIND]: (state, { exportKind }) => {
        return state.setExportKind(exportKind);
    },
    [SET_ARTBOARD_PRESET]: (state, { presetID, width, height }) => {
        return state.setArtboardPreset(presetID, width, height);
    },
    [SET_ACTIVE_ARTBOARD_PRESET]: (state, { presetID }) => {
      return state.setActiveArtboardPreset(presetID);
    },
    [SET_PRINT_ROTATION]: (state, { printRotation }) => {
        return state.setPrintRotation(printRotation);
    },
    [SET_BACKGROUND_IMAGE]: (state, { backgroundImage }) => {
        return state.setBackgroundImage(backgroundImage);
    },
    [TOGGLE_FEATURE]: (state, { feature, enabled }) => {
        return state.setFeature(feature, enabled);
    },
    [SET_WELCOME_VIDEO]: (state, { welcomeVideo }) => {
        return state.setWelcomeVideo(welcomeVideo);
    },
    [SET_USERNAME]: (state, { username }) => {
        return state.setUsername(username);
    },
    [LOAD_APP_DATA]: (state, { color, logoImage, strokeWidth, welcomeVideo, keyedImages, backgroundImage, presets, exportKind, printRotation, features }) => {
        return state.setAccentColor(color)
                    .setLogoImage(logoImage)
                    .setStrokeWidth(strokeWidth)
                    .setExportKind(exportKind)
                    .setKeyedImages(keyedImages)
                    .setPrintRotation(printRotation)
                    .setBackgroundImage(backgroundImage)
                    .setArtboardPreset('1', presets.preset1.width, presets.preset1.height)
                    .setArtboardPreset('2', presets.preset2.width, presets.preset2.height)
                    .setArtboardPreset('3', presets.preset3.width, presets.preset3.height)
                    .setFeatures(features)
                    .setWelcomeVideo(welcomeVideo);
    }
};

export default handleActions(actions, initialState);
