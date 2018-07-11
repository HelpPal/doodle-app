
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { vec3, mat4, quat } from 'gl-matrix';
import enhanceWithClickOutside from 'react-click-outside';
import Radium from 'radium';
import clamp from 'lodash/clamp';

import SelectionDeleteHandle from './SelectionDeleteHandle';
import SelectionRotationHandle from './SelectionRotationHandle';
import SelectionResizeHandle from './SelectionResizeHandle';
import Draggable from './Draggable';
import styles from './CurrentSelection.styles';
import { transformSelection,
         getSelectedId,
         getSelectionSize,
         getSelectionPosition,
         getSelectionRotation,
         getSelectionPadding } from '~/redux/selection';
import { isImageToolbarActive } from '~/redux/toolbars';
import { getAccentColor } from '~/redux/app';
import { DEFAULT_SELECTION_WIDTH,
         DEFAULT_SELECTION_HEIGHT,
         MINIMUM_IMAGE_SIZE } from '~/constants';

function mapStateToProps(state) {
    return {
        accentColor: getAccentColor(state),
        currentSelection: getSelectedId(state),
        size: getSelectionSize(state),
        position: getSelectionPosition(state),
        rotation: getSelectionRotation(state),
        padding: getSelectionPadding(state),
        isImageToolbarActive: isImageToolbarActive(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        transformSelection: transform => dispatch(transformSelection(transform))
    };
}

const positionPropType = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
});

const sizePropType = PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
});

@Radium
@connect(mapStateToProps, mapDispatchToProps)
@enhanceWithClickOutside
export default class CurrentSelection extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        padding: PropTypes.number.isRequired,
        position: positionPropType.isRequired,
        size: sizePropType.isRequired,
        canvasDimensions: sizePropType.isRequired,
        rotation: PropTypes.number.isRequired,
        currentSelection: PropTypes.string,
        isImageToolbarActive: PropTypes.bool.isRequired,
        onClickOutsideSelection: PropTypes.func.isRequired,
        transformSelection: PropTypes.func.isRequired
    }

    static defaultProps = {
        padding: 0,
        position: { x: 0, y: 0 },
        // size: {
        //     width: DEFAULT_SELECTION_WIDTH,
        //     height: DEFAULT_SELECTION_HEIGHT
        // },
        rotation: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            transform: mat4.create()
        };
    }

    componentWillReceiveProps(nextProps) {
        const position = nextProps.position;
        const padding = nextProps.padding;
        const rotationInZAxis = nextProps.rotation;
        const translation = vec3.fromValues(position.x - padding, position.y - padding, 1);
        const rotation = quat.setAxisAngle(quat.create(), vec3.fromValues(0, 0, 1), rotationInZAxis);
        const scale = vec3.fromValues(1, 1, 1);
        this.setState({
            transform: mat4.fromRotationTranslationScale(this.state.transform,
                                                         rotation,
                                                         translation,
                                                         scale)
        });
    }

    handleClickOutside(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        this.props.onClickOutsideSelection(e, { x, y });
    }

    setSize(size) {
        // const imageConstraint = Math.min(
        //     Math.max(MINIMUM_IMAGE_SIZE.height, size.height),
        //     Math.max(MINIMUM_IMAGE_SIZE.width, size.width));
        // const imageSize = {
        //     width: imageConstraint,
        //     height: imageConstraint
        // };
        // const finalSize = isImage ? imageSize : size;
        this.props.transformSelection({
            position: this.props.position,
            size,
            rotation: this.props.rotation
        });
    }

    setRotation(rotationInZAxis) {
        this.props.transformSelection({
            position: this.props.position,
            size: this.props.size,
            rotation: rotationInZAxis
        });
    }

    updatePosition(changeInPosition) {
        const position = {
          x: this.props.position.x + changeInPosition.x,
          y: this.props.position.y + changeInPosition.y
        };
        // const maxWidth = this.props.canvasDimensions.width - this.props.size.width;
        // const maxHeight = this.props.canvasDimensions.height - this.props.size.height;
        // const positionWithinBounds = {
        //     x: clamp(position.x, 0, maxWidth),
        //     y: clamp(position.y, 0, maxHeight)
        // };
        this.props.transformSelection({
            position: position,
            size: this.props.size,
            rotation: this.props.rotation
        });
    }

    render() {
        return (
            <Draggable style={this.getContainerStyle()} onDrag={this.updatePosition.bind(this)}>
                {this.props.children}
                <SelectionDeleteHandle style={styles.deleteHandle}
                                       accentColor={this.props.accentColor}/>
                <SelectionRotationHandle style={styles.rotationHandle}
                                         accentColor={this.props.accentColor}
                                         position={this.props.position}
                                         padding={this.props.padding}
                                         size={this.props.size}
                                         rotation={this.getRotationAngle()}
                                         onRotate={this.setRotation.bind(this)}
                                         selectionContainerRef={this.props.selectionContainerRef}/>
                <SelectionResizeHandle style={styles.resizeHandle}
                                       accentColor={this.props.accentColor}
                                       position={this.props.position}
                                       size={this.props.size}
                                       onResize={this.setSize.bind(this)}
                                       selectionContainerRef={this.props.selectionContainerRef}/>
            </Draggable>
        );
    }

    getRotationAngle() {
        const rotation = mat4.getRotation(quat.create(), this.state.transform);
        return quat.getAxisAngle(vec3.fromValues(0, 0, 1), rotation);
    }

    getContainerStyle() {
        const { accentColor } = this.props;
        const { transform } = this.state;
        const padding = this.props.padding;
        return [
            styles.container({ accentColor }),
            {
                transform: `matrix3d(${transform})`,
                width: this.props.size.width + 3 * padding, // NOTE: don't know why this works, but it does... Jon 4/2
                height: this.props.size.height + 3 * padding,
                padding
            }
        ];
    }
}
