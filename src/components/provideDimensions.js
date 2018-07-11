import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

export default function provideDimensions(WrappedComponent) {
    return class extends Component {

        state = {
            width: 0,
            height: 0
        }

        constructor(props) {
            super(props);
            this._handleResize = this.handleResize.bind(this);
        }

        componentDidMount() {
            const domElement = findDOMNode(this);
            this.setState({
                width: domElement.clientWidth,
                height: domElement.clientHeight
            });
            window.addEventListener('resize', this._handleResize);
        }

        componentWillUpdate() {
            const domElement = findDOMNode(this);
            const componentSize = {
                width: domElement.clientWidth,
                height: domElement.clientHeight
            };
            if (componentSize.width !== this.state.width || componentSize.height !== this.state.height) {
                this.setState(componentSize);
            }
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this._handleResize);
        }

        handleResize() {
            const domElement = findDOMNode(this);
            this.setState({
                width: domElement.clientWidth,
                height: domElement.clientHeight
            });
        }

        render() {
            const { width, height } = this.state;
            return <WrappedComponent dimensions={{ width, height }} {...this.props} />;
        }
    };
}
