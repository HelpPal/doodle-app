
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Fonts, getFontFamily, changeFontFamily, getFontSize, changeSelectedFontSize } from '../../redux/text';
import values from 'lodash/values';
import toNumber from 'lodash/toNumber';

class TextToolbar extends Component {

    static propTypes = {
        fontFamily: PropTypes.oneOf(values(Fonts)).isRequired,
        changeFontFamily: PropTypes.func.isRequired,
        fontSize: PropTypes.number,
        changeSelectedFontSize: PropTypes.func.isRequired
    }

    changeFontFamily(e) {
        this.props.changeFontFamily(e.target.value);
    }

    changeFontSize(e) {
        this.props.changeSelectedFontSize(toNumber(e.target.value));
    }

    render() {
        return (
            <div>
                {/* <select onChange={this.changeFontFamily.bind(this)} value={this.props.fontFamily}>
                    <option name="OpenBaskerville">{Fonts.OpenBaskerville}</option>
                    <option name="SourceSans">{Fonts.SourceSans}</option>
                </select>
                <select onChange={this.changeFontSize.bind(this)} value={this.props.fontSize}>
                    <option>{12}</option>
                    <option>{20}</option>
                </select> */}
            </div>
        );
    }
}

export default connect(
    state => ({
        fontFamily: getFontFamily(state),
        fontSize: getFontSize(state)
    }),
    dispatch => ({
        changeFontFamily: fontFamily => dispatch(changeFontFamily(fontFamily)),
        changeSelectedFontSize: fontSize => dispatch(changeSelectedFontSize(fontSize))
    })
)(TextToolbar);
