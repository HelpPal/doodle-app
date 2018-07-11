
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';

@Radium
export default class ActivityIndicator extends Component {

    static propTypes = {
        style: PropTypes.object,
        accentColor: PropTypes.string.isRequired,
        colorScheme: PropTypes.oneOf([
            'light',
            'dark'
        ]).isRequired,
        size: PropTypes.number.isRequired
    }

    static defaultProps = {
        colorScheme: 'dark',
        size: 20
    }

    render() {
        const { accentColor } = this.props;
        const color = this.props.colorScheme === 'dark' ? accentColor : 'rgba(255,255,255,0.5)';
        return (
            <div style={this.props.style}>
                <Spinner size={this.props.size} color={color} />
            </div>
        );
    }
}
