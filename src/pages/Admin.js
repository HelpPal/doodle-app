/* globals CONFIG */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import fetch from 'isomorphic-fetch';
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

import { api } from '~/constants';
import { getAccentColor } from '~/redux/app';
import styles from './Admin.styles';

function getAsset(asset) {
    return `${CONFIG.s3.bucketUrl}/${encodeURIComponent(asset)}`;
}

function mapStateToProps(state) {
    return {
        accentColor: getAccentColor(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

@connect(mapStateToProps, mapDispatchToProps)
@Radium
@autobind
export default class Admin extends Component {

    static propTypes = {
        accentColor: PropTypes.string.isRequired
    }

    state = {
      doodles: []
    };

    componentDidMount() {
      this.intervalTimer = setInterval(() => {
        this.fetchImages();
      }, 1000);
    }

    fetchImages() {
      Promise.resolve(fetch(`http://${api.host}:${api.port}/api/media/doodles`))
        .then(res => res.json())
        .then(doodles => {
          this.setState({
            doodles
          });
        });
    }

    render() {
        const { accentColor } = this.props;
        const doodles = sortBy(this.state.doodles, doodle => doodle.dateTimeUpdated);
        const rows = chunk(reverse(doodles), 3);
        return (
          <div style={styles.container}>
            <h1 style={styles.title({ accentColor })}>Uploads</h1>
            <div>
              {rows.map(row => (
                <div style={styles.row}>
                  {row.map(doodle => (
                    <div key={doodle.key} style={styles.imageContainer}>
                      <img src={getAsset(doodle.key)} style={styles.image}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
    }
}
