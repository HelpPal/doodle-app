
import React, { Component, PropTypes } from 'react';
import FaClose from 'react-icons/lib/fa/close';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import { autobind } from 'core-decorators';
import keymage from 'keymage';
import values from 'lodash/values';

import { Toolbar, Canvas, SelectionContainer, CanvasDimensions } from '../components';
import WelcomeOverlay from '../components/overlay/WelcomeOverlay';
import WelcomeOverlayPart2 from '../components/overlay/WelcomeOverlayPart2';
import ThankYouOverlay from '../components/overlay/ThankYouOverlay';
import { getAccentColor,
         getLogoImage,
         getStrokeWidth,
         setActiveArtboardPreset,
         getExportKind,
         getPrintRotation,
         getBackgroundImage,
         getWelcomeVideo,
         setUsername,
         getUsername,
         ExportKind } from '~/redux/app';
import { deleteAllPaths } from '~/redux/paths';
import { deleteAllText } from '~/redux/text';
import { deleteAllImages } from '~/redux/images';
import Overlay from '~/components/Overlay';
import { OverlayKind } from './constants';
import {
  exportAsPNG,
  exportAsSVG,
  exportToPrinter,
  exportUpload
} from '~/components/export/functions';

import styles from './Editor.styles';

function mapStateToProps(state) {
    return {
        strokeWidth: getStrokeWidth(state),
        logoImage: getLogoImage(state),
        accentColor: getAccentColor(state),
        exportKind: getExportKind(state),
        printRotation: getPrintRotation(state),
        backgroundImage: getBackgroundImage(state),
        welcomeVideo: getWelcomeVideo(state),
        username: getUsername(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteAllPaths: () => dispatch(deleteAllPaths()),
        deleteAllText: () => dispatch(deleteAllText()),
        deleteAllImages: () => dispatch(deleteAllImages()),
        setActiveArtboardPreset: preset => dispatch(setActiveArtboardPreset(preset)),
        setUsername: username => dispatch(setUsername(username))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class Editor extends Component {

    static propTypes = {
        backgroundImage: PropTypes.string,
        strokeWidth: PropTypes.number.isRequired,
        logoImage: PropTypes.string,
        accentColor: PropTypes.string.isRequired,
        deleteAllPaths: PropTypes.func.isRequired,
        deleteAllText: PropTypes.func.isRequired,
        deleteAllImages: PropTypes.func.isRequired,
        setActiveArtboardPreset: PropTypes.func.isRequired,
        exportKind: PropTypes.oneOf(values(ExportKind)).isRequired,
        printRotation: PropTypes.number.isRequired,
        setUsername: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired
    }

    state = {
        overlayKind: OverlayKind.Welcome
    }

    componentDidMount() {
        keymage('defmod-p', e => {
            e.preventDefault();
            this.export();
        });
        keymage('defmod-enter', e => {
            e.preventDefault();
            this.handleExportEnd();
        });
        keymage('defmod-1', e => {
            e.preventDefault();
            this.props.setActiveArtboardPreset('1');
        });
        keymage('defmod-2', e => {
            e.preventDefault();
            this.props.setActiveArtboardPreset('2');
        });
        keymage('defmod-3', e => {
            e.preventDefault();
            this.props.setActiveArtboardPreset('3');
        });
    }

    export() {
      const { printRotation, exportKind, username } = this.props;
      switch (exportKind) {
          case ExportKind.PNG:
              exportAsPNG(username ? `${username}.png` : 'doodle.png', printRotation);
              break;
          case ExportKind.SVG:
              exportAsSVG();
              break;
          case ExportKind.PRINT:
              exportToPrinter(printRotation, () => {
                this.handleExportEnd();
              });
              break;
          case ExportKind.UPLOAD:
            exportUpload(username ? `${username}.png` : 'doodle.png', printRotation);
            break;
      }
    }

    handleClear() {
        return Promise.join(
            this.props.deleteAllPaths(),
            this.props.deleteAllText(),
            this.props.deleteAllImages()
        );
    }

    handleExportEnd() {
        this.setState({ overlayKind: OverlayKind.ThankYou });
        setTimeout(() => {
            this.handleClear();
        }, 1500);
    }

    render() {
        return (
            <div style={styles.container(this.props.backgroundImage)}>
                <Overlay kind={this.state.overlayKind}
                         backgroundImage={this.props.backgroundImage}
                         accentColor={this.props.accentColor}
                         renderWelcomeScreen={() => (
                             <WelcomeOverlay
                                 accentColor={this.props.accentColor}
                                 logoImage={this.props.logoImage}
                                 welcomeVideo={this.props.welcomeVideo}
                                 onRequestNextScreen={() => {
                                     this.setState({
                                         overlayKind: OverlayKind.WelcomePart2
                                     });
                                 }}
                             />
                         )}
                         renderWelcomeScreenPart2={() => (
                             <WelcomeOverlayPart2
                                 accentColor={this.props.accentColor}
                                 logoImage={this.props.logoImage}
                                 enterText="Now Let's Design"
                                 username={this.props.username}
                                 setUsername={this.props.setUsername}
                                 onRequestNextScreen={() => {
                                     this.setState({
                                         overlayKind: null
                                     });
                                 }}
                             />
                         )}
                         renderThankYouScreen={() => (
                             <ThankYouOverlay
                                 accentColor={this.props.accentColor}
                                 onRequestNextScreen={() => {
                                     this.setState({
                                         overlayKind: OverlayKind.Welcome
                                     });
                                 }}
                             />
                         )}>
                    <CanvasDimensions>
                        <SelectionContainer style={styles.canvas}>
                            <FaClose style={styles.exit}
                                     onClick={this.handleClear.bind(this)}/>
                            <Canvas strokeWidth={this.props.strokeWidth} />
                        </SelectionContainer>
                    </CanvasDimensions>

                    {/*
                        TODO
                        ----
                        We should wrap this in a component
                        called ToolbarContainer or something
                        ---
                        #needsrefactor
                    */}
                    <div style={styles.toolbarContainer}>
                        <div style={styles.spacer}/>
                        <Toolbar style={styles.midsection}
                                 accentColor={this.props.accentColor}/>
                        <div style={styles.spacer}/>
                    </div>
                </Overlay>
            </div>
        );
    }
}
