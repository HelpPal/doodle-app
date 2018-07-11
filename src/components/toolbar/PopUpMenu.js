/* globals CONFIG */
import React, { PropTypes, Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { Model } from 'caldera-immutable-model';
import flatMap from 'lodash/flatMap';

import { DEFAULT_SELECTION_SIZE } from '~/constants';
import { createImageAsCurrentSelection, selectImagePath } from '~/redux/images';
import { getKeyedImages } from '~/redux/app';
import styles from './PopUpMenu.styles';


function mapStateToProps(state) {
    return {
        keyedImages: getKeyedImages(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createImageAsCurrentSelection: point => dispatch(createImageAsCurrentSelection(point)),
        selectImagePath: imagePath => dispatch(selectImagePath(imagePath))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
class PopUpMenu extends Component {

    static propTypes = {
        keyedImages: PropTypes.instanceOf(Model).isRequired,
        accentColor: PropTypes.string.isRequired,
        isOpen: PropTypes.bool,
        onRequestClose: PropTypes.func.isRequired,
        createImageAsCurrentSelection: PropTypes.func.isRequired,
        selectImagePath: PropTypes.func.isRequired
    }

    handleImageSelect(imagePath) {
        const canvas = document.querySelector('#webGLCanvas');
        const { width: canvasWidth, height: canvasHeight } = canvas;
        const { width: boxWidth, height: boxHeight } = DEFAULT_SELECTION_SIZE;
        const position = {
            x: (canvasWidth - boxWidth) * 0.5,
            y: (canvasHeight - boxHeight) * 0.5
        };
        Promise.resolve()
            .then(() => this.props.selectImagePath(imagePath))
            .then(() => this.props.createImageAsCurrentSelection(position))
            .then(() => this.props.onRequestClose());
    }

    renderOverlay() {
        const overlayStyle = [
            styles.overlay,
            this.props.isOpen && styles.overlayVisible
        ];
        return (
            <div style={overlayStyle}
                 onClick={this.props.onRequestClose}/>
        );
    }

    render() {
        const { accentColor, keyedImages } = this.props;
        return (
            <div style={[styles.container, this.props.isOpen && styles.containerVisible]}>
                {this.renderOverlay()}
                <div style={[styles.menuContainer, this.props.isOpen && styles.menuContainerVisible]}>
                    <div style={styles.menu({ accentColor })}>
                        {flatMap(keyedImages.toJS(), (image, key) => {
                            if (!image) {
                                return;
                            }
                            const imageUrl = getAsset(image);
                            return image && (
                                <div style={[{ backgroundImage: `url(${imageUrl})` }, styles.image]}
                                     onClick={() => this.handleImageSelect(imageUrl)}/>
                            );
                        })}
                    </div>
                    <div style={styles.arrow({ accentColor })}/>
                </div>
            </div>
        );
    }
}

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(getAsset)}`;
}

export default PopUpMenu;
