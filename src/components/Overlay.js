
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import values from 'lodash/values';

import { OverlayKind } from '~/pages/constants';
import styles from './Overlay.styles';

@Radium
@autobind
export default class Overlay extends Component {

    static propTypes = {
        backgroundImage: PropTypes.string,
        accentColor: PropTypes.string.isRequired,
        kind: PropTypes.oneOf(values(OverlayKind)),
        renderWelcomeScreen: PropTypes.func.isRequired,
        renderWelcomeScreenPart2: PropTypes.func.isRequired,
        renderThankYouScreen: PropTypes.func.isRequired
    }

    render() {
        const { kind, backgroundImage } = this.props;
        const showOverlay = !!kind;
        return (
            <div style={styles.container}>
                <div style={[styles.overlay(backgroundImage), showOverlay && styles.overlayVisible]}>
                    {this.renderOverlayScreen()}
                </div>
                <div style={styles.children}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    renderOverlayScreen() {
        switch (this.props.kind) {
            case OverlayKind.Welcome:
                return this.props.renderWelcomeScreen();
            case OverlayKind.WelcomePart2:
                return this.props.renderWelcomeScreenPart2();
            case OverlayKind.ThankYou:
                return this.props.renderThankYouScreen();
        }
    }
}
