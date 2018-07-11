
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { getActiveArtboardPreset } from '~/redux/app';

function mapStateToProps(state) {
    return {
        preset: getActiveArtboardPreset(state) || { width: 1, height: 1 }
    };
}

export default function provideAspectRatio(WrappedComponent) {

    @connect(mapStateToProps)
    class DimensionsComponent extends Component {

      static propTypes = {
        preset: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number })
      }

        state = {
            width: '100%',
            height: '100%'
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
            return (
              <div style={{
                display: 'flex',
                flex: 1,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <WrappedComponent dimensions={this.getAspectRatioDimensions()} {...this.props} />
              </div>
            );
        }

        getAspectRatioDimensions() {
          const { width: screenWidth, height: screenHeight } = this.state;
          const { preset } = this.props;
          const isLandscape = preset.width > preset.height;
          const landscapeHeight = (preset.height / preset.width) * screenWidth;
          if (isLandscape && landscapeHeight <= screenHeight) {
              return {
                  width: screenWidth,
                  height: (preset.height / preset.width) * screenWidth
              };
          }
          return {
              width: (preset.width / preset.height) * screenHeight,
              height: screenHeight
          };
        }
    }

    return DimensionsComponent;
}
