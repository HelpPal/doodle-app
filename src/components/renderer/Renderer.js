import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import values from 'lodash/values';
import { autobind } from 'core-decorators';
import omit from 'lodash/omit';
import keys from 'lodash/keys';

import { getStrokeWidth } from '~/redux/app';
import provideGlyphs from '../canvas/utils/provideGlyphs';
import providePaths from '../canvas/utils/providePaths';
import provideImages from '../canvas/utils/provideImages';
import { RendererKinds } from './constants';

import { SvgRenderTarget } from '../svg';

@autobind
export default class Renderer extends Component {

    static propTypes = {
        kind: PropTypes.oneOf(values(RendererKinds)).isRequired
    }

    render() {
        const { kind } = this.props;
        const targetProps = omit(this.props, keys(Renderer.propTypes));
        switch (kind) {
            case RendererKinds.WebGL:
                // TODO
                break;
            case RendererKinds.SVG:
                return (
                    <RendererDataProvider target={SvgRenderTarget} {...targetProps}/>
                );
            default:
                console.error(`Unable to render the specified target: ${kind}`);
                break;
        }
    }
}

function mapStateToProps(state) {
    return {
        strokeWidth: getStrokeWidth(state)
    };
}

@connect(mapStateToProps)
@providePaths
@provideGlyphs
@provideImages
class RendererDataProvider extends Component {

    static propTypes = {
        target: PropTypes.any.isRequired // FIXME
    }

    render() {
        const Target = this.props.target;
        const targetProps = omit(this.props, keys(RendererDataProvider.propTypes));
        return (
            <Target {...targetProps} />
        );
    }
}
