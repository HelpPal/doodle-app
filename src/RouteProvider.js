
import React from 'react';
import {
    Router,
    Route,
    IndexRoute,
    browserHistory
} from 'react-router';

import App from './App';
import { Editor, Settings, Admin } from './pages';

export default function RouteProvider() {
    return (
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Editor} />
                <Route path="settings" component={Settings}/>
                <Route path="admin" component={Admin}/>
            </Route>
        </Router>
    );
}
