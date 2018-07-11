import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Radium from 'radium';
import { autobind } from 'core-decorators';

@Radium
@autobind
export default class SquareConstraint extends Component {

    state = {
        minConstraint: 0
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        const domNode = findDOMNode(this);
        const width = domNode.clientWidth;
        const height = domNode.clientHeight;
        this.setState({
            minConstraint: Math.min(width, height)
        });
    }

    render() {
        const size = this.state.minConstraint;
        return (
            <div {...this.props}>
                <div style={{ height: size, width: size, position: 'relative' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
