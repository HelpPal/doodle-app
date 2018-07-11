import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';

import styles from './CanvasDimensionPicker.styles';
import { getAccentColor, getArtboardPreset, setArtBoardPreset } from '~/redux/app';

function mapStateToProps(state, { presetID }) {
    return {
        accentColor: getAccentColor(state),
        preset: getArtboardPreset(state, presetID)
    };
}

function mapDispatchToProps(dispatch) {
    return {
      setArtBoardPreset: (presetID, width, height) => dispatch(setArtBoardPreset(presetID, width, height))
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
class CanvasDimensionPicker extends Component {

  static propTypes = {
    accentColor: PropTypes.string.isRequired,
    presetID: PropTypes.string.isRequired,
    preset: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }),
    setArtBoardPreset: PropTypes.func.isRequired
  }

  render() {
    const { accentColor, presetID, preset } = this.props;
    return (
      <div style={styles.container}>
        <h3 style={styles.title({ accentColor })}>{`Preset #${presetID} (Ctrl-${presetID})`}</h3>
        <input style={styles.input({ accentColor })}
               placeholder="width"
               value={(preset && preset.width) ? preset.width : ''}
               onChange={e => this.props.setArtBoardPreset(
                 presetID,
                 e.target.value,
                 preset ? preset.height : 0)}/>
        <input style={styles.input({ accentColor })}
               placeholder="height"
               value={(preset && preset.height) ? preset.height : ''}
               onChange={e => this.props.setArtBoardPreset(
                 presetID,
                 preset ? preset.width : 0,
                 e.target.value)}/>
      </div>
    );
  }
}

export default CanvasDimensionPicker;
