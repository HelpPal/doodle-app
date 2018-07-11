/* globals CONFIG */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';

import ActivityIndicator from '~/components/ActivityIndicator';

import styles from './WelcomeOverlayPart2.styles';

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(asset)}`;
}

@Radium
@autobind
export default class WelcomeOverlayPart2 extends Component {

    static propTypes = {
        logoImage: PropTypes.string,
        accentColor: PropTypes.string.isRequired,
        enterText: PropTypes.string.isRequired,
        loadingDuration: PropTypes.number.isRequired,
        onRequestNextScreen: PropTypes.func.isRequired,
        setUsername: PropTypes.func.isRequired,
        username: PropTypes.string
    }

    static defaultProps = {
        loadingDuration: 1000
    }

    state = {
        showEnterButton: false
    }

    componentDidMount() {
        this.loadingTimeout = setTimeout(() => {
            this.setState({
                showEnterButton: true
            });
        }, this.props.loadingDuration);
    }

    componentWillUnmount() {
        this.loadingTimeout && clearTimeout(this.loadingTimeout);
    }

    render() {
        const { accentColor } = this.props;
        const { showEnterButton } = this.state;
        return (
            <div style={styles.container}>
                <div style={styles.inputContainer({ accentColor })}>
                    <input
                        placeholder="Enter Name..."
                        value={this.props.username}
                        onChange={e => this.props.setUsername(e.target.value)}
                        style={styles.input({ accentColor })}
                    />
                </div>
                <div style={styles.enterButtonContainer}>
                    <ActivityIndicator style={[styles.activity, !showEnterButton && styles.activityVisible]}
                                       accentColor={accentColor} />
                    <button style={[styles.enterButton({ accentColor }), showEnterButton && styles.enterButtonVisible]}
                            onClick={this.props.onRequestNextScreen}>
                        {this.props.enterText}
                    </button>
                </div>
            </div>
        );
    }

    getLogoStyle() {
        const { logoImage } = this.props;
        return logoImage && {
            ...styles.logo,
            backgroundImage: `url(${getAsset(logoImage)})`
        };
    }
}
