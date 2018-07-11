/* globals CONFIG */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import WebFont from 'webfontloader';
import opentype from 'opentype.js';

import { loadAppData } from './redux/app';
import { getFontPath, loadTextData } from './redux/text';
import { api } from '~/constants';

function mapStateToProps(state): {} {
    return {
        fontPath: getFontPath(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAppData: () => dispatch(loadAppData()),
        loadTextData: () => dispatch(loadTextData())
    };
}

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(getAsset)}`;
}

function getFontFileUrl(fontPath) {
    return fontPath && getAsset(fontPath);
}

function getFontCssUrl(fontPath, fontFamily) {
    return fontPath && fontFamily && `http://${api.host}:${api.port}/api/uploads/${encodeURIComponent(fontPath)}/css?fontFamily=${encodeURIComponent(fontFamily)}`;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LoadingProvider extends Component {

    static propTypes = {
        fontPath: PropTypes.string,
        loadAppData: PropTypes.func.isRequired,
        loadTextData: PropTypes.func.isRequired
    }

    state = {
        isLoading: true
    }

    componentDidMount() {
        this.loadingPromise = this.loadData()
               .then(() => {
                   this.setState({
                       isLoading: false
                   });
               });
    }

    componentWillUnmount() {
        this.loadingPromise && this.loadingPromise.cancel();
    }

    componentWillUpdate(nextProps) {
        if (this.props.fontPath !== nextProps.fontPath) {
            this.loadFontFamily(nextProps.fontPath);
        }
    }

    loadData() {
        return Promise.join(
            this.props.loadAppData(),
            this.props.loadTextData()
        );
    }

    loadFontFamily(fontPath) {
      const fontFileUrl = getFontFileUrl(fontPath);
      opentype.load(fontFileUrl, (err, font) => {
        if (err) {
          throw err;
        }
        const fontFamily = font.names.fullName.en;
        WebFont.load({
            custom: {
                families: [fontFamily],
                urls: [getFontCssUrl(fontPath, fontFamily)]
            }
        });
      });
    }

    render() {
        // hide when this.state.isLoading === true
        return this.props.children;
    }
}
