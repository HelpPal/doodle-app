
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import values from 'lodash/values';
import Radium from 'radium';
import FaPaintBrush from 'react-icons/lib/fa/paint-brush';
import FaFont from 'react-icons/lib/fa/font';
import FaPlus from 'react-icons/lib/fa/plus-circle';
import FaPointerHand from 'react-icons/lib/fa/hand-pointer-o';
import { autobind } from 'core-decorators';

import { DEFAULT_SELECTION_SIZE } from '~/constants';
import { createTextAsCurrentSelection } from '~/redux/text';
import { Toolbars,
         getActiveToolbar,
         changeActiveToolbar } from '~/redux/toolbars';
import { getFeature } from '~/redux/app';
import PopUpMenu from './PopUpMenu';

import styles from './Toolbar.styles';

function mapStateToProps(state) {
    return {
        drawingEnabled: getFeature(state, 'drawing'),
        imagesEnabled: getFeature(state, 'images'),
        textEnabled: getFeature(state, 'text'),
        activeToolbar: getActiveToolbar(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeActiveToolbar: toolbar => dispatch(changeActiveToolbar(toolbar)),
        createTextAsCurrentSelection: point => dispatch(createTextAsCurrentSelection(point))
    };
}


@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
class Toolbar extends Component {

    static propTypes = {
        style: PropTypes.object,
        drawingEnabled: PropTypes.bool.isRequired,
        textEnabled: PropTypes.bool.isRequired,
        imagesEnabled: PropTypes.bool.isRequired,
        accentColor: PropTypes.string.isRequired,
        activeToolbar: PropTypes.oneOf(values(Toolbars)).isRequired,
        changeActiveToolbar: PropTypes.func.isRequired,
        createTextAsCurrentSelection: PropTypes.func.isRequired
    }

    state = {
        isImagePickerOpen: false
    }

    render() {
        const { accentColor } = this.props;
        return (
            <div style={[styles.toolbarContainer({ accentColor }), this.props.style]}>
                {this.renderChangeToolbarOptions()}
            </div>
        );
    }

    handleTextOnClick() {
        const canvas = document.querySelector('#webGLCanvas');
        const { width: canvasWidth, height: canvasHeight } = canvas;
        const { width: boxWidth, height: boxHeight } = DEFAULT_SELECTION_SIZE;
        const position = {
            x: (canvasWidth - boxWidth) * 0.5,
            y: (canvasHeight - boxHeight) * 0.5
        };
        Promise.resolve()
            .then(() => this.props.changeActiveToolbar(Toolbars.Text))
            .then(() => this.props.createTextAsCurrentSelection(position));
    }

    handleImageOnClick() {
        Promise.resolve()
            .then(() => this.props.changeActiveToolbar(Toolbars.Image))
            .then(() => this.setState({ isImagePickerOpen: !this.state.isImagePickerOpen }));
    }

    renderChangeToolbarOptions() {
        const isPathActive = (this.props.activeToolbar === Toolbars.Path);
        const isFontActive = (this.props.activeToolbar === Toolbars.Text);
        const isSelectActive = (this.props.activeToolbar === Toolbars.Select);
        const isImageActive = (this.props.activeToolbar === Toolbars.Image);
        return (
            <div style={styles.toolbar}>
                <PopUpMenu isOpen={this.state.isImagePickerOpen}
                           onRequestClose={() => this.setState({ isImagePickerOpen: false })}
                           accentColor={this.props.accentColor}/>
                {this.props.drawingEnabled && (
                    <FaPaintBrush
                        style={isPathActive ? styles.activeIcon : styles.icons}
                        onClick={() => this.props.changeActiveToolbar(Toolbars.Path)}
                    />
                )}
                {this.props.textEnabled && (
                    <FaFont
                        style={isFontActive ? styles.activeIcon : styles.icons}
                        onClick={this.handleTextOnClick}
                    />
                )}
                {this.props.imagesEnabled && (
                    <FaPlus
                        style={isImageActive ? styles.activeImg : styles.img}
                        onClick={this.handleImageOnClick}
                    />
                )}
                <FaPointerHand style={isSelectActive ? styles.activeIcon : styles.icons}
                               onClick={() => this.props.changeActiveToolbar(Toolbars.Select)}/>
            </div>
        );
    }
}

export default Toolbar;
