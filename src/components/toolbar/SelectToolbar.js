
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { updateSelection } from '../../redux/selection';


function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return { updateSelection: id => dispatch(updateSelection(id)) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectToolbar extends Component {

    static propTypes = {
        updateSelection: PropTypes.func.isRequired
    }

    render() {
        return (
            <div/>
        );
    }
}
