
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import values from 'lodash/values';
import reduce from 'lodash/reduce';

import GlyphCollection from '~/models/GlyphCollection';
import TextCollection from '~/models/TextCollection';
import { triangulatGlyphsForText } from '~/FontUtils';
import { getText, getFontFamily } from '~/redux/text';
import { getSelectedId } from '~/redux/selection';
import { Toolbars, getActiveToolbar } from '~/redux/toolbars';

function mapStateToProps(state) {
    return {
        activeToolbar: getActiveToolbar(state),
        selectedId: getSelectedId(state),
        text: getText(state),
        fontFamily: getFontFamily(state)
    };
}

export default function provideGlyphs(WrappedComponent) {

    return @connect(mapStateToProps)
    class WrapWithGlyphs extends Component {

        static propTypes = {
            activeToolbar: PropTypes.oneOf(values(Toolbars)).isRequired,
            selectedId: PropTypes.string,
            text: PropTypes.instanceOf(TextCollection).isRequired,
            fontFamily: PropTypes.string.isRequired
        }

        state = {
            glyphs: new GlyphCollection()
        }

        componentDidMount() {
            this.updateGlyphs(this.props.text);
        }

        componentDidUpdate(prevProps) {
            const fontChanged = prevProps.fontFamily !== this.props.fontFamily;
            const textChanged = prevProps.text !== this.props.text;
            const selectionChanged = prevProps.selectedId !== this.props.selectedId;
            const toolbarChanged = prevProps.activeToolbar !== this.props.activeToolbar;
            if (fontChanged ||
                textChanged ||
                selectionChanged ||
                toolbarChanged) {
                this.updateGlyphs(this.props.text);
            }
        }

        updateGlyphs(texts) {
            if (!texts) {
                return this.setState({
                    glyphs: new GlyphCollection()
                });
            }
            const shouldRemoveCurrentText = this.props.activeToolbar === Toolbars.Text;
            const allButSelectedText = shouldRemoveCurrentText ? texts.removeById(this.props.selectedId) : texts;
            const glyphs = reduce(allButSelectedText.toArray(), (sum, text) => {
                if (!text.getValue()) {
                    return sum;
                }
                const triangles = triangulatGlyphsForText(text,
                                                          this.props.fontFamily);
                return sum.concat(new GlyphCollection(triangles));
            }, new GlyphCollection());
            this.setState({
                glyphs
            });
        }

        render() {
            return (
                <WrappedComponent glyphs={this.state.glyphs} {...this.props}/>
            );
        }
    };
}
