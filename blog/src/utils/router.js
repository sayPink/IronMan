import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import store from '../store'
import { persistor } from '../store'

import App from "../App"; 
import Home from "../view/home/index"; 
import Blog from "../view/blog/index";
import Detail from "../view/blog/detail";

// const store  = configureStore()

const router = (
  <Router>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App>
          <Switch> {/*Renders the first child <Route> or <Redirect> that matches the location.*/}
            <Route path="/home" component={Home} />
            <Route path="/blog" exact component={Blog} />
            <Route path="/blog/detail/:id" component={Detail} />
            <Redirect from="/" to="/home" />
          </Switch>
        </App>
      </PersistGate>
    </Provider>
  </Router>
) 

export default router; 