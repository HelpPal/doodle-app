
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import Promise from 'bluebird';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import first from 'lodash/first';

import { isActivePathShown } from '~/redux/toolbars';
import { getPaths, createPath } from '~/redux/paths';
import PathCollection from '~/models/PathCollection';
import Path from '~/models/Path';
import { SELECTION_PADDING, PATH_PADDING } from '~/constants';

function mapStateToProps(state) {
    return {
        isActivePathShown: isActivePathShown(state),
        paths: getPaths(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createPath: path => dispatch(createPath(path))
    };
}

export default function providePaths(WrappedComponent) {

    @connect(mapStateToProps, mapDispatchToProps)
    class ActivePathWrapper extends Component {

        static propTypes = {
            createPath: PropTypes.func.isRequired,
            paths: PropTypes.instanceOf(PathCollection).isRequired,
            isActivePathShown: PropTypes.bool.isRequired
        }

        state = {
            path: new Path({
                position: {
                    x: 0,
                    y: 0
                },
                padding: PATH_PADDING
            })
        }

        constructor(props) {
            super(props);
            this._handleMouseDown = this.handleMouseDown.bind(this);
            this._handleMouseUp = this.handleMouseUp.bind(this);
            this._handleMouseMove = this.handleMouseMove.bind(this);
            this._handleTouchMove = this.handleTouchMove.bind(this);
        }

        componentDidMount() {
            if (this.props.isActivePathShown) {
                this.startTrackingPath();
            }
        }

        componentWillUnmount() {
            const domElement = findDOMNode(this);
            domElement.removeEventListener('mousedown', this._handleMouseDown);
            domElement.removeEventListener('touchstart', this._handleMouseDown);
            window.removeEventListener('mouseup', this._handleMouseUp);
            window.removeEventListener('touchend', this._handleMouseDown);
            this.savingPromise && this.savingPromise.cancel();
        }

        componentDidUpdate(prevProps) {
            const pathActivityChanged = prevProps.isActivePathShown !== this.props.isActivePathShown;
            if (pathActivityChanged && this.props.isActivePathShown) {
                this.startTrackingPath();
            }
        }

        startTrackingPath() {
            const domElement = findDOMNode(this);
            domElement.addEventListener('mousedown', this._handleMouseDown);
            domElement.addEventListener('touchstart', this._handleMouseDown);
        }

        handleMouseDown() {
            const domElement = findDOMNode(this);
            domElement.addEventListener('mousemove', this._handleMouseMove);
            domElement.addEventListener('touchmove', this._handleTouchMove);
            window.addEventListener('mouseup', this._handleMouseUp);
            window.addEventListener('touchend', this._handleMouseUp);
        }

        handleMouseUp() {
            const domElement = findDOMNode(this);
            domElement.removeEventListener('mousemove', this._handleMouseMove);
            domElement.removeEventListener('touchmove', this._handleTouchMove);
            this.saveActivePath();
        }

        handleMouseMove(event) {
            return this.pushVertex({
                x: event.offsetX,
                y: event.offsetY
            });

        }

        handleTouchMove(event) {
            const touch = first(event.touches);
            const rect = event.target.getBoundingClientRect();
            const offsetX = touch.pageX - rect.left;
            const offsetY = touch.pageY - rect.top;
            return this.pushVertex({
                x: offsetX,
                y: offsetY
            });
        }

        pushVertex({ x, y }) {
            if (!this.props.isActivePathShown) {
                return;
            }
            const path = this.state.path.pushVertex({ x, y });
            const position = calculatePositionFromMinVertex(path);
            this.setState({
                path: path.setPadding(PATH_PADDING)
                          .setPosition(position)
            });
        }

        saveActivePath() {
            this.savingPromise = Promise.resolve()
                .then(() => this.props.createPath(this.state.path))
                .then(() => {
                    return this.setState({
                        path: new Path({
                            position: { x: 0, y: 0 },
                            padding: PATH_PADDING
                        })
                    });
                });
        }

        render() {
            const componentProps = omit(this.props, keys(ActivePathWrapper.propTypes));
            return (
                <WrappedComponent paths={this.getPaths()} {...componentProps}/>
            );
        }

        getPaths() {
            return this.props.paths.push(this.state.path);
        }
    }

    return ActivePathWrapper;
}

function calculatePositionFromMinVertex(path) {
    return {
        x: path.getMinX(),
        y: path.getMinY()
    };
}
