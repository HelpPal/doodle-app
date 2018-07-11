
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import $ from 'jquery';

import { getAccentColor, setAccentColor } from '~/redux/app';
import { SquareConstraint } from '~/components/general';

import styles from './AccentColorPicker.styles';

function mapStateToProps(state) {
    return {
        accentColor: getAccentColor(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setAccentColor: color => dispatch(setAccentColor(color))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class AccentColorPicker extends Component {

    static propTypes = {
        message: PropTypes.string.isRequired,
        accentColor: PropTypes.string.isRequired,
        setAccentColor: PropTypes.func.isRequired
    }

    openColorPicker() {
        $(findDOMNode(this.colorInput)).click();
    }

    handleColorChange(e) {
        const color = e.target.value;
        this.props.setAccentColor(color);
    }

    render() {
        const { accentColor, message } = this.props;
        return (
            <SquareConstraint style={styles.container} onClick={this.openColorPicker}>
                <div style={styles.inner}>
                    <input type="color"
                           style={styles.input}
                           value={this.props.accentColor}
                           ref={ref => { this.colorInput = ref; }}
                           onChange={this.handleColorChange}/>
                    <div style={[styles.color, { backgroundColor: accentColor }]}>
                        <h3 style={styles.subtitle}>{message}</h3>
                    </div>
                </div>
            </SquareConstraint>
        );
    }
}
