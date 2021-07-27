import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from './components/Spinner';

const Dashboard = lazy(() => import('./containers/Dashboard'));
const Leads = lazy(() => import('./containers/Leads'));
const Brokers = lazy(() => import('./containers/Brokers'));
const SalesTeam = lazy(() => import('./containers/SalesTeam'));
const Login = lazy(() => import('./containers/Login'));

const Error404 = lazy(() => import('./components/Error404'));
const Error500 = lazy(() => import('./components/Error500'));


class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/dashboard" component={ Dashboard } />
          <Route exact path="/leads" component={ Leads } />
          <Route exact path="/brokers" component={ Brokers } />
          <Route exact path="/salesteam" component={ SalesTeam } />
          <Route exact path="/login" component={ Login } />

          <Route path="/404" component={ Error404 } />
          <Route path="/500" component={ Error500 } />

          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;