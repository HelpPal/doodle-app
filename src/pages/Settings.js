/* globals CONFIG */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Model } from 'caldera-immutable-model';
import opentype from 'opentype.js';

import { api } from '~/constants';
import { getAccentColor,
         setLogoImage,
         getLogoImage,
         getKeyedImages,
         setKeyedImage,
         getFeature,
         enableFeature,
         disableFeature,
         getBackgroundImage,
         setBackgroundImage,
         unsetKeyedImage,
         getWelcomeVideo,
         setWelcomeVideo } from '~/redux/app';
import { getFontPath, changeFontPath, changeFontFamily } from '~/redux/text';
import { ImageUploader,
         AccentColorPicker,
         StrokeWidthPicker,
         ExportPicker,
         CanvasDimensionPicker,
         PrintRotationPicker,
         FeatureToggle } from '~/components/settings';
import styles from './Settings.styles';

function getImage(image) {
    return image && `${CONFIG.s3.bucketUrl}/${encodeURIComponent(image)}`;
}

// FIXME
function getFontUrl(font) {
    return font && `http://${api.host}:${api.port}/api/uploads/${encodeURIComponent(font)}`;
}

function mapStateToProps(state) {
    return {
        keyedImages: getKeyedImages(state),
        logoImage: getLogoImage(state),
        accentColor: getAccentColor(state),
        fontPath: getFontPath(state),
        drawingEnabled: getFeature(state, 'drawing'),
        imagesEnabled: getFeature(state, 'images'),
        textEnabled: getFeature(state, 'text'),
        backgroundImage: getBackgroundImage(state),
        welcomeVideo: getWelcomeVideo(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setKeyedImage: (key, image) => dispatch(setKeyedImage(key, image)),
        unsetKeyedImage: (key) => dispatch(unsetKeyedImage(key)),
        setLogoImage: image => dispatch(setLogoImage(image)),
        changeFontPath: fontPath => dispatch(changeFontPath(fontPath)),
        changeFontFamily: fontFamily => dispatch(changeFontFamily(fontFamily)),
        enableFeature: feature => dispatch(enableFeature(feature)),
        disableFeature: feature => dispatch(disableFeature(feature)),
        setBackgroundImage: backgroundImage => dispatch(setBackgroundImage(backgroundImage)),
        setWelcomeVideo: welcomeVideo => dispatch(setWelcomeVideo(welcomeVideo))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class Settings extends Component {

    static propTypes = {
        backgroundImage: PropTypes.string,
        drawingEnabled: PropTypes.bool.isRequired,
        textEnabled: PropTypes.bool.isRequired,
        imagesEnabled: PropTypes.bool.isRequired,
        keyedImages: PropTypes.instanceOf(Model).isRequired,
        logoImage: PropTypes.string,
        setLogoImage: PropTypes.func.isRequired,
        accentColor: PropTypes.string.isRequired,
        fontPath: PropTypes.string.isRequired,
        changeFontPath: PropTypes.func.isRequired,
        changeFontFamily: PropTypes.func.isRequired,
        enableFeature: PropTypes.func.isRequired,
        disableFeature: PropTypes.func.isRequired,
        setBackgroundImage: PropTypes.func.isRequired,
        unsetKeyedImage: PropTypes.func.isRequired,
        setWelcomeVideo: PropTypes.func.isRequired,
        welcomeVideo: PropTypes.string
    }

    handleChangeFont(fontPath) {
        const url = getFontUrl(fontPath);
        opentype.load(url, (err, font) => {
            if (err) {
                throw err;
            }
            const fontFamily = font.names.fullName.en;
            this.props.changeFontPath(fontPath);
            this.props.changeFontFamily(`"${fontFamily}"`);
        });
    }

    render() {
        const { accentColor, logoImage, keyedImages, fontPath, backgroundImage } = this.props;
        return (
            <div style={styles.container}>
                <h1 style={styles.title({ accentColor })}>Settings</h1>
                <h3 style={styles.subtitle({ accentColor })}>Select a logo (for the loading screen)</h3>
                <div style={styles.row}>
                  <ImageUploader message="Logo"
                                 defaultImage={getImage(logoImage)}
                                 onUploadComplete={image => {
                                     this.props.setLogoImage(image);
                                 }}/>
                </div>
                <h3 style={styles.subtitle({ accentColor })}>Select a background image</h3>
                <div style={styles.row}>
                    <ImageUploader message="Background image"
                                   defaultImage={getImage(backgroundImage)}
                                   onUploadComplete={img => this.props.setBackgroundImage(img)}/>
                </div>
                <div style={styles.row}>
                    <ImageUploader message="Intro Video"
                                   deleteEnabled
                                   defaultImage={this.props.welcomeVideo}
                                   onUploadComplete={welcomeVideo => {
                                     this.props.setWelcomeVideo(welcomeVideo);
                                   }}
                                   onRequestDelete={() => this.props.setWelcomeVideo(null)}/>
                </div>
                <h3 style={styles.subtitle({ accentColor })}>Select clip art</h3>
                <div style={styles.row}>
                  <ImageUploader message="1"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('0'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('0', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('0')}/>
                  <ImageUploader message="2"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('1'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('1', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('1')}/>
                  <ImageUploader message="3"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('2'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('2', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('2')}/>
                  <ImageUploader message="4"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('3'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('3', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('3')}/>
                  <ImageUploader message="5"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('4'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('4', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('4')}/>
                  <ImageUploader message="6"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('5'))}
                                 onUploadComplete={image => {
                                   this.props.setKeyedImage('5', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('5')}/>
                </div>
                <div style={styles.row}>
                  <ImageUploader message="7"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('6'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('6', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('6')}/>
                  <ImageUploader message="8"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('7'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('7', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('7')}/>
                  <ImageUploader message="9"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('8'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('8', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('8')}/>
                  <ImageUploader message="10"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('9'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('9', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('9')}/>
                  <ImageUploader message="11"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('10'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('10', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('10')}/>
                  <ImageUploader message="12"
                                 deleteEnabled
                                 defaultImage={getImage(keyedImages.get('11'))}
                                 onUploadComplete={image => {
                                     this.props.setKeyedImage('11', image);
                                 }}
                                 onRequestDelete={() => this.props.unsetKeyedImage('11')}/>
                </div>
                <h3 style={styles.subtitle({ accentColor })}>Set art board ratio presets</h3>
                <div style={[styles.row, { paddingTop: 5 }]}>
                  <CanvasDimensionPicker presetID="1"/>
                  <CanvasDimensionPicker presetID="2"/>
                  <CanvasDimensionPicker presetID="3"/>
                </div>
                <h3 style={styles.subtitle({ accentColor })}>Enable/Disable features</h3>
                <div style={[styles.row, { paddingTop: 5 }]}>
                  <FeatureToggle
                    accentColor={accentColor}
                    name="Images"
                    enabled={this.props.imagesEnabled}
                    onRequestEnable={() => this.props.enableFeature('images')}
                    onRequestDisable={() => this.props.disableFeature('images')}
                  />
                  <FeatureToggle
                    accentColor={accentColor}
                    name="Text"
                    enabled={this.props.textEnabled}
                    onRequestEnable={() => this.props.enableFeature('text')}
                    onRequestDisable={() => this.props.disableFeature('text')}
                  />
                  <FeatureToggle
                    accentColor={accentColor}
                    name="Drawing"
                    enabled={this.props.drawingEnabled}
                    onRequestEnable={() => this.props.enableFeature('drawing')}
                    onRequestDisable={() => this.props.disableFeature('drawing')}
                  />
                </div>
                <div style={styles.row}>
                    <AccentColorPicker message="Accent Color"/>
                </div>
                <div style={styles.row}>
                    <StrokeWidthPicker/>
                </div>
                <div style={styles.row}>
                    <ImageUploader message={fontPath || "Upload a font file"}
                                   defaultImage={null}
                                   onUploadComplete={this.handleChangeFont}/>
                </div>
                <div style={styles.row}>
                    <ExportPicker message="Select export destination"/>
                </div>
                <div style={styles.row}>
                    <PrintRotationPicker message="Select print rotation"/>
                </div>
            </div>
        );
    }
}
