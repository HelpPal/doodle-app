
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { updateSelection } from '../../redux/selection';

class PathToolbar extends Component {

    static propTypes = {
        updateSelection: PropTypes.func.isRequired
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default connect(
    state => ({

    }),
    dispatch => ({
        updateSelection: id => dispatch(updateSelection(id))
    })
)(PathToolbar);
