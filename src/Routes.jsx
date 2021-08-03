import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from './components/Spinner';

//Components
const Dashboard = lazy(() => import('./containers/Dashboard'));
const Leads = lazy(() => import('./containers/Leads'));
const Brokers = lazy(() => import('./containers/Brokers'));
const SalesTeam = lazy(() => import('./containers/SalesTeam'));
const Login = lazy(() => import('./containers/Login'));
const Home = lazy(() => import('./containers/Home'));

const Error404 = lazy(() => import('./components/Error404'));
const Error500 = lazy(() => import('./components/Error500'));

let authed = true;

export const AppRoutes = () => {
	checkAuthentication();
	return (
		<Switch>
			<Route exact path="/login" component={Login} />
			<Route path="/" component={Home} />
			<Route path="/404" component={ Error404 } />
			<Route path="/500" component={ Error500 } />
			<Redirect to="/login" />
		</Switch>
	);
}

export const HomeRoutes = () => {
	checkAuthentication();
	return (
		<Suspense fallback={<Spinner/>}>
			<Switch>
				<PrivateRoute authed={authed} exact path="/dashboard" component={ Dashboard } />
				<PrivateRoute authed={authed} exact path="/leads" component={ Leads } />
				<PrivateRoute authed={authed} exact path="/brokers" component={ Brokers } />
				<PrivateRoute authed={authed} exact path="/salesteam" component={ SalesTeam } />
				<PrivateRoute authed={authed} to="/dashboard" />
			</Switch>
		</Suspense>
	);
}

function PrivateRoute ({component: Component, authed, ...rest}) {
	console.log("authed",authed);
	return (
	  <Route
		{...rest}
		render={(props) => authed === true
		  ? <Component {...props} />
		  : <Redirect to={{pathname: '/login'}} />}
	  />
	)
}

const checkAuthentication = () => {
	console.log("localStorage.getItem('loggedInUser')", localStorage.getItem('loggedInUser'))
	setTimeout(function() {
		authed = localStorage.getItem('loggedInUser') ? true : false;
	}, 1000);
}