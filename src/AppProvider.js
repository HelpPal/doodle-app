
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

import LoadingProvider from './LoadingProvider';

export default function AppProvider({ children }) {
    return (
        <ReduxProvider store={store}>
            <LoadingProvider>
                {children}
            </LoadingProvider>
        </ReduxProvider>
    );
}
