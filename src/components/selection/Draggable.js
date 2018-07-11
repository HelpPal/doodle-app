
import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import Radium from 'radium';
import first from 'lodash/first';

@Radium
export default class Draggable extends Component {

    static propTypes = {
        onDrag: PropTypes.func.isRequired,
        style: PropTypes.object
    }

    constructor(props) {
        super(props);
        this._handleDragStart = this.handleDragStart.bind(this);
        this._handleDragEnd = this.handleDragEnd.bind(this);
        this._handleMouseDrag = this.handleMouseDrag.bind(this);
        this._handleTouchDrag = this.handleTouchDrag.bind(this);
        this.lastTouch = { x: 0, y: 0 };
    }

    componentDidMount() {
        const domNode = findDOMNode(this);
        domNode.addEventListener('mousedown', this._handleDragStart);
        domNode.addEventListener('touchstart', this._handleDragStart);
    }

    componentWillUnmount() {
        const domNode = findDOMNode(this);
        domNode.removeEventListener('mousedown', this._handleDragStart);
        window.removeEventListener('mouseup', this._handleDragEnd);
        window.removeEventListener('mousemove', this._handleTouchDrag);
        domNode.removeEventListener('touchstart', this._handleDragStart);
    }

    handleDragStart(e) {
        this.lastTouch = null;
        window.addEventListener('mousemove', this._handleMouseDrag);
        window.addEventListener('mouseup', this._handleDragEnd);
        window.addEventListener('touchmove', this._handleTouchDrag);
        window.addEventListener('touchend', this._handleDragEnd);
    }

    handleDragEnd() {
        window.removeEventListener('mousemove', this._handleMouseDrag);
        window.removeEventListener('touchmove', this._handleTouchDrag);
    }

    handleTouchDrag(e) {
        const touch = first(e.touches);
        const currentTouch = { x: touch.clientX, y: touch.clientY };
        const movement = this.lastTouch ? this.getTouchMovement(currentTouch, this.lastTouch)
                                        : { x: 0, y: 0 };
        this.lastTouch = currentTouch;
        this.props.onDrag({
            x: movement.x,
            y: movement.y
        });
    }

    handleMouseDrag(e) {
        this.props.onDrag({
          x: e.movementX,
          y: e.movementY
        });
    }

    getTouchMovement(currentTouch, lastTouch) {
        return {
            x: currentTouch.x - lastTouch.x,
            y: currentTouch.y - lastTouch.y
        };
    }

    render() {
        return (
            <div style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
