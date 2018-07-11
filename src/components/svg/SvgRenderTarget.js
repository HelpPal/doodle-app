import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import map from 'lodash/map';
import { Map } from 'immutable';

import TextCollection from '~/models/TextCollection';
import PathCollection from '~/models/PathCollection';
import ImageCollection from '~/models/ImageCollection';
import { serializeSvgPathData,
         asPixels,
         createViewBox,
         pathTransform,
         textTransform,
         imageTransform } from './functions';

@autobind
export default class SvgRenderTarget extends Component {

    static propTypes = {
        style: PropTypes.object,
        strokeWidth: PropTypes.number.isRequired,
        paths: PropTypes.instanceOf(PathCollection),
        text: PropTypes.instanceOf(TextCollection),
        images: PropTypes.instanceOf(ImageCollection),
        imageTextures: PropTypes.instanceOf(Map),
        dimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }

    render() {
        const { width, height } = this.props.dimensions;
        return (
            <svg width={asPixels(width)}
                 height={asPixels(height)}
                 viewBox={createViewBox(0, 0, width, height)}
                 version="1.1"
                 xmlns="http://www.w3.org/2000/svg">
                 <title>Doodle</title>
                 {this.renderPaths(this.props.paths)}
                 {this.renderText(this.props.text)}
                 {this.renderImages(this.props.images)}
            </svg>
        );
    }

    renderPaths(paths) {
        return map(paths.toArray(), (path, i) => {
            const vertices = path.getVertices();
            if (!vertices || !vertices.size) {
                return;
            }
            const rotation = path.getRotation();
            const scale = path.getScale();
            const center = path.getCenter();
            const padding = path.getPadding();
            const paddedCenter = {
                x: center.x + padding,
                y: center.y + padding
            };
            const position = {
                x: path.getMinX(),
                y: path.getMinY()
            };
            return (
                <path d={serializeSvgPathData(path)}
                      fill="none"
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={this.props.strokeWidth}
                      transform={pathTransform(scale, rotation, paddedCenter, position)} />
            );
        });
    }

    renderText(texts) {
        return map(texts.toArray(), text => {
            const position = text.getPosition();
            const value = text.getValue();
            const fontSize = text.getFontSize();
            const padding = text.getPadding();
            const rotation = text.getRotation();
            return (
                <text x={position.x + padding}
                      y={position.y + padding}
                      fontSize={fontSize}
                      dominantBaseline="hanging"
                      transform={textTransform(rotation, position)}>
                    {value}
                </text>
            );
        });
    }

    renderImages(images) {
        return map(images.toArray(), image => {
            const position = image.getPosition();
            const size = image.getSize();
            const rotation = image.getRotation();
            const center = image.getCenter();
            const url = image.getUrl();

            /**
             * FIXME:
             * we still need to fix a bug where illustrator can't find images from urls.
             */

            return (
                <image href={url}
                       x={position.x}
                       y={position.y}
                       width={asPixels(size.width)}
                       height={asPixels(size.height)}
                       transform={imageTransform(rotation, center)}
                       preserveAspectRatio="none" />
            );
        });
    }
}
