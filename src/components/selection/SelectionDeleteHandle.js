
import React, { PropTypes, Component } from 'react';
import Radium from 'radium';
import FaClose from 'react-icons/lib/fa/close';
import { connect } from 'react-redux';

import { deleteSelection } from '../../redux/selection';
import styles from './SelectionHandles.styles';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        deleteSelection: () => {
            return dispatch(deleteSelection());
        }
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
export default class SelectionDeleteHandle extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        deleteSelection: PropTypes.func.isRequired
    }

    handleClick(e) {
        e.stopPropagation();
        this.props.deleteSelection();
    }

    render() {
        const { accentColor } = this.props;
        return (
            <div style={[this.props.style, styles.container({ accentColor })]}
                 onClick={this.handleClick.bind(this)}>
                <FaClose style={styles.icon}/>
            </div>
        );
    }
}
