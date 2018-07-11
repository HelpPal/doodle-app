
import React, { PropTypes, Component } from 'react';
import Radium from 'radium';

import provideAspectRatio from '../provideAspectRatio';

const styles = {
    container: {
        width: '100%',
        height: '100%'
    }
};

@provideAspectRatio
@Radium
export default class CanvasDimensions extends Component {

    static propTypes = {
        dimensions: PropTypes.shape({
            width: PropTypes.any,
            height: PropTypes.any
        })
    }

    render() {
        return (
            <div style={[styles.container, this.props.dimensions]}>
                {this.props.children}
            </div>
        );
    }
}
