
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import {
    getSelectedText,
    updateSelectedText,
    getFontFamily,
    getFontSize } from '../../redux/text';
import Text from '../../models/Text';
import styles from './TextSelection.styles';

function mapStateToProps(state) {
    return {
        text: getSelectedText(state),
        fontFamily: getFontFamily(state),
        fontSize: getFontSize(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateSelectedText: text => dispatch(updateSelectedText(text))
    };
}

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
@Radium
export default class TextSelection extends Component {

    static propTypes = {
        text: PropTypes.instanceOf(Text),
        updateSelectedText: PropTypes.func.isRequired,
        fontFamily: PropTypes.string.isRequired,
        fontSize: PropTypes.number
    }

    focus() {
        this.input.focus();
    }

    render() {
        const value = this.props.text ? this.props.text.getValue() : '';
        return (
            <div style={styles.container}>
                <input value={value || ''}
                       autoFocus
                       ref={input => { this.input = input; }}
                       style={[styles.input, this.getFontFamilyStyles()]}
                       onChange={e => this.props.updateSelectedText(e.target.value)}/>
            </div>
        );
    }

    getFontFamilyStyles() {
        return {
            fontFamily: this.props.fontFamily,
            fontSize: this.props.fontSize,
            lineHeight: `${this.props.fontSize || 0}px`
        };
    }
}
