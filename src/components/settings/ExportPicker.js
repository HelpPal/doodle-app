
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import values from 'lodash/values';
import map from 'lodash/map';

import {
  ExportKind,
  getExportKind,
  setExportKind,
  getAccentColor
} from '~/redux/app';

import styles from './ExportPicker.styles';

function getExportDescription(exportKind) {
    switch (exportKind) {
        case ExportKind.PNG:
            return 'png (Image)';
        case ExportKind.SVG:
            return 'svg (Adobe Illustrator)';
        case ExportKind.PRINT:
            return 'printer';
        case ExportKind.UPLOAD:
            return 'upload';
    }
}

function mapStateToProps(state) {
    return {
        exportKind: getExportKind(state),
        accentColor: getAccentColor(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setExportKind: exportKind => dispatch(setExportKind(exportKind))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class ExportPicker extends Component {

    static propTypes = {
        message: PropTypes.string.isRequired,
        accentColor: PropTypes.string.isRequired,
        exportKind: PropTypes.oneOf(values(ExportKind)).isRequired
    }

    render() {
        const { accentColor, message } = this.props;
        return (
            <div style={styles.container} onClick={this.openColorPicker}>
                <h3 style={styles.title({ accentColor })}>{message}</h3>
                <div style={styles.inner({ accentColor })}>
                    <select style={styles.select({ accentColor })}
                            key="select"
                            value={this.props.exportKind}
                            onChange={e => this.props.setExportKind(e.target.value)}>
                        {map([ExportKind.PNG, ExportKind.PRINT, ExportKind.UPLOAD], kind => {
                            return (
                                <option value={kind}>{getExportDescription(kind)}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}
