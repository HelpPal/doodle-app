
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import values from 'lodash/values';
import each from 'lodash/each';
import { Map } from 'immutable';

import ImageCollection from '../../../models/ImageCollection';
import { getSelectedId } from '../../../redux/selection';
import { Toolbars, getActiveToolbar } from '../../../redux/toolbars';
import { getImages } from '../../../redux/images';

function mapStateToProps(state) {
    return {
        activeToolbar: getActiveToolbar(state),
        images: getImages(state),
        selectedId: getSelectedId(state)
    };
}

export default function provideImages(WrappedComponent) {

    return @connect(mapStateToProps)
    class WrapWithImages extends Component {

        static propTypes = {
            activeToolbar: PropTypes.oneOf(values(Toolbars)).isRequired,
            selectedId: PropTypes.string,
            images: PropTypes.instanceOf(ImageCollection).isRequired
        }

        state = {
            imageTextures: Map()
        };

        componentDidMount() {
            this.updateImages(this.props.images);
        }

        componentDidUpdate(prevProps) {
            const imagesChanged = prevProps.images !== this.props.images;
            if (imagesChanged) {
                this.updateImages(this.props.images);
            }
        }

        updateImages(images) {
            if (!images) {
                this.setState({
                    imageTextures: Map()
                });
            }
            each(images.toArray(), image => {
                const img = new Image();
                img.onload = () => {
                    this.setState({
                        imageTextures: this.state.imageTextures.set(image.getUrl(), img)
                    });
                };
                img.crossOrigin = 'Anonymous';
                img.src = image.getUrl();
            });
        }

        render() {
            return (
                <WrappedComponent imageTextures={this.state.imageTextures}
                                  {...this.props} />
            );
        }
    };
}
