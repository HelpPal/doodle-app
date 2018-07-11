
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import map from 'lodash/map';
import toNumber from 'lodash/toNumber';

import {
  getPrintRotation,
  setPrintRotation,
  getAccentColor } from '~/redux/app';

import styles from './ExportPicker.styles';

function mapStateToProps(state) {
    return {
        printRotation: getPrintRotation(state),
        accentColor: getAccentColor(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPrintRotation: printRotation => dispatch(setPrintRotation(printRotation))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class PrintRotationPicker extends Component {

    static propTypes = {
        message: PropTypes.string.isRequired,
        accentColor: PropTypes.string.isRequired,
        printRotation: PropTypes.number.isRequired,
        setPrintRotation: PropTypes.func.isRequired
    }

    render() {
        const { accentColor, message } = this.props;
        return (
            <div style={styles.container} onClick={this.openColorPicker}>
                <h3 style={styles.title({ accentColor })}>{message}</h3>
                <div style={styles.inner({ accentColor })}>
                    <select style={styles.select({ accentColor })}
                            key="select"
                            value={this.props.printRotation}
                            onChange={e => this.props.setPrintRotation(toNumber(e.target.value))}>
                        {map([0, 90, 180, 270], kind => {
                            return (
                                <option value={kind}>{`${kind} degrees`}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}
