
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { autobind } from 'core-decorators';

import styles from './FeatureToggle.styles';

@Radium
@autobind
export default class FeatureToggle extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        enabled: PropTypes.bool.isRequired,
        onRequestEnable: PropTypes.func.isRequired,
        onRequestDisable: PropTypes.func.isRequired
    }

    render() {
        const { name, accentColor, onRequestEnable, onRequestDisable } = this.props;
        return (
            <div style={styles.container} onClick={this.openColorPicker}>
                <h3 style={styles.title({ accentColor })}>{name}</h3>
                <div style={styles.inner({ accentColor })}>
                    <select style={styles.select({ accentColor })}
                            key="select"
                            value={this.props.enabled ? 'on' : 'off'}
                            onChange={e => {
                                if (e.target.value === 'on') {
                                    return onRequestEnable();
                                }
                                return onRequestDisable();
                            }}>
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </select>
                </div>
            </div>
        );
    }
}
