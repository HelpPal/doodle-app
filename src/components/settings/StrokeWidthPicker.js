
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import toNumber from 'lodash/toNumber';
import range from 'lodash/range';
import map from 'lodash/map';

import { getAccentColor,
         getStrokeWidth,
         setStrokeWidth } from '~/redux/app';

import styles from './StrokeWidthPicker.styles';

function mapStateToProps(state) {
    return {
        accentColor: getAccentColor(state),
        strokeWidth: getStrokeWidth(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setStrokeWidth: strokeWidth => dispatch(setStrokeWidth(strokeWidth))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class StrokeWidthPicker extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        strokeWidth: PropTypes.number.isRequired,
        setStrokeWidth: PropTypes.func.isRequired
    }

    render() {
        const { accentColor, strokeWidth } = this.props;
        return (
            <div style={styles.container}>
                <h3 style={styles.title({ accentColor })}>Select the stroke width</h3>
                <div style={styles.inner({ accentColor })} key="inner">
                   <select style={styles.select({ accentColor })}
                           key="select"
                           value={strokeWidth}
                           onChange={e => this.props.setStrokeWidth(toNumber(e.target.value))}>
                       {map(range(2, 50), fontFamily => {
                           return (
                               <option>{fontFamily}</option>
                           );
                       })}
                   </select>
                </div>
            </div>
        );
    }
}
