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

export const AppRoutes = () => {
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
	return (
		<Suspense fallback={<Spinner/>}>
			<Switch>
				<Route exact path="/dashboard" component={ Dashboard } />
				<Route exact path="/leads" component={ Leads } />
				<Route exact path="/brokers" component={ Brokers } />
				<Route exact path="/salesteam" component={ SalesTeam } />
				<Redirect to="/dashboard" />
			</Switch>
		</Suspense>
	);
}