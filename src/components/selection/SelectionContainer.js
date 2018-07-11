
import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import merge from 'lodash/merge';
import values from 'lodash/values';
import includes from 'lodash/includes';
import Promise from 'bluebird';

import provideDimensions from '../provideDimensions';
import CurrentSelection from './CurrentSelection';
import styles from './SelectionContainer.styles';
import { Toolbars,
         getActiveToolbar,
         isCurrentSelectionShown } from '../../redux/toolbars';
import { attemptToSelectPoint,
         transformSelection,
         getSelectionPosition,
         getSelectedId,
         resetSelection } from '../../redux/selection';
import { createTextAsCurrentSelection } from '../../redux/text';
import TextSelection from './TextSelection';
import { DEFAULT_SELECTION_WIDTH,
         DEFAULT_SELECTION_HEIGHT } from '../../constants';

const defaultSelectionSize = {
    width: DEFAULT_SELECTION_WIDTH,
    height: DEFAULT_SELECTION_HEIGHT
};

function mapStateToProps(state) {
    return {
        hasCurrentSelection: !!getSelectedId(state),
        showSelection: isCurrentSelectionShown(state),
        activeToolbar: getActiveToolbar(state),
        position: getSelectionPosition(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        attemptToSelectPoint: point => dispatch(attemptToSelectPoint(point)),
        transformSelection: transform => dispatch(transformSelection(transform)),
        createTextAsCurrentSelection: point => dispatch(createTextAsCurrentSelection(point)),
        resetSelection: () => dispatch(resetSelection())
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@provideDimensions
export default class SelectionContainer extends Component {

    static propTypes = {
        attemptToSelectPoint: PropTypes.func.isRequired,
        transformSelection: PropTypes.func.isRequired,
        createTextAsCurrentSelection: PropTypes.func.isRequired,
        resetSelection: PropTypes.func.isRequired,
        showSelection: PropTypes.bool.isRequired,
        activeToolbar: PropTypes.oneOf(values(Toolbars)).isRequired,
        style: PropTypes.object,
        position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }).isRequired,
        dimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }

    static defaultProps = {
        position: {
            x: 0,
            y: 0
        }
    }

    componentDidMount() {
        this.selectPromise = Promise.resolve()
            .then(() => this.createNewSelection())
            .then(() => this.focusCurrentSelection());
    }

    componentWillUnmount() {
        this.selectPromise && this.selectPromise.cancel();
    }

    handleSelection(e) {
        if (this.props.hasCurrentSelection) {
            return;
        }
        const point = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY
        };
        Promise.resolve()
            .then(() => this.props.attemptToSelectPoint(point))
            .catch(() => this.createNewSelection(point))
            .finally(() => this.focusCurrentSelection());
    }

    handleClickOutsideSelection(e, point) {
        const domNode = findDOMNode(this);
        if (!domNode.contains(e.target)) {
            return this.props.resetSelection();
        }
        this.selectPromise = Promise.resolve()
            .then(() => this.props.attemptToSelectPoint(point))
            .catch(() => {
                const toolbars = [Toolbars.Text];
                if (includes(toolbars, this.props.activeToolbar)) {
                    return this.createNewSelection(point);
                }
                return this.props.resetSelection();
            })
            .finally(() => this.focusCurrentSelection());
    }

    createNewSelection(point = this.calculateInitialSelectionPosition(), size = defaultSelectionSize) {
        return Promise.resolve()
            .then(() => this.createNewSelectionForCurrentType())
            .then(() => this.props.transformSelection({
                position: point,
                size: size
            }));
    }

    createNewSelectionForCurrentType() {
        switch (this.props.activeToolbar) {
            case Toolbars.Text:
                return this.props.createTextAsCurrentSelection(this.props.position);
        }
    }

    focusCurrentSelection() {
        if (this.currentSelection) {
            this.currentSelection.getWrappedInstance().focus();
        }
    }

    render() {
        return (
            <div style={merge({}, styles.container, this.props.style)}
                 onClick={this.handleSelection.bind(this)}
                 ref={ref => { this.container = ref; }}>
                {this.props.children}
                {this.renderCurrentSelection()}
            </div>
        );
    }

    renderCurrentSelection() {
        if (!this.props.showSelection) {
            return;
        }
        return (
            <CurrentSelection onClickOutsideSelection={this.handleClickOutsideSelection.bind(this)}
                              canvasDimensions={this.props.dimensions}
                              selectionContainerRef={this.container}>
                {this.renderSelectionComponent()}
            </CurrentSelection>
        );
    }

    calculateInitialSelectionPosition() {
        const { width, height } = this.props.dimensions;
        return {
            x: width * 0.5 - DEFAULT_SELECTION_WIDTH / 3,
            y: height * 0.5 - DEFAULT_SELECTION_HEIGHT / 3
        };
    }

    renderSelectionComponent() {
        if (this.props.activeToolbar === Toolbars.Text) {
            return (
                <TextSelection ref={ref => { this.currentSelection = ref; }} />
            );
        }
    }
}
