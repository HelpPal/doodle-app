
/* globals CONFIG */

import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Promise from 'bluebird';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import map from 'lodash/map';

import { getAccentColor } from '~/redux/app';
import { getFontFamily, changeFontFamily } from '~/redux/text';
import styles from './FontPicker.styles';

const GOOGLE_FONTS_URL = `https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=${CONFIG.google.accessKey}`;

function mapStateToProps(state) {
    return {
        accentColor: getAccentColor(state),
        fontFamily: getFontFamily(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeFontFamily: fontFamily => dispatch(changeFontFamily(fontFamily))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class FontPicker extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        fontFamily: PropTypes.string.isRequired,
        changeFontFamily: PropTypes.func.isRequired
    }

    state = {
        fontFamilies: []
    }

    componentDidMount() {
        this.loadingPromise = Promise.resolve()
            .then(() => fetch(GOOGLE_FONTS_URL))
            .then(res => res.json())
            .then(data => {
                this.setState({
                    fontFamilies: map(data.items, item => item.family)
                });
            })
            .catch(error => {
                console.error('Failed to get list of fonts.');
                console.trace(error);
            });
    }

    componentWillUnmount() {
        this.loadingPromise && this.loadingPromise.cancel();
    }

    render() {
        const { accentColor } = this.props;
        return (
            <div style={styles.container} onClick={this.openColorPicker}>
                <h3 style={styles.title({ accentColor })}>Select a font (For SVG, you'll need to download the font and install on your computer locally. All fonts are free from Google Fonts.)</h3>
                <div style={styles.inner({ accentColor })}>
                    <select style={styles.select({ accentColor })}
                            key="select"
                            value={this.props.fontFamily}
                            onChange={e => this.props.changeFontFamily(e.target.value)}>
                        {map(this.state.fontFamilies, fontFamily => {
                            return (
                                <option value={fontFamily}>{fontFamily}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}
