
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';

import styles from './ThankYouOverlay.styles';

@Radium
@autobind
export default class ThankYouOverlay extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        thankYouDuration: PropTypes.number.isRequired,
        onRequestNextScreen: PropTypes.func.isRequired,
        setUsername: PropTypes.func.isRequired,
        username: PropTypes.string
    }

    static defaultProps = {
        thankYouDuration: 8000
    }

    componentDidMount() {
        this.thankYouTimeout = setTimeout(() => {
            this.props.onRequestNextScreen();
        }, this.props.thankYouDuration);
    }

    componentWillUnmount() {
        this.thankYouTimeout && clearTimeout(this.thankYouTimeout);
    }

    render() {
        const { accentColor } = this.props;
        return (
            <div style={styles.container}>
                <h1 style={styles.text({ accentColor })}>Thank You</h1>
            </div>
        );
    }
}
