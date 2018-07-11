/* globals CONFIG */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';
import FaPlay from 'react-icons/lib/fa/play-circle-o';

import styles from './WelcomeOverlay.styles';

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(asset)}`;
}

@Radium
@autobind
export default class WelcomeOverlay extends Component {

    static propTypes = {
        logoImage: PropTypes.string,
        accentColor: PropTypes.string.isRequired,
        welcomeVideo: PropTypes.string,
        onRequestNextScreen: PropTypes.func.isRequired
    }

    state = {
        isPlaying: false
    }

    handlePlayVideo() {
        if (!this.video) {
            return;
        }
        const videoSource = getAsset(this.props.welcomeVideo);
        this.video.src = videoSource;
        this.video.play();
    }

    render() {
        const videoSource = getAsset(this.props.welcomeVideo);
        return (
            <div style={styles.container}>
                <video
                    style={styles.videoContainer}
                    src={videoSource}
                    onPlay={() => this.setState({ isPlaying: true })}
                    onEnded={this.props.onRequestNextScreen}
                    ref={ref => { this.video = ref; }}
                />
                {this.state.isPlaying ? null : (
                    <div>
                        <div style={this.getLogoStyle()}/>
                        <div
                            style={styles.playIconContainer}
                            onClick={this.handlePlayVideo}
                        >
                            <FaPlay
                                color={this.props.accentColor}
                                size={75}
                            />
                        </div>
                    </div>
                )}
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
