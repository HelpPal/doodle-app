import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import Promise from 'bluebird';
import { autobind } from 'core-decorators';
import values from 'lodash/values';

import SquareConstraint from '../general/SquareConstraint';
import ActivityIndicator from '../ActivityIndicator';
import { ExportKind, getExportKind } from '~/redux/app';
import { exportAsPNG, exportAsSVG, exportToPrinter } from './functions';

import styles from './ExportButton.styles';

function mapStateToProps(state) {
    return {
        exportKind: getExportKind(state)
    };
}

@connect(mapStateToProps)
@Radium
@autobind
export default class ExportButton extends Component {

    static propTypes = {
        style: PropTypes.object,
        exportKind: PropTypes.oneOf(values(ExportKind)).isRequired,
        accentColor: PropTypes.string.isRequired,
        onExportEnd: PropTypes.func.isRequired
    }

    state = {
        isLoading: false
    }

    handlePress() {
        this.setState({
            isLoading: true
        });
        Promise.resolve()
            .delay(1500)
            .then(() => this.export())
            .then(() => this.props.onExportEnd())
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
    }

    export() {
        switch (this.props.exportKind) {
            case ExportKind.PNG:
                exportAsPNG();
                break;
            case ExportKind.SVG:
                exportAsSVG();
                break;
            case ExportKind.PRINT:
                exportToPrinter();
                break;
            default:
        }
    }

    render() {
        return (
            <SquareConstraint style={[styles.container, this.props.style]}>
                {this.renderContents()}
            </SquareConstraint>
        );
    }

    renderContents() {
        const { accentColor } = this.props;
        const { isLoading } = this.state;
        return (
            <div style={styles.circle({ accentColor })} onClick={this.handlePress}>
                <ActivityIndicator colorScheme="light" size={40} style={[styles.activity, isLoading && styles.activityVisible]}/>
                <div style={[styles.arrowContainer, !isLoading && styles.arrowContainerVisible]}>
                    <span style={styles.doneButton}>Done</span>
                </div>
            </div>
        );
    }
}
