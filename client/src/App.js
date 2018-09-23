import React from 'react';
import {hydrate} from 'react-dom'
import AppRouterContainer from './containers/AppRouterContainer'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import reducers from './reducers'

let store = createStore(reducers, {}, applyMiddleware(thunkMiddleware, logger))
const App = props =>
    <Provider store={store}>
        <BrowserRouter>
            <AppRouterContainer/>
        </BrowserRouter>
    </Provider>

export default App