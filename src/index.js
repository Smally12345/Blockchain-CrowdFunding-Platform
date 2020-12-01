import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Project from './Project';
import './index.css';
import {Switch,Route, BrowserRouter as Router, Redirect} from 'react-router-dom'

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/project/:paddress" component={Project}/>
    </Switch>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
