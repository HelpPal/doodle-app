
import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import clamp from 'lodash/clamp';
import Radium from 'radium';
import FaArrowsAlt from 'react-icons/lib/fa/arrows-alt';
import first from 'lodash/first';

import styles from './SelectionHandles.styles';

const MINIMUM_WIDTH = 100;
const MINIMUM_HEIGHT = 100;

@Radium
export default class SelectionResizeHandle extends Component {

    static propTypes = {
        style: PropTypes.object,
        accentColor: PropTypes.string.isRequired,
        position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }).isRequired,
        size: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        }).isRequired,
        onResize: PropTypes.func.isRequired,
        selectionContainerRef: PropTypes.node.isRequired
    }

    constructor(props) {
        super(props);
        this._trackTouchResize = this.trackTouchResize.bind(this);
        this._trackMouseResize = this.trackMouseResize.bind(this);
        this._startTrackingResize = this.startTrackingResize.bind(this);
        this._stopTrackingResize = this.stopTrackingResize.bind(this);
        this.lastMovement = { x: 0, y: 0 };
    }

    componentDidMount() {
        const domNode = findDOMNode(this);
        domNode.addEventListener('mousedown', this._startTrackingResize);
        domNode.addEventListener('touchstart', this._startTrackingResize);
    }

    componentWillUnmount() {
        const domNode = findDOMNode(this);
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        domNode.removeEventListener('mousedown', this._startTrackingResize);
        domNode.removeEventListener('touchstart', this._startTrackingResize);
        containerNode.removeEventListener('mouseup', this._stopTrackingResize);
        containerNode.removeEventListener('touchend', this._stopTrackingResize);
        containerNode.removeEventListener('mousemove', this._trackMouseResize);
        containerNode.removeEventListener('touchmove', this._trackTouchResize);
    }

    startTrackingResize(e) {
        e.preventDefault();
        e.stopPropagation();
        this.lastMovement = null;
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        containerNode.addEventListener('mousemove', this._trackMouseResize);
        containerNode.addEventListener('touchmove', this._trackTouchResize);
        containerNode.addEventListener('mouseup', this._stopTrackingResize);
        containerNode.addEventListener('touchend', this._stopTrackingResize);
    }

    stopTrackingResize(e) {
        e.preventDefault();
        e.stopPropagation();
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        containerNode.removeEventListener('mousemove', this._trackMouseResize);
        containerNode.removeEventListener('touchmove', this._trackTouchResize);
        containerNode.removeEventListener('mouseup', this._stopTrackingResize);
        containerNode.removeEventListener('touchend', this._stopTrackingResize);
    }

    trackTouchResize(e) {
        const touch = first(e.touches);
        this.props.onResize(this.calculateSize({ x: touch.pageX, y: touch.pageY }));
    }

    trackMouseResize(e) {
        this.props.onResize(this.calculateSize({ x: e.x, y: e.y }));
    }

    calculateSize({ x, y }) {
        const { size } = this.props;
        const deltaSize = {
            width: size.width + (this.lastMovement ? x - this.lastMovement.x : 0),
            height: size.height + (this.lastMovement ? y - this.lastMovement.y : 0)
        };
        this.lastMovement = { x, y };
        return {
            width: clamp(deltaSize.width, MINIMUM_WIDTH, Infinity),
            height: clamp(deltaSize.height, MINIMUM_HEIGHT, Infinity)
        };
    }

    render() {
        const { accentColor } = this.props;
        return (
            <div style={[styles.container({ accentColor }), this.props.style]}>
                <FaArrowsAlt style={styles.icon}/>
            </div>
        );
    }
}
