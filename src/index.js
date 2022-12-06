import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import scoreReducer from "./components/scoreReducer";
import livesReducer from "./components/livesReducer";
import App from "./components/App";

const MOUNT_NODE = document.getElementById("app");
const rootReducer = combineReducers({
  reduxScore: scoreReducer,
  reduxLives: livesReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  MOUNT_NODE
);
