
/* globals CONFIG */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import $ from 'jquery';

import { getAccentColor } from '~/redux/app';
import { SquareConstraint } from '~/components/general';
import { api } from '~/constants';
import Uploader from '~/components/uploader/Uploader';

import styles from './ImageUploader.styles';

function mapStateToProps(state) {
    return {
        accentColor: getAccentColor(state)
    };
}

@connect(mapStateToProps)
@Radium
@autobind
export default class FontUploader extends Component {

    static propTypes = {
        defaultImage: PropTypes.string,
        onUploadComplete: PropTypes.func.isRequired,
        accentColor: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
    }

    state = {
        hasFiles: false
    }

    upload(e) {
        e && e.stopPropagation();
        this.uploader.uploadFiles();
    }

    handleUploadError(fileName, error) {
        console.error(`Failed to upload ${fileName}.`);
        console.trace(error);
    }

    handleUploadComplete(fileName) {
        Promise.resolve()
            .then(() => this.props.onUploadComplete(fileName))
            .then(() => this.uploader.clearFiles())
            .then(() => this.setState({ hasFiles: false }));
    }

    openFileBrowser() {
        $(findDOMNode(this.fileInput)).click();
    }

    handleFileBrowserDidSelectFiles() {
        const files = findDOMNode(this.fileInput).files;
        this.uploader.addFiles(files);
    }

    render() {
        const { hasFiles } = this.state;
        return (
            <SquareConstraint style={styles.container} onClick={this.openFileBrowser}>
                <Uploader ref={uploader => { this.uploader = uploader; }}
                          onError={this.handleUploadError}
                          onComplete={this.handleUploadComplete}
                          onAddFile={() => this.setState({ hasFiles: true })}
                          onClearFiles={() => this.setState({ hasFiles: false })}
                          style={styles.uploader}>
                    {hasFiles ? this.renderUploadButton() : this.renderMessage()}
                </Uploader>
            </SquareConstraint>
        );
    }

    renderUploadButton() {
        const { accentColor } = this.props;
        return (
            <div style={styles.inner({ accentColor })}>
                <button onClick={this.upload}
                        style={styles.uploadButton({ accentColor })}
                        key="uploadButton">
                    Upload
                </button>
            </div>
        );
    }

    renderMessage() {
        const { accentColor, defaultImage } = this.props;
        const imageStyles = defaultImage && {
            backgroundImage: `url(${defaultImage})`,
            ...styles.defaultImage
        };
        return (
            <div style={styles.inner({ accentColor })}>
                <div style={imageStyles}/>
                <input type="file"
                       ref={ref => { this.fileInput = ref; }}
                       onChange={this.handleFileBrowserDidSelectFiles}
                       style={styles.fileInput}/>
                <h3 style={styles.clickHere({ accentColor })}>
                    {this.props.message}
                </h3>
            </div>
        );
    }
}
