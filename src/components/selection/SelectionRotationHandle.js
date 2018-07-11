
import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { vec2 } from 'gl-matrix';
import Radium from 'radium';
import FaRotate from 'react-icons/lib/fa/rotate-left';
import first from 'lodash/first';
import $ from 'jquery';

import styles from './SelectionHandles.styles';

const positionPropType = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
});

const sizePropType = PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
});

@Radium
export default class SelectionRotationHandle extends Component {

    static propTypes = {
        style: PropTypes.object,
        accentColor: PropTypes.string.isRequired,
        position: positionPropType.isRequired,
        padding: PropTypes.number.isRequired,
        size: sizePropType.isRequired,
        onRotate: PropTypes.func.isRequired,
        selectionContainerRef: PropTypes.node.isRequired
    }

    static defaultProps = {
        padding: 0
    }

    constructor(props) {
        super(props);
        this._startTrackingRotation = this.startTrackingRotation.bind(this);
        this._stopTrackingRotation = this.stopTrackingRotation.bind(this);
        this._trackMouseMove = this.trackMouseMove.bind(this);
        this._trackTouchMove = this.trackTouchMove.bind(this);
    }

    componentDidMount() {
        const domNode = findDOMNode(this);
        domNode.addEventListener('mousedown', this._startTrackingRotation);
        domNode.addEventListener('touchstart', this._startTrackingRotation);
    }

    componentWillUnmount() {
        const domNode = findDOMNode(this);
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        domNode.removeEventListener('mousedown', this._startTrackingRotation);
        domNode.removeEventListener('touchstart', this._startTrackingRotation);
        containerNode.removeEventListener('mouseup', this._stopTrackingRotation);
        containerNode.removeEventListener('touchend', this._stopTrackingRotation);
        containerNode.removeEventListener('mousemove', this._trackMouseMove);
        containerNode.removeEventListener('touchmove', this._trackTouchMove);

    }

    startTrackingRotation(e) {
        e.preventDefault();
        e.stopPropagation();
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        containerNode.addEventListener('mousemove', this._trackMouseMove);
        containerNode.addEventListener('touchmove', this._trackTouchMove);
        containerNode.addEventListener('mouseup', this._stopTrackingRotation);
        containerNode.addEventListener('touchend', this._stopTrackingRotation);
    }

    stopTrackingRotation(e) {
        e.preventDefault();
        e.stopPropagation();
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        containerNode.removeEventListener('mousemove', this._trackMouseMove);
        containerNode.removeEventListener('touchmove', this._trackTouchMove);
        containerNode.removeEventListener('mouseup', this._stopTrackingRotation);
        containerNode.removeEventListener('touchend', this._stopTrackingRotation);
    }

    trackMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        return this.trackRotation({ x: e.x, y: e.y });
    }

    trackTouchMove(e) {
        e.stopPropagation();
        const touch = first(event.touches);
        return this.trackRotation({ x: touch.pageX, y: touch.pageY });
    }

    trackRotation(e) {
        const rotation = this.calculateRotationInRadians(e);
        this.props.onRotate(rotation);
    }

    calculateRotationInRadians({ x, y }) {
        const { padding, position, size } = this.props;
        const containerNode = findDOMNode(this.props.selectionContainerRef);
        const offset = $(containerNode).position();
        const mousePosition = vec2.fromValues(x, y);
        const center = {
            x: offset.left + position.x + 0.5 * size.width + padding,
            y: offset.top + position.y + 0.5 * size.height + padding
        };
        const topRightCorner = {
            x: offset.left + position.x + size.width + 2 * padding,
            y: offset.top + position.y
        };
        const centerVec = vec2.fromValues(center.x, center.y);
        const topRightCornerVec = vec2.fromValues(topRightCorner.x, topRightCorner.y);
        const a = vec2.subtract(vec2.create(), topRightCornerVec, centerVec);
        const b = vec2.subtract(vec2.create(), mousePosition, centerVec);
        const slope = (size.height + 2 * padding) / (size.width + 2 * padding);
        const line = t => {
            const yIntercept = (offset.top + position.y) + size.height + 2 * padding;
            return -slope * (t - (offset.left + position.x)) + yIntercept;
        };
        const direction = line(x) > y ? -1 : 1;
        return direction * calculateAngleBetweenVectors(a, b);
    }

    render() {
        const { accentColor } = this.props;
        return (
            <div style={[styles.container({ accentColor }), this.props.style]}>
                <FaRotate style={styles.icon}/>
            </div>
        );
    }
}

function calculateAngleBetweenVectors(a, b) {
    return Math.acos(vec2.dot(vec2.normalize(b, b), vec2.normalize(a, a)));
}
