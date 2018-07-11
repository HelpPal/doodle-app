
import { Model } from 'caldera-immutable-model';

export default class AppState extends Model {

    constructor(data) {
        super(data);
        this.keyedImages = new Model(this.get('keyedImages'));
        this.features = new Model(this.get('features'));
    }

    setAccentColor(color) {
        return this.set('accentColor', color);
    }

    getAccentColor(color) {
        return this.get('accentColor');
    }

    getLogoImage() {
        return this.get('logoImage');
    }

    setLogoImage(logoImage) {
        return this.set('logoImage', logoImage);
    }

    getKeyedImages() {
        return this.keyedImages;
    }

    setKeyedImages(keyedImages) {
        return this.set('keyedImages', keyedImages);
    }

    getKeyedImage(key) {
        return this.getKeyedImages().get(key);
    }

    setKeyedImage(key, image) {
        const keyedImages = this.getKeyedImages().set(key, image);
        return this.setKeyedImages(keyedImages);
    }

    unsetKeyedImage(key) {
        return this.setKeyedImage(key, null);
    }

    // StrokeWidth ----------

    getStrokeWidth() {
        return this.get('strokeWidth');
    }

    setStrokeWidth(strokeWidth) {
        return this.set('strokeWidth', strokeWidth);
    }

    // ExportKind ----------

    getExportKind() {
        return this.get('exportKind');
    }

    setExportKind(exportKind) {
        return this.set('exportKind', exportKind);
    }

    // ArtboardPreset ----------

    getArtboardPreset(presetID) {
        return this.get(`preset-${presetID}`);
    }

    setArtboardPreset(presetID, width, height) {
        return this.set(`preset-${presetID}`, { width, height });
    }

    // ActiveArtboardPreset ----------

    getActiveArtboardPreset() {
        return this.get('activeArtboardPreset');
    }

    setActiveArtboardPreset(activeArtboardPreset) {
        return this.set('activeArtboardPreset', activeArtboardPreset);
    }

    // PrintRotation ----------

    getPrintRotation() {
      return this.get('printRotation');
    }

    setPrintRotation(printRotation) {
      return this.set('printRotation', printRotation);
    }

    // Features ----------

    getFeatures() {
        return this.features;
    }

    setFeatures(features) {
        return this.set('features', features);
    }

    getFeature(feature) {
        return this.getFeatures().get(feature);
    }

    setFeature(feature, enabled = true) {
        const features = this.getFeatures().set(feature, enabled);
        return this.setFeatures(features);
    }

    // Background Image ----------

    setBackgroundImage(backgroundImage) {
        return this.set('backgroundImage', backgroundImage);
    }

    getBackgroundImage() {
        return this.get('backgroundImage');
    }

    // Welcome Video ----------

    setWelcomeVideo(welcomeVideo) {
        return this.set('welcomeVideo', welcomeVideo);
    }

    getWelcomeVideo() {
        return this.get('welcomeVideo');
    }

    // Username

    setUsername(username) {
        return this.set('username', username);
    }

    getUsername() {
        return this.get('username');
    }
}
