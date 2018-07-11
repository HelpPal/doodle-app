/* globals CONFIG */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as qq from 'fine-uploader';
import { DragAndDrop } from 'fine-uploader/dnd/dnd.js';
import noop from 'lodash/noop';
import last from 'lodash/last';
import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';
import uuid from 'uuid';

import { api } from '~/constants';

function getFileExtension(fileName: string): ?string {
  const fileNameParts = fileName.split('.');
  if (fileNameParts.length < 2) {
    return null;
  }
  const lastPart = last(fileNameParts).toLowerCase();
  if (lastPart.match('png')) {
    return 'png';
  }
  else if (lastPart.match('mov')) {
    return 'mov';
  }
  else if (lastPart.match('mp4')) {
    return 'mp4';
  }
  else {
    return 'jpg';
  }
}

export default class Uploader extends Component {

    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        debug: PropTypes.bool,
        onAddFile: PropTypes.func,
        onClearFiles: PropTypes.func,
        onError: PropTypes.func,
        onComplete: PropTypes.func,
        onProgress: PropTypes.func,
        resumeEnabled: PropTypes.bool,
        deleteEnabled: PropTypes.bool,
        chunkingEnabled: PropTypes.bool,
        concurrentChunkingEnabled: PropTypes.bool,
        autoUploadEnabled: PropTypes.bool,
        preview: PropTypes.element
    }

    static defaultProps = {
        onAddFile: noop,
        onClearFiles: noop,
        onComplete: noop,
        onProgress: noop,
        onError: noop,
        resumeEnabled: true,
        deleteEnabled: true,
        chunkingEnabled: true,
        concurrentChunkingEnabled: true,
        autoUploadEnabled: false
    }

    state = {
        showPreview: false
    }

    componentDidMount() {
        this.configureUploader();
    }

    configureUploader() {
        this.uploader = new qq.FineUploaderBasic(this.getUploaderConfig());
        this.dragAndDrop = new DragAndDrop({
            dropZoneElements: [ReactDOM.findDOMNode(this)],
            callbacks: {
                dropError: this.props.onError,
                processingDroppedFilesComplete: files => this.addFiles(files)
            }
        });
    }

    addFiles(files) {
        this.props.debug && console.log(`Adding ${files.length} files.`);
        this.uploader.addFiles(files);
        this.props.onAddFile();
    }

    uploadFiles() {
        this.props.debug && console.log('Starting upload.');
        const file = this.uploader.getFile(0);
        const ext = getFileExtension(file.name);
        const fileName = `${uuid.v4()}.${ext}`;
        const contentType = file.type;
        Promise.resolve(fetch(
          `http://${api.host}:${api.port}/api/media/signature`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contentType: contentType,
              fileName: fileName
            })
          }
        ))
        .then(res => res.json())
        .then(body => {
          return new Promise((resolve, reject) => {
             const reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = () => {
               const buffer = new Buffer(reader.result.replace(/^data:(image|video)\/\w+;base64,/, ''), 'base64');
               resolve(fetch(
                 body.url,
                 {
                   method: 'PUT',
                   headers: {
                     'x-amz-acl': 'public-read',
                     'Content-Type': contentType,
                     'Content-Length': buffer.length
                   },
                   body: buffer
                 }
               ));
             };
             reader.onerror = error => reject(error);
         });
        })
        .then(() => {
          this.props.onComplete(fileName);
        });
    }

    clearFiles() {
        this.props.debug && console.log('Clearing files.');
        this.uploader.clearStoredFiles();
        this.props.onClearFiles();
    }

    getUploaderConfig() {
        return {
            element: ReactDOM.findDOMNode(this),
            autoUpload: this.props.autoUploadEnabled,
            request: {
                method: 'PUT',
                endpoint: `http://${api.host}:${api.port}/api/uploads`, // FIXME
                headers: {
                  'x-amz-acl': 'public-read'
                }
            },
            chunking: {
            },
            resume: {
                enabled: this.props.resumeEnabled
            },
            deleteFile: {
                enabled: this.props.deleteEnabled
            },
            callbacks: {
                onComplete: (id, fileName, ...res) => {
                    this.props.debug && console.log(`Finished uploading ${fileName}.`);
                    this.props.onComplete(fileName);
                },
                onProgress: (id, fileName, uploadedBytes, totalBytes) => {
                    this.props.onProgress(fileName, uploadedBytes / totalBytes);
                },
                onError: (id, fileName, error) => this.props.onError(fileName, error),
                onSubmit: (id) => this.configurePreview(id)
            }
        };
    }

    configurePreview(id) {
        // const previewImage = ReactDOM.findDOMNode(this.previewImage);
        // this.uploader.drawThumbnail(id, previewImage);
    }

    render() {
        return (
            <div style={this.props.style} className={this.props.className}>
                {this.props.children}
            </div>
        );
    }
}
