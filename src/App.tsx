import React from 'react';
// import './App.css';

import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ConnectedTreeVisualizer } from './modules/visualization/TreeVisualizer';

import { rootReducer } from './modules/rootReducer'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <ConnectedTreeVisualizer />
    </Provider>
  );
}

export default App;
