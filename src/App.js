
import React, { Component } from 'react';

import AppProvider from './AppProvider';

export default class App extends Component {
    render() {
        return (
            <AppProvider>
                {this.props.children}
            </AppProvider>
        );
    }
}
