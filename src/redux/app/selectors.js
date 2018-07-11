
import { APP } from './constants';

export function getAccentColor(state) {
  return state[APP].getAccentColor();
}

export function getLogoImage(state) {
  return state[APP].getLogoImage();
}

export function getKeyedImages(state) {
  return state[APP].getKeyedImages();
}

export function getStrokeWidth(state) {
  return state[APP].getStrokeWidth();
}

export function getArtboardPreset(state, presetID) {
  return state[APP].getArtboardPreset(presetID);
}

export function getActiveArtboardPreset(state) {
  const presetID = state[APP].getActiveArtboardPreset();
  return getArtboardPreset(state, presetID);
}

export function getExportKind(state) {
  return state[APP].getExportKind();
}

export function getPrintRotation(state) {
  return state[APP].getPrintRotation();
}

export function getFeature(state, feature) {
  return state[APP].getFeature(feature);
}

export function getFeatures(state) {
  return state[APP].getFeatures();
}

export function getBackgroundImage(state) {
  return state[APP].getBackgroundImage();
}

export function getWelcomeVideo(state) {
    return state[APP].getWelcomeVideo();
}

export function getUsername(state) {
    return state[APP].getUsername();
}
